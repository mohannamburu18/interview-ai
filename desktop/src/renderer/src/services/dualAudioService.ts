import { SpeakerType } from '../types';
import { GroqService } from './groqService';
import { isHallucination, correctTerms, isCandidateVoice } from './promptEngine';

export interface AudioCaptureCallbacks {
  onTranscript: (text: string, speaker: SpeakerType, isFinal: boolean) => void;
  onVolumeChange: (systemVolume: number, micVolume: number) => void;
  onSpeechStart: (speaker: SpeakerType) => void;
  onSilenceDetected: (speaker: SpeakerType, lastTranscript: string) => void;
}

export class DualAudioEngine {
  private audioContext: AudioContext | null = null;
  private systemStream: MediaStream | null = null;
  private micStream: MediaStream | null = null;
  private combinedStream: MediaStream | null = null;
  private systemAnalyser: AnalyserNode | null = null;
  private micAnalyser: AnalyserNode | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private isRunning: boolean = false;
  private callbacks: AudioCaptureCallbacks;
  private groqApiKey: string = '';
  private language: string = 'en';

  private currentSpeaker: SpeakerType = 'interviewer';
  private animationFrameId: number | null = null;
  private audioChunks: Blob[] = [];
  private sliceIntervalTimer: NodeJS.Timeout | null = null;
  private hasSpeechInCurrentSlice: boolean = false;
  private continuousSpeechDurationMs: number = 0;
  private lastFrameTimestamp: number = 0;
  private recentTranscriptContext: string = '';

  // Energy and duration thresholds for Layer 1 & Layer 2
  private readonly LOUDNESS_THRESHOLD = 0.016; // 16/255: Filters fan noise & room background
  private readonly MIN_SPEECH_DURATION_MS = 1200; // 1.2s: Filters keyboard clicks, mouse taps, coughs
  private readonly MIN_BLOB_SIZE = 7000; // 7KB minimum audio blob size

  constructor(callbacks: AudioCaptureCallbacks, groqApiKey?: string, language?: string) {
    this.callbacks = callbacks;
    if (groqApiKey) this.groqApiKey = groqApiKey;
    if (language) this.language = language;
  }

  public setGroqApiKey(key: string) {
    this.groqApiKey = key;
  }

  public setLanguage(lang: string) {
    this.language = lang;
  }

  public async start(): Promise<{ systemCaptured: boolean; micCaptured: boolean }> {
    this.isRunning = true;
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const destination = this.audioContext.createMediaStreamDestination();
    let micCaptured = false;
    let systemCaptured = false;

    // 1. Microphone Capture (Candidate Audio)
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
      console.warn('[AudioEngine] Mic capture error:', err);
    }

    // 2. System Audio Loopback Capture (Interviewer Audio)
    try {
      if (window.parakeetAPI?.audio?.getSystemSourceId) {
        const systemSourceId = (await window.parakeetAPI.audio.getSystemSourceId()) || 'entire-screen';

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
      this.startContinuousRecording(finalStream);
      this.startVolumeMonitoring();
    }

    return { systemCaptured, micCaptured };
  }

  /**
   * Continuous 4.5-second slice recording with seamless auto-restart
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
          // Layer 1 & 2: Only send if real continuous speech was detected
          if (this.audioChunks.length > 0 && this.hasSpeechInCurrentSlice) {
            const blob = new Blob(this.audioChunks, { type: mimeType });
            this.audioChunks = [];
            this.hasSpeechInCurrentSlice = false;
            this.continuousSpeechDurationMs = 0;

            console.log('[AudioEngine] Valid Speech Blob Size:', blob.size);

            // Layer 1 Gate: Audio file size filter
            if (blob.size >= this.MIN_BLOB_SIZE && this.groqApiKey) {
              try {
                const text = await GroqService.transcribeAudio(
                  blob,
                  this.groqApiKey,
                  this.language,
                  this.recentTranscriptContext
                );

                // Layer 3: Strict post-transcription filter
                if (text && !isHallucination(text)) {
                  // Gate 4: Filter candidate self-filler acknowledgments
                  if (this.currentSpeaker === 'user' && isCandidateVoice(text)) {
                    console.log('[AudioEngine] Discarded candidate filler voice:', text);
                    return;
                  }

                  const cleaned = correctTerms(text.trim());
                  this.recentTranscriptContext = cleaned;
                  const speaker = this.systemStream ? this.currentSpeaker : this.classifySpeaker(cleaned);

                  console.log('TRANSCRIPT:', cleaned, `[Speaker: ${speaker}]`);
                  this.callbacks.onTranscript(cleaned, speaker, true);
                  this.callbacks.onSilenceDetected(speaker, cleaned);
                } else if (text) {
                  console.log('[AudioEngine] Discarded hallucination/noise:', text);
                }
              } catch (err) {
                console.error('[AudioEngine] Transcription error:', err);
              }
            }
          } else {
            // Silence or blip ignored
            this.audioChunks = [];
            this.hasSpeechInCurrentSlice = false;
            this.continuousSpeechDurationMs = 0;
          }
        };

        this.mediaRecorder.start();
      } catch (err) {
        console.warn('[Recorder Cycle Error]:', err);
      }
    };

    cycleSlice();
    this.sliceIntervalTimer = setInterval(cycleSlice, 4500);
  }

  /**
   * Real-time Volume & Speaker Diarization Monitoring with Duration Gating (Layer 1 & 2)
   */
  private startVolumeMonitoring() {
    this.lastFrameTimestamp = performance.now();

    const checkVolume = () => {
      if (!this.isRunning) return;

      const now = performance.now();
      const deltaMs = now - this.lastFrameTimestamp;
      this.lastFrameTimestamp = now;

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

      const maxVol = Math.max(sysVol, micVol);

      // Layer 1 & 2: Check loudness & track continuous duration
      if (maxVol > this.LOUDNESS_THRESHOLD) {
        this.continuousSpeechDurationMs += deltaMs;

        if (this.continuousSpeechDurationMs >= this.MIN_SPEECH_DURATION_MS) {
          this.hasSpeechInCurrentSlice = true;

          if (sysVol > micVol + 0.008) {
            this.currentSpeaker = 'interviewer';
            this.callbacks.onSpeechStart('interviewer');
          } else if (micVol > this.LOUDNESS_THRESHOLD) {
            this.currentSpeaker = 'user';
            this.callbacks.onSpeechStart('user');
          }
        }
      } else {
        // Below noise floor, decay speech duration
        this.continuousSpeechDurationMs = Math.max(0, this.continuousSpeechDurationMs - deltaMs * 2);
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
    if (this.sliceIntervalTimer) {
      clearInterval(this.sliceIntervalTimer);
      this.sliceIntervalTimer = null;
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

export { DualAudioEngine as DualAudioCaptureEngine };
