"use client";

import React from "react";
import { Headphones, Mic, Keyboard, Sparkles, ArrowRight } from "lucide-react";
import { GITHUB_REPO_URL } from "./Navbar";

const STEPS = [
  {
    step: "01",
    icon: Headphones,
    title: "Connect Audio Sources",
    description: "Launch the desktop overlay and select System Audio Loopback for the interviewer and your microphone for candidate voice separation.",
    badge: "Dual Loopback",
  },
  {
    step: "02",
    icon: Mic,
    title: "Listen & Transcribe",
    description: "As the interviewer speaks, Groq Whisper Large v3 transcribes the question with zero hallucinations, combining fragments seamlessly.",
    badge: "Meta AI Accuracy",
  },
  {
    step: "03",
    icon: Keyboard,
    title: "Instant FAANG Answers",
    description: "Press Ctrl+Enter (or let Auto Mode trigger) to instantly receive technical bullet points, dual-language code, and a conversational SAY THIS script.",
    badge: "Ctrl+Enter Trigger",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-[#070707] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-xs font-mono font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Seamless Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How It Works in 3 Steps
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400">
            Get up and running in 60 seconds without installing complex drivers or virtual cables.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative p-8 rounded-2xl bg-[#0f0f0f] border border-white/5 hover:border-[#00ff88]/30 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-extrabold font-mono text-neutral-700 group-hover:text-[#00ff88] transition-colors">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center text-[#00ff88]">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-[#00ff88] bg-[#00ff88]/10 px-2.5 py-1 rounded-full mb-3">
                    {item.badge}
                  </span>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00ff88] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs text-neutral-400 group-hover:text-white transition-colors">
                  <span>Step {idx + 1} of 3</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#00ff88]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
