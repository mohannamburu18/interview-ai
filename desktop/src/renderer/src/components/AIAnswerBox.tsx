import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Copy, Check, Sparkles, Terminal, Code2, RefreshCw } from 'lucide-react';

export const AIAnswerBox: React.FC = () => {
  const { currentAnswer, activeSpeaker, answerMode, overlayState, isCodeMode, config } = useAppStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!currentAnswer) return;
    navigator.clipboard.writeText(currentAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to detect and render markdown code blocks
  const renderFormattedAnswer = (text: string) => {
    if (!text) return null;

    const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index),
        });
      }
      parts.push({
        type: 'code',
        language: match[1] || 'code',
        content: match[2],
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex),
      });
    }

    if (parts.length === 0) {
      return (
        <div className="text-sm font-medium text-parakeet-300 leading-relaxed glow-text whitespace-pre-wrap">
          {text}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {parts.map((part, i) =>
          part.type === 'code' ? (
            <div key={i} className="rounded-lg bg-[#050505] p-3 border border-white/10 font-mono text-xs overflow-x-auto">
              <div className="text-[10px] text-neutral-500 mb-1 flex items-center justify-between font-mono">
                <span>{(part.language || 'code').toUpperCase()}</span>
                <span className="text-parakeet-400">Gemini 1.5 Flash</span>
              </div>
              <pre className="text-parakeet-400 selection:bg-neutral-800">{part.content}</pre>
            </div>
          ) : (
            <div key={i} className="text-sm font-medium text-parakeet-300 leading-relaxed glow-text whitespace-pre-wrap">
              {part.content}
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-[#0a0a0a] flex flex-col justify-between">
      <div>
        {/* Top bar of Answer Section */}
        <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
            <Sparkles className="w-3.5 h-3.5 text-parakeet-400" />
            <span>
              {activeSpeaker === 'user'
                ? 'AI Refinement & Next Follow-ups (For You)'
                : 'AI Suggested STAR Answer'}
            </span>
            {isCodeMode && (
              <span className="px-1.5 py-0.2 rounded bg-parakeet-500/20 text-parakeet-400 text-[10px] font-mono border border-parakeet-500/30">
                Code Mode
              </span>
            )}
          </div>
          {currentAnswer && (
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Copy Answer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-parakeet-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Content Stream */}
        {currentAnswer ? (
          <div className="relative">
            {renderFormattedAnswer(currentAnswer)}
            {overlayState === 'answering' && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-parakeet-500 animate-pulse align-middle" />
            )}
          </div>
        ) : overlayState === 'thinking' ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-neutral-400">
            <RefreshCw className="w-6 h-6 animate-spin text-parakeet-400" />
            <span className="text-xs font-mono">Generating STAR response...</span>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-neutral-500 italic space-y-1.5">
            <p>
              {answerMode === 'manual'
                ? '🔒 Manual Mode active. Listen to a question, then press Ctrl+Enter to generate an answer.'
                : '⚡ Auto Mode active. Answers will stream automatically when speech finishes.'}
            </p>
          </div>
        )}
      </div>

      {/* Model Indicator Footer */}
      <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
        <span>
          Active Model:{' '}
          <strong className="text-neutral-400">
            {isCodeMode
              ? 'Gemini 1.5 Flash'
              : config.modelMode === 'fast'
              ? 'Groq LLaMA 3.1 8B'
              : 'Groq LLaMA 3.3 70B'}
          </strong>
        </span>
        <span className="text-parakeet-400">100% Free BYOK</span>
      </div>
    </div>
  );
};

