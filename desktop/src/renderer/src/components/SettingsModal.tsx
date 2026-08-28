import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  X,
  Sliders,
  Cpu,
  Globe,
  Key,
  FileText,
  Shield,
  Trash2,
  Check,
  MousePointer,
} from 'lucide-react';
import { ModelMode } from '../types';

const LANGUAGES = [
  { code: 'en', name: 'English (US/UK)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'zh', name: 'Chinese (Mandarin)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'nl', name: 'Dutch (Nederlands)' },
  { code: 'pl', name: 'Polish (Polski)' },
  { code: 'tr', name: 'Turkish (Türkçe)' },
  { code: 'vi', name: 'Vietnamese (Tiếng Việt)' },
  { code: 'id', name: 'Indonesian (Bahasa Indonesia)' },
  { code: 'sv', name: 'Swedish (Svenska)' },
  { code: 'uk', name: 'Ukrainian (Українська)' },
  { code: 'auto', name: 'Auto Detect (Whisper)' },
];

export const SettingsModal: React.FC = () => {
  const { config, updateConfig, isSettingsOpen, setIsSettingsOpen } = useAppStore();

  const [activeTab, setActiveTab] = useState<'model' | 'profile' | 'keys' | 'privacy'>('model');
  const [groqKey, setGroqKey] = useState(config.groqApiKey || '');
  const [geminiKey, setGeminiKey] = useState(config.geminiApiKey || '');
  const [resume, setResume] = useState(config.resumeText || '');
  const [jd, setJd] = useState(config.jobDescription || '');
  const [company, setCompany] = useState(config.companyName || '');
  const [candidateName, setCandidateName] = useState(config.candidateName || '');
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    updateConfig({
      groqApiKey: groqKey.trim(),
      geminiApiKey: geminiKey.trim(),
      resumeText: resume,
      jobDescription: jd,
      companyName: company,
      candidateName: candidateName,
    });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      setIsSettingsOpen(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#171717] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-parakeet-400" />
            <span className="font-bold text-white text-sm">Parakeet Settings</span>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/5 bg-[#0f0f0f] px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('model')}
            className={`pb-2 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'model'
                ? 'border-parakeet-500 text-parakeet-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Model & Audio
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-parakeet-500 text-parakeet-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Resume & Context
          </button>
          <button
            onClick={() => setActiveTab('keys')}
            className={`pb-2 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'keys'
                ? 'border-parakeet-500 text-parakeet-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            API Keys (BYOK)
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'privacy'
                ? 'border-parakeet-500 text-parakeet-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Privacy
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {activeTab === 'model' && (
            <div className="space-y-4">
              {/* Intelligence Mode */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  Intelligence Provider Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['fast', 'balanced', 'smart'] as ModelMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => updateConfig({ modelMode: mode })}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        config.modelMode === mode
                          ? 'bg-parakeet-500/10 border-parakeet-500/50 text-white'
                          : 'bg-neutral-900 border-white/5 text-neutral-400 hover:bg-neutral-800'
                      }`}
                    >
                      <div className="text-xs font-bold capitalize text-white">{mode}</div>
                      <div className="text-[10px] text-neutral-400 mt-1">
                        {mode === 'fast'
                          ? 'Groq 8B (Sub-300ms)'
                          : mode === 'balanced'
                          ? 'Groq 70B (Best STAR)'
                          : 'Gemini 1.5 (Coding)'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-parakeet-400" />
                  <span>Transcription Language (59 Supported)</span>
                </label>
                <select
                  value={config.language || 'en'}
                  onChange={(e) => updateConfig({ language: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Click-Through Mode */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-white/5">
                <div>
                  <span className="text-xs font-semibold text-white">Click-Through Pass-Through</span>
                  <p className="text-[11px] text-neutral-400">Mouse clicks pass through overlay to underlying apps</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.clickThrough || false}
                  onChange={(e) => updateConfig({ clickThrough: e.target.checked })}
                  className="w-4 h-4 accent-parakeet-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-300 mb-1">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-300 mb-1">Resume Details</label>
                <textarea
                  rows={4}
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste projects, accomplishments, metrics..."
                  className="w-full p-2.5 rounded-lg bg-neutral-900 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-300 mb-1">Job Description</label>
                <textarea
                  rows={3}
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="Paste requirements..."
                  className="w-full p-2.5 rounded-lg bg-neutral-900 border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>
          )}

          {activeTab === 'keys' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Groq API Key (Free)
                </label>
                <input
                  type="password"
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-xs text-white font-mono"
                />
                <p className="text-[10px] text-neutral-500 mt-1">Get free key from console.groq.com/keys</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Google Gemini API Key (Free)
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-xs text-white font-mono"
                />
                <p className="text-[10px] text-neutral-500 mt-1">Get free key from aistudio.google.com</p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3 text-xs text-neutral-300">
              <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Shield className="w-4 h-4 text-parakeet-400" />
                  <span>Privacy by Design</span>
                </div>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  Parakeet Free Unlimited never sends your audio or interview transcripts to any proprietary third-party servers. All requests go directly to your personal Groq and Google developer accounts.
                </p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-parakeet-400 font-mono">
                  <span>24-Hour Auto-Purge:</span>
                  <span>ACTIVE</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#171717] border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-neutral-500">v1.0.0 Free Unlimited</span>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-parakeet-500 hover:bg-parakeet-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-glow-green-sm"
          >
            {savedNotice ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{savedNotice ? 'Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

