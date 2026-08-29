import { SpeakerType } from '../types';
import { GroqService } from './groqService';
import { isHallucination, correctTerms } from './promptEngine';

export interface AudioCaptureCallbacks {
  onTranscript: (text: string, speaker: SpeakerType, isFinal: boolean) => void;
  onVolumeChange: (systemVolume: number, micVolume: number) => void;
  onSpeechStart: (speaker: SpeakerType) => void;
  onSilenceDetected: (speaker: SpeakerType, fullTranscript: string) => void;
}

export { isHallucination as isValidTranscript };

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

  // Web Speech API for Realtime Instant Interim (<300ms)
  private speechRecognition: any = null;

  // VAD & Silence tracking
  private isSpeaking: boolean = false;
  private isFinalizing: boolean = false;
  private silenceStartTime: number | null = null;
  private currentSpeaker: SpeakerType = 'interviewer';
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
    this.audioContext = new AudioContextClass({ sampleRate: 48000 });

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
        console.log('Mic Stream Active. Tracks:', this.micStream.getAudioTracks().length);
        const micSource = this.audioContext.createMediaStreamSource(this.micStream);
        this.micAnalyser = this.audioContext.createAnalyser();
        this.micAnalyser.fftSize = 512;
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
        console.log('System Audio Active. Tracks:', this.systemStream.getAudioTracks().length);
        const sysSource = this.audioContext.createMediaStreamSource(this.systemStream);
        this.systemAnalyser = this.audioContext.createAnalyser();
        this.systemAnalyser.fftSize = 512;
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

    // 3. Combined Stream for VAD Recording
    this.combinedStream = destination.stream;
    const finalStream = this.combinedStream.getAudioTracks().length > 0 ? this.combinedStream : this.micStream;

    if (finalStream) {
      this.initParakeetRecorder(finalStream);
      this.startVadDetection();
      this.startRealtimeWebSpeech();
    }

    return { systemCaptured, micCaptured };
  }

  /**
   * Realtime Web Speech Recognition for instant interim streaming (<300ms)
   */
  private startRealtimeWebSpeech() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.continuous = true;
      this.speechRecognition.interimResults = true;
      this.speechRecognition.lang = this.language && this.language !== 'auto' ? this.language : 'en-US';

      this.speechRecognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            // Final from WebSpeech handled by Groq for higher accuracy
          } else {
            interim += transcript;
          }
        }

        if (interim.trim() && !isHallucination(interim)) {
          const corrected = correctTerms(interim.trim());
          this.callbacks.onTranscript(corrected, this.currentSpeaker, false);
        }
      };

      this.speechRecognition.onerror = (e: any) => {
        // Ignore expected speech recognition interruptions
      };

      this.speechRecognition.onend = () => {
        if (this.isRunning) {
          try {
            this.speechRecognition?.start();
          } catch (e) {}
        }
      };

      this.speechRecognition.start();
    } catch (err) {
      console.warn('[WebSpeech API] Not available or blocked:', err);
    }
  }

  /**
   * Parakeet VAD-based full-sentence recording with 800ms silence finalization
   */
  private initParakeetRecorder(stream: MediaStream) {
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm';

    this.mediaRecorder = new MediaRecorder(stream, { mimeType });
    this.audioChunks = [];

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.audioChunks.push(e.data);
      }
    };

    this.mediaRecorder.onstop = async () => {
      const blob = new Blob(this.audioChunks, { type: mimeType });
      this.audioChunks = [];
      this.isFinalizing = false;

      if (blob.size >= 3500 && this.groqApiKey) {
        try {
          const contextPrompt = this.recentTranscriptContext
            ? `Previous context: ${this.recentTranscriptContext}`
            : 'Technical interview about Docker, SQL, AWS, Kubernetes, and software engineering.';

          const rawTranscript = await GroqService.transcribeAudio(
            blob,
            this.groqApiKey,
            this.language,
            contextPrompt
          );

          if (rawTranscript && !isHallucination(rawTranscript)) {
            const corrected = correctTerms(rawTranscript.trim());
            this.recentTranscriptContext = corrected;
            const speaker = this.systemStream ? this.currentSpeaker : this.classifySpeaker(corrected);

            console.log('SENTENCE FINALIZED:', corrected, 'Size:', blob.size, 'Speaker:', speaker);
            this.callbacks.onTranscript(corrected, speaker, true);
            this.callbacks.onSilenceDetected(speaker, corrected);
          }
        } catch (err) {
          console.error('[Groq Whisper Finalize Error]:', err);
        }
      }

      // Automatically restart for next sentence
      setTimeout(() => {
        if (this.isRunning && this.mediaRecorder && this.mediaRecorder.state === 'inactive') {
          try {
            this.mediaRecorder.start(100);
          } catch (e) {}
        }
      }, 100);
    };

    try {
      this.mediaRecorder.start(100);
    } catch (e) {}
  }

  /**
   * Real-time VAD speech detection (800ms silence = sentence completion)
   */
  private startVadDetection() {
    const checkSpeech = () => {
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

      const maxLevel = Math.max(sysVol, micVol);
      const now = Date.now();

      // Speaker Classification based on active stream volume
      if (sysVol > micVol + 0.01 && sysVol > 0.012) {
        this.currentSpeaker = 'interviewer';
      } else if (micVol > 0.012) {
        this.currentSpeaker = 'user';
      }

      // Voice Activity Detection
      if (maxLevel > 0.012) {
        // Speaking actively
        this.isSpeaking = true;
        this.silenceStartTime = null;
        this.callbacks.onSpeechStart(this.currentSpeaker);

        if (this.mediaRecorder && this.mediaRecorder.state === 'inactive' && !this.isFinalizing) {
          this.audioChunks = [];
          this.mediaRecorder.start(100);
        }
      } else if (this.isSpeaking) {
        // Silence detected after speech
        if (!this.silenceStartTime) {
          this.silenceStartTime = now;
        } else if (now - this.silenceStartTime > 800 && !this.isFinalizing) {
          // 800ms silence = Finalize full sentence in one go
          this.isFinalizing = true;
          this.isSpeaking = false;
          this.silenceStartTime = null;

          if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
          }
        }
      }

      this.callbacks.onVolumeChange(sysVol, micVol);
      this.animationFrameId = requestAnimationFrame(checkSpeech);
    };

    checkSpeech();
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
    if (this.speechRecognition) {
      try {
        this.speechRecognition.stop();
      } catch (e) {}
      this.speechRecognition = null;
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
