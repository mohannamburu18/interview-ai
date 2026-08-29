import { create } from 'zustand';
import { UserConfig, OverlayState, InterviewSessionItem, ModelMode, SpeakerType, AnswerMode, AnswerStyle } from '../types';
import { GroqService } from '../services/groqService';
import { GeminiService } from '../services/geminiService';
import { PromptEngine, isHallucination, correctTerms } from '../services/promptEngine';

export interface RecentQuestion {
  id: string;
  text: string;
  speaker: SpeakerType;
  timestamp: number;
}

interface AppStore {
  // Configuration
  config: UserConfig;
  loadConfig: () => Promise<void>;
  updateConfig: (patch: Partial<UserConfig>) => Promise<void>;

  // Dual Answer Mode & Answer Style
  answerMode: AnswerMode;
  setAnswerMode: (mode: AnswerMode) => void;
  answerStyle: AnswerStyle;
  setAnswerStyle: (style: AnswerStyle) => void;
  recentQuestions: RecentQuestion[];

  // Overlay Live Status
  overlayState: OverlayState;
  setOverlayState: (state: OverlayState) => void;
  systemVolume: number;
  micVolume: number;
  setVolumes: (systemVol: number, micVol: number) => void;
  activeSpeaker: SpeakerType | null;
  setActiveSpeaker: (speaker: SpeakerType | null) => void;

  // Active Q&A Content
  liveTranscription: string;
  isBuildingTranscript: boolean;
  setLiveTranscription: (text: string, speaker?: SpeakerType) => void;
  currentAnswer: string;
  setCurrentAnswer: (text: string) => void;
  isCodeMode: boolean;
  setIsCodeMode: (isCode: boolean) => void;

  // Modals & Panels
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isNotesOpen: boolean;
  setIsNotesOpen: (open: boolean) => void;
  isCodeAssistantOpen: boolean;
  setIsCodeAssistantOpen: (open: boolean) => void;

  // Actions
  handleIncomingTranscript: (text: string, speaker: SpeakerType, isFinal?: boolean) => void;
  triggerManualAnswer: (questionOverride?: string) => Promise<void>;
  generateAIAnswer: (text: string, speaker?: SpeakerType) => Promise<void>;
  generateFollowUp: () => Promise<void>;
  clearActiveSession: () => void;
  deleteSessionItem: (id: string) => void;
}

const metaEnv = (import.meta as any).env || {};

const DEFAULT_CONFIG: UserConfig = {
  groqApiKey: metaEnv.VITE_GROQ_API_KEY || '',
  geminiApiKey: metaEnv.VITE_GEMINI_API_KEY || '',
  resumeText: '',
  jobDescription: '',
  companyName: '',
  candidateName: '',
  modelMode: 'balanced',
  answerMode: 'manual', // Default to Manual for 100% user control & zero hallucination
  answerStyle: 'auto',
  language: 'en',
  opacity: 90,
  clickThrough: false,
  onboardingCompleted: true,
  history: [],
};

let autoAnswerDebounceTimer: NodeJS.Timeout | null = null;
let accumulatedSentence = '';
let lastSpeechTime = 0;
let finalizeTimer: NodeJS.Timeout | null = null;

// Merging helper to combine sentence chunks seamlessly without duplicate words
function mergeSentenceChunks(existing: string, incoming: string): string {
  const prev = existing.trim();
  const next = incoming.trim();
  if (!prev) return next;
  if (!next) return prev;

  const prevLower = prev.toLowerCase();
  const nextLower = next.toLowerCase();

  // If next is already inside prev
  if (prevLower.includes(nextLower)) return prev;

  const prevWords = prev.split(/\s+/);
  const nextWords = next.split(/\s+/);

  // Check 1 to 4 overlapping words
  for (let len = Math.min(4, prevWords.length, nextWords.length); len > 0; len--) {
    const tail = prevWords.slice(-len).join(' ').toLowerCase();
    const head = nextWords.slice(0, len).join(' ').toLowerCase();
    if (tail === head) {
      return [...prevWords, ...nextWords.slice(len)].join(' ');
    }
  }

  return `${prev} ${next}`;
}

export const useAppStore = create<AppStore>((set, get) => ({
  config: DEFAULT_CONFIG,
  answerMode: 'manual',
  answerStyle: 'auto',
  recentQuestions: [],
  overlayState: 'idle',
  systemVolume: 0,
  micVolume: 0,
  activeSpeaker: null,
  liveTranscription: '',
  isBuildingTranscript: false,
  currentAnswer: '',
  isCodeMode: false,
  isOnboardingOpen: false,
  isSettingsOpen: false,
  isNotesOpen: false,
  isCodeAssistantOpen: false,

  setAnswerMode: (mode) => {
    set({ answerMode: mode });
    get().updateConfig({ answerMode: mode });
  },

  setAnswerStyle: (style) => {
    set({ answerStyle: style });
    get().updateConfig({ answerStyle: style });
  },

  setOverlayState: (state) => set({ overlayState: state }),
  setVolumes: (systemVolume, micVolume) => set({ systemVolume, micVolume }),
  setActiveSpeaker: (activeSpeaker) => set({ activeSpeaker }),
  setLiveTranscription: (liveTranscription, speaker) =>
    set({
      liveTranscription,
      ...(speaker ? { activeSpeaker: speaker } : {}),
    }),
  setCurrentAnswer: (currentAnswer) => set({ currentAnswer }),
  setIsCodeMode: (isCodeMode: boolean) => set({ isCodeMode }),
  setIsOnboardingOpen: (isOnboardingOpen: boolean) => set({ isOnboardingOpen }),
  setIsSettingsOpen: (isSettingsOpen: boolean) => set({ isSettingsOpen }),
  setIsNotesOpen: (isNotesOpen: boolean) => set({ isNotesOpen }),
  setIsCodeAssistantOpen: (isCodeAssistantOpen: boolean) => set({ isCodeAssistantOpen }),

  loadConfig: async () => {
    try {
      if (window.parakeetAPI?.store) {
        const stored = await window.parakeetAPI.store.getAll();
        if (stored) {
          const merged = { ...DEFAULT_CONFIG, ...stored };
          set({
            config: merged,
            answerMode: merged.answerMode || 'manual',
            answerStyle: merged.answerStyle || 'auto',
            isOnboardingOpen: !merged.onboardingCompleted && !merged.groqApiKey,
          });
          if (merged.opacity) {
            window.parakeetAPI.window.setOpacity(merged.opacity / 100);
          }
          return;
        }
      }
    } catch (e) {
      console.warn('[AppStore] Error loading local config:', e);
    }
    const local = localStorage.getItem('parakeet_config');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        set({
          config: { ...DEFAULT_CONFIG, ...parsed },
          answerMode: parsed.answerMode || 'manual',
          answerStyle: parsed.answerStyle || 'auto',
          isOnboardingOpen: !parsed.onboardingCompleted && !parsed.groqApiKey,
        });
      } catch (e) {}
    }
  },

  updateConfig: async (patch) => {
    const next = { ...get().config, ...patch };
    set({ config: next });

    if (window.parakeetAPI?.store) {
      await window.parakeetAPI.store.update(patch);
      if (patch.opacity !== undefined) {
        window.parakeetAPI.window.setOpacity(patch.opacity / 100);
      }
      if (patch.clickThrough !== undefined) {
        window.parakeetAPI.window.setIgnoreMouseEvents(patch.clickThrough);
      }
    }
    localStorage.setItem('parakeet_config', JSON.stringify(next));
  },

  /**
   * Realtime Speech Handler: Interim Streaming (<300ms) + VAD Full Sentence Merging
   */
  handleIncomingTranscript: (text: string, speaker: SpeakerType, isFinal: boolean = true) => {
    let trimmed = text.trim();
    if (!trimmed) return;

    // 1. If Interim (WebSpeech API streaming)
    if (!isFinal) {
      const correctedInterim = correctTerms(trimmed);
      set({
        liveTranscription: correctedInterim,
        activeSpeaker: speaker,
        isBuildingTranscript: true,
      });
      return;
    }

    // 2. If Final (Groq Whisper Sentence)
    if (isHallucination(trimmed)) {
      console.log('[Transcript Filter] Discarded hallucination/noise:', trimmed);
      return;
    }

    trimmed = correctTerms(trimmed);
    const now = Date.now();
    const gap = now - lastSpeechTime;

    if (gap < 2500 && accumulatedSentence.length > 0) {
      // Continuation of current question
      accumulatedSentence = correctTerms(mergeSentenceChunks(accumulatedSentence, trimmed));
    } else {
      // New question started
      accumulatedSentence = trimmed;
    }

    lastSpeechTime = now;
    const currentQuestion = accumulatedSentence;

    console.log('FULL QUESTION BUILDING:', currentQuestion);

    set({
      liveTranscription: currentQuestion,
      activeSpeaker: speaker,
      isBuildingTranscript: false,
    });

    // Debounce finalization: 600ms silence = ready to answer
    if (finalizeTimer) clearTimeout(finalizeTimer);
    finalizeTimer = setTimeout(() => {
      if (accumulatedSentence.length >= 8) {
        const finalQuestion = correctTerms(accumulatedSentence.trim());
        console.log('FINALIZED QUESTION:', finalQuestion);

        const { answerMode, recentQuestions } = get();

        const newRecent: RecentQuestion = {
          id: 'rq_' + Date.now(),
          text: finalQuestion,
          speaker,
          timestamp: Date.now(),
        };

        const updated = [newRecent, ...recentQuestions.filter((q) => q.text !== finalQuestion)].slice(0, 3);

        set({
          liveTranscription: finalQuestion,
          isBuildingTranscript: false,
          recentQuestions: updated,
        });

        // In Auto Mode: trigger answer immediately on finalization
        if (answerMode === 'auto') {
          get().generateAIAnswer(finalQuestion, speaker);
        }
      }
      finalizeTimer = null;
    }, 600);
  },

  triggerManualAnswer: async (questionOverride?: string) => {
    const { liveTranscription, activeSpeaker } = get();
    const targetQuestion = (questionOverride || liveTranscription).trim();

    if (!targetQuestion || targetQuestion.length < 4) {
      console.warn('[Manual Answer] Question buffer too short or empty.');
      return;
    }

    console.log(`[Manual Answer Triggered] [${activeSpeaker || 'interviewer'}]: "${targetQuestion}"`);
    await get().generateAIAnswer(targetQuestion, activeSpeaker || 'interviewer');
  },

  generateAIAnswer: async (text: string, speaker: SpeakerType = 'interviewer') => {
    const { config, isCodeMode, answerStyle } = get();
    if (!text.trim()) return;

    set({
      overlayState: 'thinking',
      liveTranscription: text,
      activeSpeaker: speaker,
      currentAnswer: '',
    });

    console.log(`[AppStore] Generating AI answer for speaker [${speaker}] (Style: ${answerStyle}): "${text}"`);

    const systemPrompt = PromptEngine.buildSystemPrompt({
      resumeText: config.resumeText,
      jobDescription: config.jobDescription,
      companyName: config.companyName,
      candidateName: config.candidateName,
      isCodeMode: isCodeMode,
      language: config.language,
      answerStyle,
    });

    const userPrompt = PromptEngine.buildUserPrompt(text, isCodeMode ? 'code' : answerStyle);

    let fullAnswer = '';
    const onChunk = (chunk: string) => {
      fullAnswer += chunk;
      set({ currentAnswer: fullAnswer, overlayState: 'answering' });
    };

    try {
      let succeeded = false;

      // 1. Try Groq (Ultra-fast LLaMA 3.1 8B / 3.3 70B)
      if (config.groqApiKey) {
        try {
          const modelName = 'llama-3.1-8b-instant';
          await GroqService.streamChat(config.groqApiKey, modelName, systemPrompt, userPrompt, onChunk);
          succeeded = true;
        } catch (groqErr) {
          console.warn('[AppStore] Groq attempt failed:', groqErr);
        }
      }

      // 2. Try Gemini fallback only if Groq failed AND key is in valid format
      if (!succeeded && config.geminiApiKey && GeminiService.isValidGeminiKey(config.geminiApiKey)) {
        try {
          await GeminiService.streamChat(config.geminiApiKey, systemPrompt, userPrompt, onChunk);
          succeeded = true;
        } catch (geminiErr) {
          console.warn('[AppStore] Gemini attempt failed:', geminiErr);
        }
      }

      if (!succeeded) {
        set({
          currentAnswer: '⚠️ Please configure your free Groq or Gemini API key in Settings to receive real-time answers.',
          overlayState: 'idle',
        });
        return;
      }

      // Add to session history
      const newItem: InterviewSessionItem = {
        id: 'q_' + Date.now(),
        timestamp: Date.now(),
        question: text,
        answer: fullAnswer,
        speaker: speaker,
        model: isCodeMode ? 'gemini-1.5-flash' : config.modelMode,
        category: isCodeMode ? 'coding' : 'behavioral',
      };

      const updatedHistory = [newItem, ...(config.history || [])];
      get().updateConfig({ history: updatedHistory });
      set({ overlayState: 'idle' });
    } catch (err: any) {
      console.error('[AppStore] Error generating answer:', err);
      set({
        currentAnswer: `❌ Error generating answer: ${err.message || 'API request failed'}. Check your API keys and connection.`,
        overlayState: 'idle',
      });
    }
  },

  generateFollowUp: async () => {
    const { liveTranscription, currentAnswer } = get();
    if (!currentAnswer) return;
    const followUpPrompt = `Based on the previous question "${liveTranscription}" and your answer "${currentAnswer}", what are the top 2 likely follow-up questions the interviewer might ask next, and how should I answer them in 1 sentence each?`;
    await get().generateAIAnswer(followUpPrompt);
  },

  clearActiveSession: () => {
    accumulatedSentence = '';
    set({
      liveTranscription: '',
      isBuildingTranscript: false,
      currentAnswer: '',
      overlayState: 'idle',
    });
  },

  deleteSessionItem: (id: string) => {
    const { config } = get();
    const updated = (config.history || []).filter((h) => h.id !== id);
    get().updateConfig({ history: updated });
  },
}));
