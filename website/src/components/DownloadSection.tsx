"use client";

import React from "react";
import { Github, Star, ArrowRight, ShieldCheck, Download, Terminal, Sparkles } from "lucide-react";
import { GITHUB_REPO_URL } from "./Navbar";

export function DownloadSection() {
  return (
    <section id="download" className="py-28 bg-[#08080a] relative overflow-hidden border-t border-white/5">
      {/* Background Amber & Purple Neon Glows */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/15 blur-[150px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-purple-500/15 blur-[140px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-[#12121c] to-[#0a0a0f] border border-white/10 p-8 sm:p-14 text-center shadow-2xl relative overflow-hidden">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          <div className="relative z-10">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Free & Open Source</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Ace Your Next Technical Interview?
            </h2>

            {/* Subtitle */}
            <p className="mt-4 text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Clone the repository, configure your free Groq API key, and experience real-time AI interview assistance with zero hallucinations.
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-black font-bold text-base transition-all duration-200 shadow-glow-orange hover:scale-[1.03] active:scale-[0.98]"
              >
                <span>Get Started on GitHub</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#13131c] hover:bg-[#1a1a26] text-white font-semibold text-base border border-purple-500/20 hover:border-purple-500/40 transition-all duration-200 shadow-glow-purple-sm"
              >
                <Star className="w-4 h-4 text-purple-400 fill-purple-400" />
                <span>Star on GitHub</span>
              </a>
            </div>

            {/* Quick Command */}
            <div className="mt-10 max-w-md mx-auto p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-neutral-300 flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <Terminal className="w-4 h-4 text-brand-400 shrink-0" />
                <span className="truncate">git clone https://github.com/mohannamburu18/interview-ai.git</span>
              </div>
              <span className="text-[10px] text-neutral-500 uppercase ml-2 shrink-0">Terminal</span>
            </div>

            {/* Micro guarantees */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>Zero Subscription Fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>100% Data Privacy (BYOK)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>Windows, macOS & Linux</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
