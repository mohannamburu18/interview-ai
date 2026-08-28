"use client";

import React from "react";
import { Download, ShieldCheck, Zap, Globe, Sparkles, CheckCircle2, Play, Lock, Monitor, Laptop, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-parakeet-500/20 via-parakeet-400/10 to-transparent blur-[120px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-parakeet-500/5 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/90 border border-white/10 text-xs sm:text-sm text-neutral-300 mb-8 backdrop-blur-md shadow-lg">
            <span className="flex h-2 w-2 rounded-full bg-parakeet-500 animate-ping" />
            <span className="font-semibold text-white">#1 Interview Assistant on the Market</span>
            <span className="text-neutral-500">•</span>
            <span className="text-parakeet-400 font-mono font-medium">100% Free & Unlimited BYOK</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Crush Every Interview With An{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-parakeet-400 via-parakeet-500 to-emerald-300">
              Invisible AI Co-Pilot
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-neutral-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Real-time live speech transcription, instant STAR-method responses, and LeetCode algorithmic solutions displayed right over your video call window. Completely hidden from Zoom, Teams & Meet screen recording.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#download"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-parakeet-500 hover:bg-parakeet-400 text-black font-bold text-base transition-all duration-200 shadow-glow-green hover:scale-[1.03] active:scale-[0.98]"
            >
              <Download className="w-5 h-5" />
              <span>Download for Free — No Credits</span>
            </a>
            <a
              href="#demo"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#141414] hover:bg-[#1e1e1e] text-white font-medium text-base border border-white/10 transition-all duration-200"
            >
              <Play className="w-4 h-4 text-parakeet-400 fill-parakeet-400" />
              <span>Try Live Simulator</span>
            </a>
          </div>

          {/* Guarantees / Highlights */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-neutral-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-parakeet-500" />
              <span>Zero OpenAI bill ($0 forever)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-parakeet-500" />
              <span>100% Undetectable overlay</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-parakeet-500" />
              <span>Windows, macOS & Linux</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-parakeet-500" />
              <span>59 Languages supported</span>
            </div>
          </div>
        </div>

        {/* Feature Pill Matrix */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="p-4 rounded-xl bg-[#111111]/80 border border-white/5 backdrop-blur flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-lg bg-parakeet-500/10 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-parakeet-400" />
            </div>
            <h3 className="text-white font-semibold text-sm">Anti-Screen Share</h3>
            <p className="text-neutral-400 text-xs mt-1">Hidden from Zoom, Meet, & Teams window sharing</p>
          </div>

          <div className="p-4 rounded-xl bg-[#111111]/80 border border-white/5 backdrop-blur flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-lg bg-parakeet-500/10 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-parakeet-400" />
            </div>
            <h3 className="text-white font-semibold text-sm">Groq Whisper v3</h3>
            <p className="text-neutral-400 text-xs mt-1">Real-time low-latency voice-to-text engine</p>
          </div>

          <div className="p-4 rounded-xl bg-[#111111]/80 border border-white/5 backdrop-blur flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-lg bg-parakeet-500/10 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-parakeet-400" />
            </div>
            <h3 className="text-white font-semibold text-sm">STAR Method Built-in</h3>
            <p className="text-neutral-400 text-xs mt-1">Tailors answers to your resume & target job spec</p>
          </div>

          <div className="p-4 rounded-xl bg-[#111111]/80 border border-white/5 backdrop-blur flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-lg bg-parakeet-500/10 flex items-center justify-center mb-3">
              <Globe className="w-5 h-5 text-parakeet-400" />
            </div>
            <h3 className="text-white font-semibold text-sm">59+ Languages</h3>
            <p className="text-neutral-400 text-xs mt-1">Transcribes and replies in any global tongue</p>
          </div>
        </div>
      </div>
    </section>
  );
}

