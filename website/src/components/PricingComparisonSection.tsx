"use client";

import React from "react";
import { Check, X, Sparkles, ArrowRight, Github, Zap } from "lucide-react";
import { GITHUB_REPO_URL } from "./Navbar";

const COMPARISON_ROWS = [
  {
    feature: "Pricing & Subscription",
    interviewAI: "100% Free Forever (Open Source)",
    parakeet: "$49 - $99 / month",
    finalRound: "$99 - $149 / month",
    highlight: true,
  },
  {
    feature: "Zero Hallucination Filter",
    interviewAI: "6-Layer Hardware RMS + Context Gating",
    parakeet: "Basic Voice Detection",
    finalRound: "Standard VAD (Frequent Ghosting)",
    highlight: true,
  },
  {
    feature: "Instant Code Switching (Python ⇄ Java)",
    interviewAI: "0.01s Instant In-Memory Dual Cache",
    parakeet: "Requires 4-5s API Re-call",
    finalRound: "Single Language (No Instant Toggle)",
    highlight: true,
  },
  {
    feature: "Universal Language Support",
    interviewAI: "Python, Java, Go, Rust, C++, SQL, TS",
    parakeet: "Python / Java Only",
    finalRound: "Generic Code Blocks",
    highlight: false,
  },
  {
    feature: "Manual Mode Discretion (Ctrl+Enter)",
    interviewAI: "Yes, Full Candidate Control",
    parakeet: "Partial Hotkey Support",
    finalRound: "Auto-Only Triggering",
    highlight: false,
  },
  {
    feature: "Speech-to-Text Model",
    interviewAI: "Groq Whisper Large v3 (48kHz)",
    parakeet: "Proprietary Whisper Medium",
    finalRound: "Standard Whisper v2",
    highlight: false,
  },
  {
    feature: "Humanized 'SAY THIS' Script",
    interviewAI: "90-130 Words Natural Conversational",
    parakeet: "Robotic Textbook Bullets",
    finalRound: "Long AI Paragraph",
    highlight: true,
  },
  {
    feature: "Anti-Screen Share Overlay",
    interviewAI: "Native Chromium Window Exclusion",
    parakeet: "Browser Window Only",
    finalRound: "Electron Window Only",
    highlight: false,
  },
  {
    feature: "Data Privacy & BYOK",
    interviewAI: "Direct Groq API (Zero Middleman)",
    parakeet: "Stored on 3rd-Party Cloud",
    finalRound: "Session Recorded on 3rd-Party Server",
    highlight: true,
  },
  {
    feature: "Live Diarization (Interviewer vs Candidate)",
    interviewAI: "Dual Loopback Hardware Split",
    parakeet: "Single Channel Audio",
    finalRound: "Single Channel Audio",
    highlight: false,
  },
  {
    feature: "Custom Context Grounding (Resume + Job)",
    interviewAI: "Deep Injection with MTTD Metrics",
    parakeet: "Basic Resume Text",
    finalRound: "Resume Upload Limit",
    highlight: true,
  },
  {
    feature: "Offline & Self-Hostable",
    interviewAI: "Yes (Full MIT Source Code)",
    parakeet: "No (Proprietary Closed Source)",
    finalRound: "No (Proprietary Closed Source)",
    highlight: true,
  },
];

export function PricingComparisonSection() {
  return (
    <section id="comparison" className="py-24 bg-[#08080a] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Market Benchmark</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Compare Against Expensive Paid Copilots
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400">
            Stop paying monthly subscriptions for interview copilots. Interview AI is faster, open-source, and eliminates hallucinations.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-[#0f0f14] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#14141c]">
                  <th className="p-4 sm:p-5 text-xs sm:text-sm font-bold text-neutral-400 uppercase tracking-wider">
                    Feature & Capabilities
                  </th>
                  <th className="p-4 sm:p-5 text-xs sm:text-sm font-bold text-brand-400 uppercase tracking-wider bg-brand-500/10 border-x border-brand-500/20">
                    Interview AI (Ours)
                  </th>
                  <th className="p-4 sm:p-5 text-xs sm:text-sm font-bold text-purple-400 uppercase tracking-wider">
                    Parakeet AI
                  </th>
                  <th className="p-4 sm:p-5 text-xs sm:text-sm font-bold text-neutral-400 uppercase tracking-wider">
                    Final Round AI
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm font-sans">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-white">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-brand-400 bg-brand-500/5 border-x border-brand-500/20">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-brand-400 shrink-0" />
                        <span>{row.interviewAI}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-neutral-300">
                      {row.parakeet}
                    </td>
                    <td className="p-4 sm:p-5 text-neutral-400">
                      {row.finalRound}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Banner */}
          <div className="p-6 bg-[#14141c] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-white font-bold text-sm">Experience True Zero-Latency Assistance</div>
              <div className="text-neutral-400 text-xs mt-0.5">100% Free Forever • Created by Mohan Krishna Namburu</div>
            </div>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-black font-bold text-xs transition-all shadow-glow-orange-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <Github className="w-4 h-4" />
              <span>Get Started Free on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
