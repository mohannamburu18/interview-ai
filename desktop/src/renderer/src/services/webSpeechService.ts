export class WebSpeechTranscriptionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private onTranscriptUpdate?: (transcript: string, isFinal: boolean) => void;
  private language: string = 'en-US';

  constructor(options?: {
    language?: string;
    onTranscriptUpdate?: (transcript: string, isFinal: boolean) => void;
  }) {
    if (options?.language) this.language = options.language;
    if (options?.onTranscriptUpdate) this.onTranscriptUpdate = options.onTranscriptUpdate;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.language;

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const fullCurrent = (finalTranscript || interimTranscript).trim();
        if (this.onTranscriptUpdate && fullCurrent) {
          this.onTranscriptUpdate(fullCurrent, Boolean(finalTranscript));
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('[WebSpeech] Recognition warning:', event.error);
      };

      this.recognition.onend = () => {
        // Auto restart if still marked as listening
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {
            // Already started
          }
        }
      };
    }
  }

  public setLanguage(lang: string) {
    this.language = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public start(): boolean {
    if (!this.recognition) {
      console.warn('[WebSpeech] SpeechRecognition is not supported on this browser/platform.');
      return false;
    }
    this.isListening = true;
    try {
      this.recognition.start();
      return true;
    } catch (e) {
      console.warn('[WebSpeech] Start error (might already be running):', e);
      return true;
    }
  }

  public stop(): void {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore
      }
    }
  }
}

