"use client";

import React from "react";
import { Mic, Sliders, Zap, MessageSquare, ShieldAlert, Cpu, Sparkles, Terminal, CheckCircle2, Globe, Lock } from "lucide-react";

const FEATURES = [
  {
    icon: Mic,
    title: "Real-Time 48kHz Transcription",
    badge: "Meta AI Tier",
    color: "orange",
    description: "48kHz high-sample-rate audio stream processing powered by Groq Whisper Large v3 for studio-grade transcription accuracy without latency.",
  },
  {
    icon: Sliders,
    title: "Manual & Auto Mode Control",
    badge: "Total Discretion",
    color: "purple",
    description: "In Manual Mode, press Ctrl+Enter to generate answers whenever you're ready. In Auto Mode, answers trigger smoothly after 3.5 seconds of silence.",
  },
  {
    icon: Zap,
    title: "Instant Polyglot Code Switching",
    badge: "0.01s Latency",
    color: "orange",
    description: "Pre-generates both Python, Java, C++, and SQL implementations in a single pass. Switch between language tabs instantly with zero API loading or delays.",
  },
  {
    icon: MessageSquare,
    title: "Humanized Verbal Scripts",
    badge: "SAY THIS Matrix",
    color: "purple",
    description: "The SAY THIS section delivers 90-130 words in simple, confident everyday English structured for live verbal communication with real project context.",
  },
  {
    icon: ShieldAlert,
    title: "Zero Hallucinations Guarantee",
    badge: "6-Layer Filter",
    color: "orange",
    description: "Hardware RMS loudness gating and strict domain validation ensure the screen stays completely clean and empty during silence.",
  },
  {
    icon: Globe,
    title: "Universal Domain Intelligence",
    badge: "All Tech Stacks",
    color: "purple",
    description: "Specialized prompt tuning for OOPS Pillars, CRUD SQL, Cisco TrustSec, Spring Boot, React, Go, Rust, System Design, and LeetCode algorithmic challenges.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[#08080a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built For Top Engineering Roles</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Everything You Need to Crack Interviews
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400">
            Engineered from the ground up for FAANG, Barclays, Cisco, and Tier-1 tech interviews with zero lag and zero compromise.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            const isOrange = feat.color === "orange";
            return (
              <div
                key={idx}
                className={`p-7 rounded-2xl bg-[#0f0f14] border transition-all duration-300 group flex flex-col justify-between ${
                  isOrange
                    ? "border-white/5 hover:border-brand-500/40 hover:shadow-glow-orange-sm"
                    : "border-white/5 hover:border-purple-500/40 hover:shadow-glow-purple-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                        isOrange
                          ? "bg-brand-500/10 border border-brand-500/20 text-brand-400"
                          : "bg-purple-500/10 border border-purple-500/20 text-purple-400"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-md border ${
                        isOrange
                          ? "bg-brand-500/5 text-brand-400 border-brand-500/20"
                          : "bg-purple-500/5 text-purple-400 border-purple-500/20"
                      }`}
                    >
                      {feat.badge}
                    </span>
                  </div>

                  <h3
                    className={`text-lg font-bold text-white mb-2 transition-colors ${
                      isOrange ? "group-hover:text-brand-400" : "group-hover:text-purple-400"
                    }`}
                  >
                    {feat.title}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                    {feat.description}
                  </p>
                </div>

                <div
                  className={`mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs font-medium ${
                    isOrange ? "text-brand-400" : "text-purple-400"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Production Ready</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
