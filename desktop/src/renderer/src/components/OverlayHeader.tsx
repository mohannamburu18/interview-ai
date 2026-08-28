import React from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Sliders,
  Settings,
  FileText,
  Code2,
  Minus,
  X,
  ShieldCheck,
  MousePointer,
  Sparkles,
} from 'lucide-react';

export const OverlayHeader: React.FC = () => {
  const {
    overlayState,
    systemVolume,
    micVolume,
    answerMode,
    setAnswerMode,
    config,
    updateConfig,
    isCodeMode,
    setIsCodeMode,
    setIsSettingsOpen,
    setIsNotesOpen,
    setIsCodeAssistantOpen,
  } = useAppStore();

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    updateConfig({ opacity: val });
  };

  const handleToggleClickThrough = () => {
    const next = !config.clickThrough;
    updateConfig({ clickThrough: next });
  };

  const handleMinimize = () => {
    if (window.parakeetAPI?.window) {
      window.parakeetAPI.window.minimize();
    }
  };

  const handleClose = () => {
    if (window.parakeetAPI?.window) {
      window.parakeetAPI.window.close();
    }
  };

  return (
    <div className="titlebar-drag-region h-11 bg-[#111111]/95 border-b border-white/10 px-3 flex items-center justify-between select-none cursor-move">
      {/* Left: Logo & Live Status */}
      <div className="flex items-center gap-2 no-drag">
        <div className="w-5 h-5 rounded-md bg-parakeet-500 flex items-center justify-center text-black font-extrabold text-[10px] shadow-glow-green-sm">
          P
        </div>
        <span className="text-xs font-bold tracking-wider text-white font-mono hidden sm:inline">
          PARAKEET
        </span>

        {/* State Pill */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neutral-900 border border-white/10 text-[10px] font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              overlayState === 'listening'
                ? 'bg-parakeet-500 animate-pulse'
                : overlayState === 'thinking' || overlayState === 'answering'
                ? 'bg-yellow-400 animate-bounce'
                : overlayState === 'paused'
                ? 'bg-red-500'
                : 'bg-neutral-500'
            }`}
          />
          <span className="capitalize text-neutral-300">
            {overlayState === 'listening'
              ? 'Listening'
              : overlayState === 'thinking'
              ? 'Thinking...'
              : overlayState === 'answering'
              ? 'Answering'
              : overlayState === 'paused'
              ? 'Paused'
              : 'Ready'}
          </span>
        </div>

        {/* Dual VU Meters for Interviewer and You */}
        {overlayState === 'listening' && (
          <div className="flex items-center gap-1.5 ml-1">
            {/* Interviewer VU */}
            <div className="flex items-center gap-1" title="Interviewer Audio (Loopback/Speakers)">
              <span className="text-[9px]">🎧</span>
              <div className="h-2.5 w-6 bg-neutral-950 rounded px-0.5 overflow-hidden flex items-center">
                <div
                  className="h-1.5 bg-parakeet-500 rounded transition-all duration-75"
                  style={{ width: `${Math.min(100, Math.max(10, systemVolume * 400))}%` }}
                />
              </div>
            </div>

            {/* Candidate / Mic VU */}
            <div className="flex items-center gap-1" title="Your Microphone Audio">
              <span className="text-[9px]">🎤</span>
              <div className="h-2.5 w-6 bg-neutral-950 rounded px-0.5 overflow-hidden flex items-center">
                <div
                  className="h-1.5 bg-emerald-400 rounded transition-all duration-75"
                  style={{ width: `${Math.min(100, Math.max(10, micVolume * 400))}%` }}
                />
              </div>
            </div>
          </div>
        )}
        {/* Dual Answer Mode Switcher (Auto vs Manual Ctrl+Enter) */}
        <div className="flex items-center bg-black/60 p-0.5 rounded-lg border border-white/10 text-[10px] font-mono">
          <button
            onClick={() => setAnswerMode('auto')}
            className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 ${
              answerMode === 'auto'
                ? 'bg-parakeet-500 text-black font-bold shadow-glow-green-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Auto Mode: Generates answers automatically after speech"
          >
            <span>⚡ Auto</span>
          </button>
          <button
            onClick={() => setAnswerMode('manual')}
            className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 ${
              answerMode === 'manual'
                ? 'bg-parakeet-500 text-black font-bold shadow-glow-green-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Manual Mode: Buffers transcript, answers only when you press Ctrl+Enter"
          >
            <span>🔒 Manual (Ctrl+↵)</span>
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 no-drag">
        {/* Opacity Slider */}
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-900/80 border border-white/5 text-[10px] text-neutral-400">
          <Sliders className="w-3 h-3 text-neutral-400" />
          <input
            type="range"
            min="20"
            max="100"
            value={config.opacity || 90}
            onChange={handleOpacityChange}
            className="w-12 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-parakeet-500"
            title="Overlay Opacity"
          />
          <span className="font-mono text-[9px] w-5 text-parakeet-400">{config.opacity || 90}%</span>
        </div>

        {/* Code Mode Toggle */}
        <button
          onClick={() => setIsCodeMode(!isCodeMode)}
          className={`p-1.5 rounded transition-colors ${
            isCodeMode
              ? 'bg-parakeet-500 text-black font-bold shadow-glow-green-sm'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
          title="Toggle Code Mode (Ctrl+Shift+C)"
        >
          <Code2 className="w-3.5 h-3.5" />
        </button>

        {/* Post-Interview Notes */}
        <button
          onClick={() => setIsNotesOpen(true)}
          className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          title="AI Interview Debrief & Notes"
        >
          <FileText className="w-3.5 h-3.5" />
        </button>

        {/* Settings */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Settings & API Keys"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        {/* Minimize */}
        <button
          onClick={handleMinimize}
          className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Minimize"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {/* Close */}
        <button
          onClick={handleClose}
          className="p-1.5 rounded text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Close App"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

