export type ModelMode = 'fast' | 'balanced' | 'smart';

export type OverlayState = 'idle' | 'listening' | 'transcribing' | 'thinking' | 'answering' | 'paused';

export type SpeakerType = 'interviewer' | 'user';

export interface InterviewSessionItem {
  id: string;
  timestamp: number;
  question: string;
  answer: string;
  model: string;
  speaker?: SpeakerType;
  category?: 'behavioral' | 'coding' | 'system_design' | 'general';
}

export type AnswerMode = 'auto' | 'manual';
export type AnswerStyle = 'auto' | 'definition' | 'star' | 'code';

export interface UserConfig {
  groqApiKey: string;
  geminiApiKey: string;
  resumeText: string;
  jobDescription: string;
  companyName: string;
  candidateName: string;
  modelMode: ModelMode;
  answerMode?: AnswerMode;
  answerStyle?: AnswerStyle;
  language: string;
  opacity: number;
  clickThrough: boolean;
  onboardingCompleted: boolean;
  history: InterviewSessionItem[];
}

export interface SupportedLanguage {
  code: string;
  name: string;
  native: string;
}

declare global {
  interface Window {
    parakeetAPI: {
      store: {
        getAll: () => Promise<Partial<UserConfig>>;
        get: (key: string) => Promise<any>;
        set: (key: string, value: any) => Promise<boolean>;
        update: (patch: Partial<UserConfig>) => Promise<boolean>;
      };
      window: {
        setOpacity: (opacity: number) => void;
        setIgnoreMouseEvents: (ignore: boolean) => void;
        minimize: () => void;
        close: () => void;
        setAlwaysOnTop: (flag: boolean) => void;
      };
      audio: {
        getSources: () => Promise<any[]>;
        getSystemSourceId: () => Promise<string | null>;
        logDebug: (msg: string) => void;
      };
      on: {
        onHotkeyToggleListening: (callback: () => void) => () => void;
        onHotkeyToggleCodeMode: (callback: () => void) => () => void;
        onHotkeyTriggerManualAnswer: (callback: () => void) => () => void;
      };
    };
  }
}

