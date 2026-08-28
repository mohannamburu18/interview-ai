import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  X,
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  Clock,
  Trash2,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { PromptEngine } from '../services/promptEngine';
import { GroqService } from '../services/groqService';
import { GeminiService } from '../services/geminiService';

export const AINotesModal: React.FC = () => {
  const { config, isNotesOpen, setIsNotesOpen, deleteSessionItem } = useAppStore();
  const [debrief, setDebrief] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isNotesOpen) return null;

  const history = config.history || [];

  const handleGenerateDebrief = async () => {
    if (history.length === 0) return;
    setGenerating(true);
    setDebrief('');

    const prompt = PromptEngine.buildNotesSummaryPrompt(history, config.companyName);

    try {
      if (config.groqApiKey) {
        await GroqService.streamChat(
          config.groqApiKey,
          'llama-3.3-70b-versatile',
          'You are an executive interview performance debrief analyst.',
          prompt,
          (delta) => {
            setDebrief((prev) => prev + delta);
          }
        );
      } else if (config.geminiApiKey) {
        await GeminiService.streamChat(
          config.geminiApiKey,
          'You are an executive interview performance debrief analyst.',
          prompt,
          (delta) => {
            setDebrief((prev) => prev + delta);
          }
        );
      }
    } catch (e: any) {
      setDebrief(`❌ Error generating debrief: ${e.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(debrief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[580px]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#171717] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-parakeet-400" />
            <span className="font-bold text-white text-sm">Post-Interview AI Notes & Debrief</span>
          </div>
          <button
            onClick={() => setIsNotesOpen(false)}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Action Bar */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/90 border border-white/5">
            <div>
              <h4 className="text-xs font-bold text-white">Interview Performance Summary</h4>
              <p className="text-[11px] text-neutral-400">
                {history.length} questions recorded in this session.
              </p>
            </div>
            <button
              onClick={handleGenerateDebrief}
              disabled={generating || history.length === 0}
              className="px-3.5 py-2 rounded-xl bg-parakeet-500 hover:bg-parakeet-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-glow-green-sm disabled:opacity-50"
            >
              {generating ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>{generating ? 'Analyzing...' : 'Generate AI Debrief'}</span>
            </button>
          </div>

          {/* Debrief Output if generated */}
          {debrief && (
            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-parakeet-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-mono text-parakeet-400 font-bold">AI DEBRIEF REPORT</span>
                <button
                  onClick={handleCopy}
                  className="p-1 rounded text-neutral-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-parakeet-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-neutral-200 whitespace-pre-wrap leading-relaxed font-sans">
                {debrief}
              </div>
            </div>
          )}

          {/* Session Questions History */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-neutral-400">Session Q&A Log</h5>
            {history.length === 0 ? (
              <p className="text-xs text-neutral-500 italic py-4 text-center">
                No questions recorded yet. Start talking to begin transcribing.
              </p>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-neutral-900/60 border border-white/5 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span className="font-mono text-parakeet-400">
                      {item.speaker === 'user' ? '🎤 You' : '🎧 Interviewer'} • {new Date(item.timestamp).toLocaleTimeString()} • {item.model}
                    </span>
                    <button
                      onClick={() => deleteSessionItem(item.id)}
                      className="text-neutral-500 hover:text-red-400 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs font-medium text-white italic">&ldquo;{item.question}&rdquo;</p>
                  <p className="text-xs text-parakeet-300 leading-relaxed">{item.answer}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#171717] border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-parakeet-400" />
            <span>Encrypted local storage • Automatically self-destructs after 24 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

