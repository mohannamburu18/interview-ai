import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, Code2, Play, Sparkles, Copy, Check, Terminal } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { GroqService } from '../services/groqService';

export const CodeAssistantModal: React.FC = () => {
  const { config, isCodeAssistantOpen, setIsCodeAssistantOpen } = useAppStore();
  const [problemText, setProblemText] = useState('');
  const [language, setLanguage] = useState('TypeScript');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isCodeAssistantOpen) return null;

  const handleSolve = async () => {
    if (!problemText.trim()) return;
    setLoading(true);
    setSolution('');

    const systemPrompt = `You are a Principal Software Engineer & LeetCode/DSA Master.
Target Language: ${language}
Provide an optimal time/space complexity solution with:
1. Short Strategy explanation (2 sentences)
2. Full Clean Code
3. Big-O Complexity (Time and Space)
4. Edge cases checked`;

    const onChunk = (delta: string) => {
      setSolution((prev) => prev + delta);
    };

    try {
      if (config.geminiApiKey) {
        await GeminiService.streamChat(config.geminiApiKey, systemPrompt, problemText, onChunk);
      } else if (config.groqApiKey) {
        await GroqService.streamChat(
          config.groqApiKey,
          'llama-3.3-70b-versatile',
          systemPrompt,
          problemText,
          onChunk
        );
      }
    } catch (e: any) {
      setSolution(`❌ Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(solution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[580px]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#171717] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-parakeet-400" />
            <span className="font-bold text-white text-sm">LeetCode & Code Assistant</span>
          </div>
          <button
            onClick={() => setIsCodeAssistantOpen(false)}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-xs text-white"
            >
              <option value="TypeScript">TypeScript</option>
              <option value="Python">Python 3</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
              <option value="Go">Go</option>
              <option value="Rust">Rust</option>
              <option value="SQL">SQL</option>
            </select>

            <button
              onClick={handleSolve}
              disabled={loading || !problemText.trim()}
              className="px-4 py-2 rounded-lg bg-parakeet-500 hover:bg-parakeet-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-glow-green-sm disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? 'Solving...' : 'Solve Problem'}</span>
            </button>
          </div>

          <div>
            <textarea
              rows={4}
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              placeholder="Paste coding problem, LeetCode prompt, or bug here..."
              className="w-full p-3 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-parakeet-500"
            />
          </div>

          {solution && (
            <div className="p-4 rounded-xl bg-[#080808] border border-parakeet-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-mono text-parakeet-400 font-bold">OPTIMIZED SOLUTION</span>
                <button
                  onClick={handleCopy}
                  className="p-1 rounded text-neutral-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-parakeet-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-parakeet-300 font-mono whitespace-pre-wrap overflow-x-auto selection:bg-neutral-800">
                {solution}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

