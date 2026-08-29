"use client";

import React from "react";
import { Check, X, Sparkles, ArrowRight, Github } from "lucide-react";
import { GITHUB_REPO_URL } from "./Navbar";

const COMPARISON_ROWS = [
  {
    feature: "Pricing Model",
    interviewAI: "100% Free & Open Source",
    parakeet: "$49 - $99 / month",
    finalRound: "$99 - $149 / month",
    highlight: true,
  },
  {
    feature: "Zero Hallucination Filter",
    interviewAI: "6-Layer Hardware RMS + Regex Gate",
    parakeet: "Basic VAD",
    finalRound: "Standard VAD",
    highlight: true,
  },
  {
    feature: "Instant Code Switching (Python ⇄ Java)",
    interviewAI: "0.01s Instant Multi-Tab Cache",
    parakeet: "Requires 4-5s API Re-call",
    finalRound: "Single Language Output",
    highlight: true,
  },
  {
    feature: "Manual Mode Control (Ctrl+Enter)",
    interviewAI: "Yes, Full Candidate Control",
    parakeet: "Partial",
    finalRound: "Auto Only",
    highlight: false,
  },
  {
    feature: "Speech-to-Text Model",
    interviewAI: "Groq Whisper Large v3 (48kHz)",
    parakeet: "Proprietary Whisper",
    finalRound: "Standard Whisper",
    highlight: false,
  },
  {
    feature: "Humanized 'SAY THIS' Script",
    interviewAI: "90-130 Words Conversational Flow",
    parakeet: "Textbook Bullets",
    finalRound: "Generic AI Paragraph",
    highlight: true,
  },
  {
    feature: "Anti-Screen Share Overlay",
    interviewAI: "Electron Native Window Exclusion",
    parakeet: "Yes",
    finalRound: "Yes",
    highlight: false,
  },
  {
    feature: "Data Privacy & BYOK",
    interviewAI: "Direct to Groq (Zero Middleman)",
    parakeet: "Stored on 3rd-party servers",
    finalRound: "Stored on 3rd-party servers",
    highlight: true,
  },
];

export function PricingComparisonSection() {
  return (
    <section id="comparison" className="py-24 bg-[#0a0a0a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-xs font-mono font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why Choose Interview AI</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Compare Against Expensive Alternatives
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400">
            Stop paying monthly subscriptions for interview copilots. Interview AI is open source, faster, and more customizable.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-[#111111] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#161616]">
                  <th className="p-4 sm:p-5 text-xs sm:text-sm font-bold text-neutral-400 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="p-4 sm:p-5 text-xs sm:text-sm font-bold text-[#00ff88] uppercase tracking-wider bg-[#00ff88]/10 border-x border-[#00ff88]/20">
                    Interview AI (Ours)
                  </th>
                  <th className="p-4 sm:p-5 text-xs sm:text-sm font-bold text-neutral-400 uppercase tracking-wider">
                    Parakeet AI
                  </th>
                  <th className="p-4 sm:p-5 text-xs sm:text-sm font-bold text-neutral-400 uppercase tracking-wider">
                    FinalRound AI
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm font-sans">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-white">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-[#00ff88] bg-[#00ff88]/5 border-x border-[#00ff88]/20">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-[#00ff88] shrink-0" />
                        <span>{row.interviewAI}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-neutral-400">
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
          <div className="p-6 bg-[#161616] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-white font-bold text-sm">Experience the Future of Interview Prep</div>
              <div className="text-neutral-400 text-xs mt-0.5">No credit card required. Free forever.</div>
            </div>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00ff88] hover:bg-[#00e67a] text-black font-bold text-xs transition-all shadow-glow-green-sm hover:scale-[1.02] active:scale-[0.98]"
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
