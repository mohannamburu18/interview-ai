import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Copy, Check, Sparkles, MessageSquare, Code2, RefreshCw } from 'lucide-react';

export const AIAnswerBox: React.FC = () => {
  const { currentAnswer, activeSpeaker, overlayState, isCodeMode } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const handleCopy = () => {
    if (!currentAnswer) return;
    navigator.clipboard.writeText(currentAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  /**
   * Parakeet visual markdown & code block renderer
   */
  const renderFormattedAnswer = (rawText: string) => {
    if (!rawText) return null;

    // Check for code blocks
    const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
    const sections: Array<{ type: 'code' | 'markdown'; content: string; language?: string }> = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(rawText)) !== null) {
      if (match.index > lastIndex) {
        sections.push({
          type: 'markdown',
          content: rawText.slice(lastIndex, match.index),
        });
      }
      sections.push({
        type: 'code',
        language: match[1] || 'code',
        content: match[2].trim(),
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < rawText.length) {
      sections.push({
        type: 'markdown',
        content: rawText.slice(lastIndex),
      });
    }

    return (
      <div className="space-y-2.5 text-xs font-sans">
        {sections.map((sec, secIdx) => {
          if (sec.type === 'code') {
            return (
              <div key={secIdx} className="rounded-lg bg-[#141414] border border-[#00ff88]/20 overflow-hidden font-mono shadow-md my-2">
                <div className="bg-[#1a1a1a] px-3 py-1.5 border-b border-white/5 flex items-center justify-between text-[10px] text-neutral-400">
                  <div className="flex items-center gap-1.5 text-[#00ff88] font-bold uppercase tracking-wider">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{sec.language || 'CODE'}</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(sec.content, secIdx)}
                    className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-[#00ff88] flex items-center gap-1 transition-colors"
                  >
                    {copiedCodeIdx === secIdx ? (
                      <>
                        <Check className="w-2.5 h-2.5 text-[#00ff88]" />
                        <span className="text-[#00ff88]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-2.5 h-2.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 text-[11px] text-[#00ff88] leading-relaxed overflow-x-auto selection:bg-neutral-800">
                  {sec.content}
                </pre>
              </div>
            );
          }

          // Markdown lines
          const lines = sec.content.split('\n');

          return (
            <div key={secIdx} className="space-y-1.5">
              {lines.map((line, idx) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={idx} className="h-1" />;

                // 1. "Say This" Quote Script Block
                if (trimmed.startsWith('>') || trimmed.startsWith('&gt;')) {
                  const scriptText = trimmed.replace(/^(&gt;|>)\s*/, '');
                  return (
                    <div
                      key={idx}
                      className="mt-2.5 p-3 rounded-lg bg-[#00ff88]/5 border border-[#00ff88]/30 text-[#00ff88] font-sans leading-relaxed shadow-glow-green-sm flex gap-2.5"
                    >
                      <MessageSquare className="w-4 h-4 text-[#00ff88] shrink-0 mt-0.5" />
                      <div className="italic text-xs text-neutral-100 font-medium">
                        {scriptText}
                      </div>
                    </div>
                  );
                }

                // 2. Bullet point (• or - or *)
                if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                  const bulletContent = trimmed.replace(/^(•|-|\*)\s*/, '');
                  return (
                    <div key={idx} className="flex items-start gap-2 pl-2 text-neutral-200 leading-snug">
                      <span className="text-[#00ff88] font-bold mt-[-1px]">•</span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: bulletContent.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>'),
                        }}
                      />
                    </div>
                  );
                }

                // 3. Section Header or Bold Metadata Line
                if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                  const headerText = trimmed.replace(/\*\*/g, '');
                  return (
                    <div key={idx} className="text-[#00ff88] font-bold text-xs uppercase tracking-wide pt-1.5">
                      {headerText}
                    </div>
                  );
                }

                // 4. Standard line with bold tags
                return (
                  <div
                    key={idx}
                    className="text-neutral-300 leading-snug"
                    dangerouslySetInnerHTML={{
                      __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>'),
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 p-3.5 overflow-y-auto max-h-[380px] bg-[#0a0a0a] flex flex-col justify-between custom-scrollbar">
      <div>
        {/* Top bar of Answer Section */}
        <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
            <Sparkles className="w-3.5 h-3.5 text-[#00ff88]" />
            <span>
              {activeSpeaker === 'user'
                ? 'AI Refinement (For You)'
                : 'Parakeet AI Response'}
            </span>
            {isCodeMode && (
              <span className="px-1.5 py-0.2 rounded bg-[#00ff88]/10 text-[#00ff88] text-[10px] font-mono border border-[#00ff88]/30">
                Code Mode
              </span>
            )}
          </div>
          {currentAnswer && (
            <button
              onClick={handleCopy}
              className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10 text-[10px] font-mono flex items-center gap-1 transition-colors"
              title="Copy Answer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-[#00ff88]" />
                  <span className="text-[#00ff88] font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Content Stream */}
        {currentAnswer ? (
          <div className="relative">
            {renderFormattedAnswer(currentAnswer)}
            {overlayState === 'answering' && (
              <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#00ff88] animate-pulse align-middle" />
            )}
          </div>
        ) : overlayState === 'thinking' ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-neutral-400">
            <RefreshCw className="w-5 h-5 animate-spin text-[#00ff88]" />
            <span className="text-xs font-mono">Generating Parakeet answer...</span>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-neutral-500 italic space-y-1.5">
            <p>Ready to assist. Full question will appear above.</p>
            <p className="text-[11px] text-neutral-600">
              Press <kbd className="px-1.5 py-0.5 bg-neutral-900 rounded border border-white/10 text-neutral-400 font-mono">Ctrl+Enter</kbd> to generate answer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
