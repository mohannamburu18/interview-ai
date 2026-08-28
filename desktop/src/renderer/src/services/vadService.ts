export class VoiceActivityDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private isRunning: boolean = false;
  private silenceTimer: NodeJS.Timeout | null = null;
  private silenceThresholdMs: number = 800; // 800ms auto question end detection
  private volumeThreshold: number = 0.02; // Normalized threshold
  private onSpeechStart?: () => void;
  private onSilenceDetected?: () => void;
  private onVolumeChange?: (volume: number) => void;
  private isSpeaking: boolean = false;
  private animationFrameId: number | null = null;

  constructor(options?: {
    silenceThresholdMs?: number;
    volumeThreshold?: number;
    onSpeechStart?: () => void;
    onSilenceDetected?: () => void;
    onVolumeChange?: (volume: number) => void;
  }) {
    if (options?.silenceThresholdMs) this.silenceThresholdMs = options.silenceThresholdMs;
    if (options?.volumeThreshold) this.volumeThreshold = options.volumeThreshold;
    if (options?.onSpeechStart) this.onSpeechStart = options.onSpeechStart;
    if (options?.onSilenceDetected) this.onSilenceDetected = options.onSilenceDetected;
    if (options?.onVolumeChange) this.onVolumeChange = options.onVolumeChange;
  }

  public async start(stream?: MediaStream): Promise<void> {
    try {
      this.stream = stream || (await navigator.mediaDevices.getUserMedia({ audio: true }));
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.2;

      this.microphone = this.audioContext.createMediaStreamSource(this.stream);
      this.microphone.connect(this.analyser);

      this.isRunning = true;
      this.detectAudio();
    } catch (err) {
      console.error('[VAD] Error starting Voice Activity Detector:', err);
      throw err;
    }
  }

  private detectAudio = () => {
    if (!this.isRunning || !this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;
    const normalizedVolume = average / 255;

    if (this.onVolumeChange) {
      this.onVolumeChange(normalizedVolume);
    }

    if (normalizedVolume > this.volumeThreshold) {
      // Sound detected
      if (!this.isSpeaking) {
        this.isSpeaking = true;
        if (this.onSpeechStart) this.onSpeechStart();
      }

      // Reset silence timer
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
        this.silenceTimer = null;
      }
    } else {
      // Below threshold (silence)
      if (this.isSpeaking && !this.silenceTimer) {
        this.silenceTimer = setTimeout(() => {
          this.isSpeaking = false;
          if (this.onSilenceDetected) this.onSilenceDetected();
          this.silenceTimer = null;
        }, this.silenceThresholdMs);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.detectAudio);
  };

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.isSpeaking = false;
  }
}

