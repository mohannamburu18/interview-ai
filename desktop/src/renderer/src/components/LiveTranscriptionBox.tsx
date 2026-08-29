import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Zap, History, ChevronDown, ChevronUp, Radio } from 'lucide-react';

export const LiveTranscriptionBox: React.FC = () => {
  const {
    liveTranscription,
    isBuildingTranscript,
    activeSpeaker,
    answerMode,
    recentQuestions,
    triggerManualAnswer,
    overlayState,
    mergedFragmentsCount,
  } = useAppStore();

  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="p-3.5 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 flex flex-col gap-2.5">
      {/* Top Diarization & Mode Header */}
      <div className="flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-2">
          {activeSpeaker === 'user' ? (
            <span className="flex items-center gap-1 text-neutral-400 font-medium bg-neutral-800/40 px-2 py-0.5 rounded border border-white/5">
              <span>🎤 You (Candidate)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[#00ff88] font-bold bg-[#00ff88]/10 px-2 py-0.5 rounded border border-[#00ff88]/30 shadow-glow-green-sm">
              <Radio className="w-3 h-3 animate-pulse text-[#00ff88]" />
              <span>🎧 Interviewer (Speaker)</span>
            </span>
          )}
          <span className="text-neutral-500 text-[10px]">• Continuous Listening</span>
        </div>

        <div className="flex items-center gap-1.5">
          {recentQuestions.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-1.5 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/5 text-[10px] font-mono flex items-center gap-1 transition-colors"
              title="Toggle Question History"
            >
              <History className="w-2.5 h-2.5" />
              <span>History ({recentQuestions.length})</span>
              {showHistory ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
            </button>
          )}

          {answerMode === 'manual' ? (
            <span className="text-[10px] text-yellow-400/90 font-mono bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20">
              🔒 Manual Ctrl+↵
            </span>
          ) : (
            <span className="text-[10px] text-[#00ff88] font-mono bg-[#00ff88]/10 px-1.5 py-0.5 rounded border border-[#00ff88]/20">
              ⚡ Auto Answer
            </span>
          )}
        </div>
      </div>

      {/* Main Heard Question Display */}
      {liveTranscription ? (
        <div className={`flex flex-col gap-1.5 ${activeSpeaker === 'user' ? 'opacity-60 pl-2 border-l-2 border-neutral-700' : 'pl-2.5 border-l-2 border-[#00ff88]'}`}>
          <div className="flex items-center gap-1.5">
            {isBuildingTranscript ? (
              <span className="text-[10px] text-[#00ff88] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping" />
                Listening & accumulating...
              </span>
            ) : (
              <span className="text-[10px] text-neutral-400 font-mono">
                Finalized Question:
              </span>
            )}
            {mergedFragmentsCount > 1 && (
              <span className="text-[9px] text-[#00ff88] font-mono bg-[#00ff88]/10 px-1.5 py-0.5 rounded border border-[#00ff88]/20">
                🔗 Merged {mergedFragmentsCount} fragments
              </span>
            )}
          </div>
          
          <p className="text-[13px] font-semibold text-white leading-relaxed break-words font-sans selection:bg-neutral-800">
            &ldquo;{liveTranscription}&rdquo;
          </p>

          {/* Manual Mode Action Bar */}
          {answerMode === 'manual' && !isBuildingTranscript && overlayState !== 'thinking' && overlayState !== 'answering' && (
            <div className="flex items-center justify-between pt-1.5 border-t border-white/5 mt-1">
              <span className="text-[10px] text-neutral-400 font-mono">
                Press <kbd className="px-1.5 py-0.5 bg-neutral-800 text-[#00ff88] rounded border border-white/10 font-bold">Ctrl+Enter</kbd> to answer
              </span>
              <button
                onClick={() => triggerManualAnswer()}
                className="px-3 py-1 rounded-md bg-[#00ff88] hover:bg-[#00e67a] text-black font-bold text-[11px] font-mono flex items-center gap-1.5 shadow-glow-green-sm transition-all"
              >
                <Zap className="w-3 h-3 fill-black" />
                <span>Answer (Ctrl+↵)</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="pl-2.5 border-l-2 border-neutral-800 py-1">
          <p className="text-xs text-neutral-500 italic">
            Listening to Interviewer 🎧 (Zoom/Meet/Teams)... Continuous audio buffer active.
          </p>
        </div>
      )}

      {/* Slide-out / Collapsible History Drawer */}
      {showHistory && recentQuestions.length > 0 && (
        <div className="pt-2 border-t border-white/5 flex flex-col gap-1.5 animate-fadeIn">
          <div className="flex items-center gap-1 text-[9px] font-mono text-neutral-400">
            <History className="w-2.5 h-2.5 text-[#00ff88]" />
            <span>SESSION QUESTIONS (CLICK TO RE-ANSWER):</span>
          </div>
          <div className="flex flex-col gap-1">
            {recentQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => {
                  triggerManualAnswer(q.text);
                  setShowHistory(false);
                }}
                className="text-left text-[11px] px-2.5 py-1.5 rounded bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-[#00ff88] border border-white/5 truncate transition-colors flex items-center gap-1.5"
                title={`Click to answer: "${q.text}"`}
              >
                <span className="text-[10px] text-neutral-500">{q.speaker === 'user' ? '🎤' : '🎧'}</span>
                <span className="truncate">{q.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
