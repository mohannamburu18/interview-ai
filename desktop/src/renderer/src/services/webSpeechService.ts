const HALLUCINATION_BLACKLIST = [
  'thank you',
  'thanks for watching',
  'thank you for watching',
  'yeah',
  'uh',
  'um',
  'ah',
  'oh',
  'music',
  '[music]',
  'water cloud',
  'water cloud operations',
  'asking for water',
  'some hallucinations',
  'hallucinations even though',
  'ultra prompt',
  'subscribe',
  'like and subscribe',
  'you',
  '.',
  'a',
  'the',
];

export function isHallucination(text: string): boolean {
  if (!text) return true;
  const t = text.toLowerCase().trim();

  // Rule 1: Too short
  if (t.length < 10) return true;

  // Rule 2: Too few words
  if (t.split(/\s+/).filter((w) => w.length > 0).length < 3) return true;

  // Rule 3: Exact blacklist
  if (HALLUCINATION_BLACKLIST.includes(t)) return true;

  // Rule 4: Contains hallucination phrases
  if (t.includes('hallucination') || t.includes('water cloud') || t.includes('asking for water')) {
    return true;
  }

  // Rule 5: Only filler words
  if (/^(yeah|yes|no|okay|thanks|thank you|uh|um|ah)[\s\.]*$/i.test(t)) return true;

  // Rule 6: Groq Whisper often hallucinates period only
  if (t === '.' || t === '..' || t === '...') return true;

  return false;
}

export function correctTerms(text: string): string {
  return text
    .replace(/water cloud operations/gi, 'CRUD operations')
    .replace(/water cloud/gi, 'CRUD')
    .replace(/crude operations/gi, 'CRUD operations')
    .replace(/crew operations/gi, 'CRUD operations')
    .replace(/sequel/gi, 'SQL')
    .replace(/my sequel/gi, 'MySQL');
}

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

        const raw = (finalTranscript || interimTranscript).trim();
        if (!raw) return;

        const cleaned = correctTerms(raw);
        if (isHallucination(cleaned)) {
          console.log('[WebSpeech] Filtered hallucination:', raw);
          return;
        }

        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(cleaned, Boolean(finalTranscript));
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('[WebSpeech] Recognition warning:', event.error);
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {}
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
      console.warn('[WebSpeech] SpeechRecognition not supported in this environment');
      return false;
    }
    try {
      this.isListening = true;
      this.recognition.start();
      return true;
    } catch (e) {
      console.warn('[WebSpeech] Start error:', e);
      return false;
    }
  }

  public stop(): void {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
  }
}
