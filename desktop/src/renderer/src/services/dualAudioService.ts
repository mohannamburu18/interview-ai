import { SpeakerType } from '../types';
import { GroqService } from './groqService';

export interface AudioCaptureCallbacks {
  onTranscript: (text: string, speaker: SpeakerType, isFinal: boolean) => void;
  onVolumeChange: (systemVolume: number, micVolume: number) => void;
  onSpeechStart: (speaker: SpeakerType) => void;
  onSilenceDetected: (speaker: SpeakerType, fullTranscript: string) => void;
}

const GARBAGE_PATTERNS = [
  /^thank you(\.|\!|\,)?$/i,
  /^thanks(\.|\!|\,)?$/i,
  /^thanks for watching(\.|\!|\,)?$/i,
  /^please subscribe(\.|\!|\,)?$/i,
  /^subtitles by/i,
  /^bye(\.|\!|\,)?$/i,
  /^yeah(\.|\!|\,)?$/i,
  /^yes(\.|\!|\,)?$/i,
  /^okay(\.|\!|\,)?$/i,
  /^ok(\.|\!|\,)?$/i,
  /^uh(\.|\!|\,)?$/i,
  /^um(\.|\!|\,)?$/i,
  /^you know(\.|\!|\,)?$/i,
  /^\[.*\]$/, // [Music], [Applause], [Silence]
  /^\(.*\)$/,
];

/**
 * Filter out hallucinations and single-word filler noise
 */
export function isValidTranscript(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();

  if (trimmed.length < 4) return false;

  for (const pattern of GARBAGE_PATTERNS) {
    if (pattern.test(trimmed)) return false;
  }

  return true;
}

export class DualAudioCaptureEngine {
  private isRunning: boolean = false;
  private audioContext: AudioContext | null = null;
  private systemStream: MediaStream | null = null;
  private micStream: MediaStream | null = null;
  private combinedStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  private systemAnalyser: AnalyserNode | null = null;
  private micAnalyser: AnalyserNode | null = null;
  private animationFrameId: number | null = null;
  private recordIntervalTimer: NodeJS.Timeout | null = null;

  private currentSpeaker: SpeakerType = 'interviewer';
  private hasSpeechInSlice: boolean = false;
  private recentTranscriptContext: string = '';

  constructor(
    private callbacks: AudioCaptureCallbacks,
    private groqApiKey: string,
    private language: string = 'en'
  ) {}

  public updateApiKey(key: string) {
    this.groqApiKey = key;
  }

  public updateLanguage(lang: string) {
    this.language = lang;
  }

  /**
   * Initializes audio capture from mic and system loopback
   */
  public async start(): Promise<{ systemCaptured: boolean; micCaptured: boolean }> {
    this.isRunning = true;
    let systemCaptured = false;
    let micCaptured = false;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioContextClass();

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const destination = this.audioContext.createMediaStreamDestination();

    // 1. Capture Microphone
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });

      if (this.micStream && this.micStream.getAudioTracks().length > 0) {
        micCaptured = true;
        console.log('Mic Stream Tracks:', this.micStream.getAudioTracks().length);
        const micSource = this.audioContext.createMediaStreamSource(this.micStream);
        this.micAnalyser = this.audioContext.createAnalyser();
        this.micAnalyser.fftSize = 256;
        this.micAnalyser.smoothingTimeConstant = 0.2;
        micSource.connect(this.micAnalyser);
        micSource.connect(destination);

        if (window.parakeetAPI?.audio?.logDebug) {
          window.parakeetAPI.audio.logDebug('Mic Captured: true');
        }
      }
    } catch (err) {
      console.warn('[AudioEngine] Mic capture warning:', err);
    }

    // 2. Capture System Loopback (Interviewer Audio)
    try {
      let systemSourceId: string | null = null;
      if (window.parakeetAPI?.audio?.getSystemSourceId) {
        systemSourceId = await window.parakeetAPI.audio.getSystemSourceId();
      }

      if (systemSourceId) {
        this.systemStream = await (navigator.mediaDevices as any).getUserMedia({
          audio: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: systemSourceId,
            },
          },
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: systemSourceId,
            },
          },
        });
      }

      if (this.systemStream && this.systemStream.getAudioTracks().length > 0) {
        systemCaptured = true;
        console.log('System Audio Tracks:', this.systemStream.getAudioTracks().length);
        const sysSource = this.audioContext.createMediaStreamSource(this.systemStream);
        this.systemAnalyser = this.audioContext.createAnalyser();
        this.systemAnalyser.fftSize = 256;
        this.systemAnalyser.smoothingTimeConstant = 0.2;
        sysSource.connect(this.systemAnalyser);
        sysSource.connect(destination);

        if (window.parakeetAPI?.audio?.logDebug) {
          window.parakeetAPI.audio.logDebug('System Audio Captured: true');
        }
      }
    } catch (err) {
      console.warn('[AudioEngine] System loopback warning:', err);
    }

    // 3. Combined Stream for Continuous Recording
    this.combinedStream = destination.stream;
    const finalStream = this.combinedStream.getAudioTracks().length > 0 ? this.combinedStream : this.micStream;

    if (finalStream) {
      console.log('Recording stream active tracks:', finalStream.getAudioTracks().length);
      this.startContinuousRecording(finalStream);
      this.startVolumeMonitoring();
    }

    return { systemCaptured, micCaptured };
  }

  /**
   * Continuous 5-second slice recording with seamless auto-restart
   */
  private startContinuousRecording(stream: MediaStream) {
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm';

    const cycleSlice = () => {
      if (!this.isRunning) return;

      try {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
          this.mediaRecorder.stop();
        }

        this.mediaRecorder = new MediaRecorder(stream, { mimeType });
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            this.audioChunks.push(e.data);
          }
        };

        this.mediaRecorder.onstop = async () => {
          if (this.audioChunks.length > 0 && this.hasSpeechInSlice) {
            const blob = new Blob(this.audioChunks, { type: mimeType });
            this.audioChunks = [];
            this.hasSpeechInSlice = false;

            console.log('BLOB SIZE:', blob.size);

            if (blob.size >= 2000 && this.groqApiKey) {
              try {
                const text = await GroqService.transcribeAudio(
                  blob,
                  this.groqApiKey,
                  this.language,
                  this.recentTranscriptContext
                );

                if (text && isValidTranscript(text)) {
                  this.recentTranscriptContext = text.trim();
                  const speaker = this.systemStream ? this.currentSpeaker : this.classifySpeaker(text);
                  console.log('TRANSCRIPT:', text.trim(), `[Speaker: ${speaker}]`);
                  this.callbacks.onTranscript(text.trim(), speaker, true);
                  this.callbacks.onSilenceDetected(speaker, text.trim());
                }
              } catch (err) {
                console.error('Transcription error:', err);
              }
            }
          }
        };

        this.mediaRecorder.start();
      } catch (err) {
        console.warn('[Recorder Cycle Error]:', err);
      }
    };

    cycleSlice();
    this.recordIntervalTimer = setInterval(cycleSlice, 5000);
  }

  /**
   * Real-time Volume & Speaker Diarization Monitoring
   */
  private startVolumeMonitoring() {
    const checkVolume = () => {
      if (!this.isRunning) return;

      let sysVol = 0;
      let micVol = 0;

      if (this.systemAnalyser) {
        const sysBuffer = new Uint8Array(this.systemAnalyser.frequencyBinCount);
        this.systemAnalyser.getByteFrequencyData(sysBuffer);
        const sysAvg = sysBuffer.reduce((a, b) => a + b, 0) / sysBuffer.length;
        sysVol = sysAvg / 255;
      }

      if (this.micAnalyser) {
        const micBuffer = new Uint8Array(this.micAnalyser.frequencyBinCount);
        this.micAnalyser.getByteFrequencyData(micBuffer);
        const micAvg = micBuffer.reduce((a, b) => a + b, 0) / micBuffer.length;
        micVol = micAvg / 255;
      }

      // Detect speech activity
      if (sysVol > 0.008 || micVol > 0.008) {
        this.hasSpeechInSlice = true;

        if (sysVol > micVol + 0.01) {
          this.currentSpeaker = 'interviewer';
          this.callbacks.onSpeechStart('interviewer');
        } else if (micVol > 0.008) {
          this.currentSpeaker = 'user';
          this.callbacks.onSpeechStart('user');
        }
      }

      this.callbacks.onVolumeChange(sysVol, micVol);
      this.animationFrameId = requestAnimationFrame(checkVolume);
    };

    checkVolume();
  }

  /**
   * Speaker Diarization for single-source mode
   */
  public classifySpeaker(text: string): SpeakerType {
    const trimmed = text.trim().toLowerCase();
    const isQuestion =
      trimmed.endsWith('?') ||
      trimmed.startsWith('what') ||
      trimmed.startsWith('why') ||
      trimmed.startsWith('how') ||
      trimmed.startsWith('when') ||
      trimmed.startsWith('where') ||
      trimmed.startsWith('tell me') ||
      trimmed.startsWith('can you') ||
      trimmed.startsWith('could you') ||
      trimmed.startsWith('describe') ||
      trimmed.startsWith('explain') ||
      trimmed.startsWith('walk me through');

    return isQuestion ? 'interviewer' : 'user';
  }

  public stop(): void {
    this.isRunning = false;
    if (this.recordIntervalTimer) {
      clearInterval(this.recordIntervalTimer);
      this.recordIntervalTimer = null;
    }
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {}
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    if (this.systemStream) {
      this.systemStream.getTracks().forEach((t) => t.stop());
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach((t) => t.stop());
    }
    if (this.combinedStream) {
      this.combinedStream.getTracks().forEach((t) => t.stop());
    }
  }
}
