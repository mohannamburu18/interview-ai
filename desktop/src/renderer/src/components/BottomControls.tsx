import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { AnswerStyle } from '../types';
import { Play, Pause, Trash2, Code2, MessageSquare, Layers } from 'lucide-react';

export const BottomControls: React.FC = () => {
  const {
    overlayState,
    setOverlayState,
    answerStyle,
    setAnswerStyle,
    generateFollowUp,
    clearActiveSession,
    isCodeMode,
    setIsCodeMode,
  } = useAppStore();

  const handleTogglePause = () => {
    if (overlayState === 'paused') {
      setOverlayState('listening');
    } else {
      setOverlayState('paused');
    }
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const style = e.target.value as AnswerStyle;
    setAnswerStyle(style);
    if ((style as string) === 'code') {
      setIsCodeMode(true);
    } else if (isCodeMode && (style as string) !== 'code') {
      setIsCodeMode(false);
    }
  };

  return (
    <div className="p-2.5 bg-[#111111] border-t border-white/10 flex items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-1.5">
        {/* Pause / Resume button */}
        <button
          onClick={handleTogglePause}
          className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
            overlayState === 'paused'
              ? 'bg-parakeet-500 text-black hover:bg-parakeet-400'
              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
          }`}
          title="Pause or Resume transcription"
        >
          {overlayState === 'paused' ? (
            <>
              <Play className="w-3 h-3 fill-black" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="w-3 h-3" />
              <span>Pause</span>
            </>
          )}
        </button>

        {/* Clear active text */}
        <button
          onClick={clearActiveSession}
          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/5 transition-colors"
          title="Clear active transcript & answer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Answer Style Selector */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1 bg-neutral-900 px-2 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-neutral-300">
          <Layers className="w-3 h-3 text-parakeet-400" />
          <span className="text-neutral-400 hidden sm:inline">Style:</span>
          <select
            value={isCodeMode ? 'code' : answerStyle}
            onChange={handleStyleChange}
            className="bg-transparent text-parakeet-400 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="auto" className="bg-neutral-900 text-white">Auto Detect</option>
            <option value="definition" className="bg-neutral-900 text-white">Direct Definition</option>
            <option value="star" className="bg-neutral-900 text-white">STAR Story</option>
            <option value="code" className="bg-neutral-900 text-white">Code Solution</option>
          </select>
        </div>

        {/* Generate Follow-up */}
        <button
          onClick={() => generateFollowUp()}
          className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium flex items-center gap-1 border border-white/5 transition-colors"
          title="Generate top 2 follow-up questions"
        >
          <MessageSquare className="w-3 h-3 text-parakeet-400" />
          <span className="hidden sm:inline">Follow-up</span>
        </button>
      </div>
    </div>
  );
};
