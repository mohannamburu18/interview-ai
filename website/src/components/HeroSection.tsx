"use client";

import React from "react";
import { ArrowRight, Play, CheckCircle2, Shield, Zap, Sparkles, Code2, Lock, Layers } from "lucide-react";
import { GITHUB_REPO_URL } from "./Navbar";

export function HeroSection() {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden bg-[#08080a]">
      {/* Dynamic Orange & Purple Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[850px] h-[450px] bg-gradient-to-tr from-brand-500/20 via-brand-400/10 to-transparent blur-[140px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[450px] sm:w-[650px] h-[400px] bg-gradient-to-bl from-purple-600/20 via-purple-500/10 to-transparent blur-[130px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-brand-500/5 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Top Badge Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-neutral-900/90 border border-white/10 text-xs sm:text-sm text-neutral-300 mb-8 backdrop-blur-md shadow-lg">
            <span className="flex h-2.5 w-2.5 rounded-full bg-brand-500 animate-ping" />
            <span className="font-semibold text-white">#1 Production-Grade AI Interview Co-Pilot</span>
            <span className="text-neutral-500">•</span>
            <span className="text-purple-400 font-mono font-medium">100% Free & Open Source</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Ace Every Interview with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-amber-300 to-purple-400">
              Real-Time AI Assistance
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-neutral-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Interview AI listens to interviewer questions and generates perfect answers instantly. Supports manual and auto mode, Python/Java code switching, zero hallucinations, and works across all tech stacks.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-black font-bold text-base transition-all duration-200 shadow-glow-orange hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#showcase"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#13131a] hover:bg-[#1a1a24] text-white font-medium text-base border border-purple-500/20 hover:border-purple-500/40 transition-all duration-200 shadow-glow-purple-sm"
            >
              <Play className="w-4 h-4 text-purple-400 fill-purple-400" />
              <span>Explore Live Simulator</span>
            </a>
          </div>

          {/* Highlights & Guarantees */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-neutral-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              <span>100% Free (Zero Subscriptions)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Zero Hallucinations Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              <span>Works with Any Language & Stack</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Undetectable Screen Share Overlay</span>
            </div>
          </div>
        </div>

        {/* Feature Cards Showcase Matrix */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="p-4 rounded-2xl bg-[#0f0f14]/90 border border-white/5 backdrop-blur flex flex-col items-center text-center hover:border-brand-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-brand-400" />
            </div>
            <h3 className="text-white font-semibold text-sm">Anti-Screen Share</h3>
            <p className="text-neutral-400 text-xs mt-1">Undetectable in Zoom, Meet, & Teams window shares</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0f0f14]/90 border border-white/5 backdrop-blur flex flex-col items-center text-center hover:border-purple-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold text-sm">Groq Whisper v3</h3>
            <p className="text-neutral-400 text-xs mt-1">48kHz hardware-accelerated speech-to-text</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0f0f14]/90 border border-white/5 backdrop-blur flex flex-col items-center text-center hover:border-brand-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-3">
              <Code2 className="w-5 h-5 text-brand-400" />
            </div>
            <h3 className="text-white font-semibold text-sm">Instant Code Switch</h3>
            <p className="text-neutral-400 text-xs mt-1">Dual-language caching in 0.01 seconds</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0f0f14]/90 border border-white/5 backdrop-blur flex flex-col items-center text-center hover:border-purple-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold text-sm">Humanized Answers</h3>
            <p className="text-neutral-400 text-xs mt-1">SAY THIS block with conversational flow</p>
          </div>
        </div>
      </div>
    </section>
  );
}
