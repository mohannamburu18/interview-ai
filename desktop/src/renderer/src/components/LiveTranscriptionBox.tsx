import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Mic, Zap, Play, History, ArrowRight } from 'lucide-react';

export const LiveTranscriptionBox: React.FC = () => {
  const {
    liveTranscription,
    isBuildingTranscript,
    activeSpeaker,
    answerMode,
    recentQuestions,
    triggerManualAnswer,
    overlayState,
  } = useAppStore();

  return (
    <div className="p-3 bg-[#0d0d0d] border-b border-white/5 flex flex-col gap-2">
      {/* Top Diarization & Mode Info */}
      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
        <div className="flex items-center gap-1.5">
          {activeSpeaker === 'user' ? (
            <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              <span>🎤 You (Candidate)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-parakeet-400 font-bold bg-parakeet-500/10 px-2 py-0.5 rounded border border-parakeet-500/30">
              <span>🎧 Interviewer (Speaker)</span>
            </span>
          )}
          <span className="text-neutral-500">• Groq Whisper v3</span>
        </div>

        {/* Mode Tag */}
        {answerMode === 'manual' ? (
          <span className="text-[10px] text-yellow-400/90 font-mono bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20">
            🔒 Manual Ctrl+Enter
          </span>
        ) : (
          <span className="text-[10px] text-parakeet-400 font-mono bg-parakeet-500/10 px-1.5 py-0.5 rounded border border-parakeet-500/20">
            ⚡ Auto Answer (1.2s)
          </span>
        )}
      </div>

      {/* Main Heard Transcript Display */}
      {liveTranscription ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            {isBuildingTranscript ? (
              <span className="text-[10px] text-parakeet-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-parakeet-500 animate-ping" />
                Listening & building...
              </span>
            ) : (
              <span className="text-[10px] text-neutral-400 font-mono">
                Finalized Question:
              </span>
            )}
            {useAppStore.getState().mergedFragmentsCount > 1 && (
              <span className="text-[9px] text-cyan-400 font-mono bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                🔗 Merged {useAppStore.getState().mergedFragmentsCount} fragments
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-200 italic leading-relaxed break-words font-sans selection:bg-neutral-800">
            &ldquo;{liveTranscription}&rdquo;
          </p>

          {/* If in Manual Mode: show action button to answer */}
          {answerMode === 'manual' && !isBuildingTranscript && overlayState !== 'thinking' && overlayState !== 'answering' && (
            <div className="flex items-center justify-between pt-1 border-t border-white/5">
              <span className="text-[10px] text-neutral-400 font-mono">
                Press <kbd className="px-1.5 py-0.5 bg-neutral-800 text-parakeet-400 rounded border border-white/10 font-bold">Ctrl+Enter</kbd> to answer
              </span>
              <button
                onClick={() => triggerManualAnswer()}
                className="px-2.5 py-1 rounded bg-parakeet-500 hover:bg-parakeet-400 text-black font-bold text-[10px] font-mono flex items-center gap-1 shadow-glow-green-sm transition-all"
              >
                <Zap className="w-3 h-3 fill-black" />
                <span>Answer (Ctrl+↵)</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-neutral-500 italic">
          Listening to Interviewer 🎧 + You 🎤... (Start speaking or play meeting audio)
        </p>
      )}

      {/* Recent Questions Bar (Keep Last 3) */}
      {recentQuestions.length > 1 && (
        <div className="pt-1.5 border-t border-white/5 flex flex-col gap-1">
          <div className="flex items-center gap-1 text-[9px] font-mono text-neutral-500">
            <History className="w-2.5 h-2.5" />
            <span>RECENT QUESTIONS (CLICK TO RE-ANSWER):</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {recentQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => triggerManualAnswer(q.text)}
                className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-parakeet-400 border border-white/5 truncate max-w-[200px] transition-colors"
                title={`Click to answer: "${q.text}"`}
              >
                {q.speaker === 'user' ? '🎤 ' : '🎧 '}
                {q.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
