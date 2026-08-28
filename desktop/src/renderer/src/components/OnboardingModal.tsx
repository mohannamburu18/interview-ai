import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Key,
  FileText,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Shield,
  Zap,
  Volume2,
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { config, updateConfig, isOnboardingOpen, setIsOnboardingOpen, generateAIAnswer } =
    useAppStore();

  const [step, setStep] = useState(1);
  const [groqKey, setGroqKey] = useState(config.groqApiKey || '');
  const [geminiKey, setGeminiKey] = useState(config.geminiApiKey || '');
  const [resume, setResume] = useState(config.resumeText || '');
  const [jobDescription, setJobDescription] = useState(config.jobDescription || '');
  const [companyName, setCompanyName] = useState(config.companyName || '');
  const [candidateName, setCandidateName] = useState(config.candidateName || '');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  if (!isOnboardingOpen) return null;

  const handleNext = () => {
    if (step === 1) {
      updateConfig({ groqApiKey: groqKey.trim() });
      setStep(2);
    } else if (step === 2) {
      updateConfig({ geminiApiKey: geminiKey.trim() });
      setStep(3);
    } else if (step === 3) {
      updateConfig({
        resumeText: resume,
        jobDescription: jobDescription,
        companyName: companyName,
        candidateName: candidateName,
      });
      setStep(4);
    } else if (step === 4) {
      updateConfig({ onboardingCompleted: true });
      setIsOnboardingOpen(false);
    }
  };

  const handleTestAPI = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      if (!groqKey.trim() && !geminiKey.trim()) {
        setTestResult('❌ Please enter at least one valid API key first.');
        setTesting(false);
        return;
      }
      // Trigger a short test
      await generateAIAnswer('Test question: Give a 1-sentence intro for a software engineer interview.');
      setTestResult('✅ AI Connection verified successfully! System is ready.');
    } catch (e: any) {
      setTestResult(`❌ Connection error: ${e.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#171717] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-parakeet-500 flex items-center justify-center text-black font-extrabold text-xs">
              P
            </div>
            <span className="font-bold text-white text-sm">Welcome to Parakeet Free Unlimited</span>
          </div>
          <span className="text-xs font-mono text-parakeet-400">Step {step} of 4</span>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto max-h-[460px] space-y-4">
          {/* Step 1: Groq API Key */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-parakeet-500/10 border border-parakeet-500/30 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-parakeet-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Step 1: Enter Free Groq API Key</h3>
                  <p className="text-xs text-neutral-400">
                    Powers real-time Whisper v3 voice transcription and LLaMA 3.3 STAR answers.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-900 border border-white/5 text-xs text-neutral-300 space-y-1">
                <div className="font-semibold text-white flex items-center justify-between">
                  <span>How to get your free key (30 seconds):</span>
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-parakeet-400 flex items-center gap-1 hover:underline"
                  >
                    <span>console.groq.com/keys</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Free Tier gives 14,400 requests/day. Never asks for credit cards.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Groq API Key (starts with <code className="text-parakeet-400 font-mono">gsk_</code>)
                </label>
                <input
                  type="password"
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-parakeet-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: Gemini API Key */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-parakeet-500/10 border border-parakeet-500/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-parakeet-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Step 2: Enter Google Gemini Key (Optional)</h3>
                  <p className="text-xs text-neutral-400">
                    Powers high-context LeetCode, DSA coding rounds & system design answers.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-900 border border-white/5 text-xs text-neutral-300 space-y-1">
                <div className="font-semibold text-white flex items-center justify-between">
                  <span>How to get free Gemini key:</span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-parakeet-400 flex items-center gap-1 hover:underline"
                  >
                    <span>aistudio.google.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Free Tier provides 1,500 free requests per day.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Google Gemini API Key (starts with <code className="text-parakeet-400 font-mono">AIzaSy...</code>)
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-parakeet-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Resume & Job Description */}
          {step === 3 && (
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-parakeet-500/10 border border-parakeet-500/30 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-parakeet-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Step 3: Personalize Your STAR Engine</h3>
                  <p className="text-xs text-neutral-400">
                    Parakeet answers will reference your real projects, metrics, and target role.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                    Target Company
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Stripe / Google"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                  Paste Resume (Text or Markdown)
                </label>
                <textarea
                  rows={3}
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste your past experience, skills, metrics (e.g., 'Led auth migration reducing latency 40%...')"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-parakeet-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                  Paste Job Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste role requirements..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-parakeet-500 font-mono"
                />
              </div>
            </div>
          )}

          {/* Step 4: Test & Verify */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-parakeet-500/10 border border-parakeet-500/30 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-parakeet-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Step 4: Verify & Launch</h3>
                  <p className="text-xs text-neutral-400">
                    Everything is encrypted locally on your machine with 24-hour auto-purge.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/90 border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Anti-Screen Share Protection:</span>
                  <span className="text-parakeet-400 font-mono font-semibold">ACTIVE (Undetectable)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Transcription Hotkey:</span>
                  <span className="text-white font-mono bg-neutral-800 px-2 py-0.5 rounded">Ctrl + Space</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Code Mode Hotkey:</span>
                  <span className="text-white font-mono bg-neutral-800 px-2 py-0.5 rounded">Ctrl + Shift + C</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleTestAPI}
                  disabled={testing}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-2 border border-white/10"
                >
                  <Zap className="w-3.5 h-3.5 text-parakeet-400" />
                  <span>{testing ? 'Testing connection...' : 'Test AI Connection'}</span>
                </button>
                {testResult && (
                  <span className="text-xs font-mono text-parakeet-400">{testResult}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-[#171717] border-t border-white/10 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-parakeet-500 hover:bg-parakeet-400 text-black text-xs font-bold flex items-center gap-2 shadow-glow-green-sm transition-transform hover:scale-105"
          >
            <span>{step === 4 ? 'Launch Overlay' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

