import React, { useEffect, useRef } from 'react';
import { useAppStore } from './store/useAppStore';
import { OverlayHeader } from './components/OverlayHeader';
import { LiveTranscriptionBox } from './components/LiveTranscriptionBox';
import { AIAnswerBox } from './components/AIAnswerBox';
import { BottomControls } from './components/BottomControls';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsModal } from './components/SettingsModal';
import { AINotesModal } from './components/AINotesModal';
import { CodeAssistantModal } from './components/CodeAssistantModal';
import { DualAudioCaptureEngine } from './services/dualAudioService';
import { GroqService } from './services/groqService';

export const App: React.FC = () => {
  const {
    config,
    loadConfig,
    overlayState,
    setOverlayState,
    setVolumes,
    handleIncomingTranscript,
    triggerManualAnswer,
    isCodeMode,
    setIsCodeMode,
  } = useAppStore();

  const dualAudioEngineRef = useRef<DualAudioCaptureEngine | null>(null);

  useEffect(() => {
    loadConfig();

    // 1. Global shortcuts dispatched from Electron main process
    const unsubs: Array<() => void> = [];
    if (window.parakeetAPI?.on) {
      unsubs.push(
        window.parakeetAPI.on.onHotkeyToggleListening(() => {
          const state = useAppStore.getState().overlayState;
          if (state === 'listening') {
            useAppStore.getState().setOverlayState('paused');
          } else {
            useAppStore.getState().setOverlayState('listening');
          }
        })
      );

      unsubs.push(
        window.parakeetAPI.on.onHotkeyToggleCodeMode(() => {
          const current = useAppStore.getState().isCodeMode;
          useAppStore.getState().setIsCodeMode(!current);
        })
      );

      unsubs.push(
        window.parakeetAPI.on.onHotkeyTriggerManualAnswer(() => {
          console.log('[Global Shortcut] Ctrl+Enter received from OS, triggering answer...');
          useAppStore.getState().triggerManualAnswer();
        })
      );
    }

    // 2. Local window keyboard shortcut for Ctrl+Enter / Cmd+Enter
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        console.log('[Local Shortcut] Ctrl+Enter pressed inside overlay window');
        useAppStore.getState().triggerManualAnswer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unsubs.forEach((u) => u());
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Initialize Dual Audio Capture Engine & API Verification
  useEffect(() => {
    const initDualAudio = async () => {
      // Validate Groq API Key
      if (config.groqApiKey) {
        console.log('[Startup Validation] Verifying Groq API Key...');
        const validation = await GroqService.validateApiKey(config.groqApiKey);
        if (!validation.valid) {
          console.error('[Startup Validation] Groq API Key Invalid:', validation.error);
        }
      }

      // Dual Audio Capture Engine (System Loopback + Microphone)
      dualAudioEngineRef.current = new DualAudioCaptureEngine(
        {
          onTranscript: (text: string, speaker: any, isFinal: boolean) => {
            handleIncomingTranscript(text, speaker, isFinal);
          },
          onVolumeChange: (sysVol: number, micVol: number) => {
            setVolumes(sysVol, micVol);
          },
          onSpeechStart: (_speaker: any) => {
            setOverlayState('listening');
          },
          onSilenceDetected: (speaker: any, fullTranscript: string) => {
            handleIncomingTranscript(fullTranscript, speaker, true);
          },
        },
        config.groqApiKey,
        config.language || 'en'
      );

      try {
        const status = await dualAudioEngineRef.current.start();
        console.log(`[AudioEngine Startup] System Captured: ${status.systemCaptured}, Mic Captured: ${status.micCaptured}`);
        setOverlayState('listening');
      } catch (err) {
        console.warn('[AudioEngine Startup Warning]:', err);
      }
    };

    initDualAudio();

    return () => {
      dualAudioEngineRef.current?.stop();
    };
  }, [config.groqApiKey, config.language]);

  return (
    <div className="h-screen w-screen bg-[#0a0a0a] rounded-2xl border border-parakeet-500/40 shadow-2xl flex flex-col overflow-hidden text-white">
      {/* Top Drag Header */}
      <OverlayHeader />

      {/* Real-time Transcription Stream */}
      <LiveTranscriptionBox />

      {/* AI Answer Response Stream */}
      <AIAnswerBox />

      {/* Bottom Controls */}
      <BottomControls />

      {/* Modals */}
      <OnboardingModal />
      <SettingsModal />
      <AINotesModal />
      <CodeAssistantModal />
    </div>
  );
};
