"use client";

import React from "react";
import { ArrowRight, Play, CheckCircle2, Shield, Zap, Sparkles, Code2, Lock } from "lucide-react";
import { GITHUB_REPO_URL } from "./Navbar";

export function HeroSection() {
  return (
    <section className="relative pt-36 pb-20 overflow-hidden">
      {/* Ambient Neon Green Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-[#00ff88]/20 via-[#00ff88]/10 to-transparent blur-[130px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#00ff88]/5 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/90 border border-white/10 text-xs sm:text-sm text-neutral-300 mb-8 backdrop-blur-md shadow-lg">
            <span className="flex h-2 w-2 rounded-full bg-[#00ff88] animate-ping" />
            <span className="font-semibold text-white">#1 Open Source Interview Co-Pilot</span>
            <span className="text-neutral-500">•</span>
            <span className="text-[#00ff88] font-mono font-medium">100% Free Forever</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Ace Every Interview with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-emerald-400 to-teal-300">
              Real-Time AI Assistance
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-neutral-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Interview AI listens to interviewer questions and generates perfect answers instantly. Supports manual and auto mode, Python/Java code switching, and zero hallucinations.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#00ff88] hover:bg-[#00e67a] text-black font-bold text-base transition-all duration-200 shadow-glow-green hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#showcase"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#141414] hover:bg-[#1e1e1e] text-white font-medium text-base border border-white/10 transition-all duration-200"
            >
              <Play className="w-4 h-4 text-[#00ff88] fill-[#00ff88]" />
              <span>Watch Live Demo</span>
            </a>
          </div>

          {/* Highlights & Guarantees */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-neutral-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
              <span>100% Free & Open Source</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
              <span>Zero Hallucinations Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
              <span>Instant Python ⇄ Java Switching</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
              <span>Manual (Ctrl+Enter) & Auto Mode</span>
            </div>
          </div>
        </div>

        {/* Feature Matrix Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="p-4 rounded-xl bg-[#111111]/80 border border-white/5 backdrop-blur flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-[#00ff88]" />
            </div>
            <h3 className="text-white font-semibold text-sm">Anti-Screen Share</h3>
            <p className="text-neutral-400 text-xs mt-1">Undetectable in Zoom, Meet, & Teams window shares</p>
          </div>

          <div className="p-4 rounded-xl bg-[#111111]/80 border border-white/5 backdrop-blur flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-[#00ff88]" />
            </div>
            <h3 className="text-white font-semibold text-sm">Groq Whisper v3</h3>
            <p className="text-neutral-400 text-xs mt-1">48kHz hardware-accelerated speech-to-text</p>
          </div>

          <div className="p-4 rounded-xl bg-[#111111]/80 border border-white/5 backdrop-blur flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 flex items-center justify-center mb-3">
              <Code2 className="w-5 h-5 text-[#00ff88]" />
            </div>
            <h3 className="text-white font-semibold text-sm">Instant Code Switch</h3>
            <p className="text-neutral-400 text-xs mt-1">Dual-language caching in 0.01 seconds</p>
          </div>

          <div className="p-4 rounded-xl bg-[#111111]/80 border border-white/5 backdrop-blur flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-[#00ff88]" />
            </div>
            <h3 className="text-white font-semibold text-sm">Humanized Answers</h3>
            <p className="text-neutral-400 text-xs mt-1">SAY THIS block with conversational flow</p>
          </div>
        </div>
      </div>
    </section>
  );
}
