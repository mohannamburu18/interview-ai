"use client";

import React from "react";
import { Key, Mic, CheckCircle, ArrowRight, ShieldCheck, Sparkles, Sliders } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      icon: <Key className="w-6 h-6 text-parakeet-400" />,
      title: "Add Free API Keys & Resume",
      description:
        "Input your free Groq (14,400 req/day) and Google Gemini (1,500 req/day) keys. Paste your Resume and Target Job Description. Stored locally with AES encryption.",
      tag: "100% Free Forever",
    },
    {
      step: "02",
      icon: <Mic className="w-6 h-6 text-parakeet-400" />,
      title: "Launch Undetectable Overlay",
      description:
        "Hit Ctrl+Space to toggle listening. Parakeet transcribes interviewer speech using Groq Whisper v3 and auto-detects 800ms silence pauses.",
      tag: "Hidden From Screen Share",
    },
    {
      step: "03",
      icon: <Sparkles className="w-6 h-6 text-parakeet-400" />,
      title: "Speak Confidently & Ace the Call",
      description:
        "Get streaming STAR-method answers in concise 60-word bullet points or complete production code solutions. Never get stuck on tricky questions again.",
      tag: "Real-time AI Co-pilot",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-parakeet-500/10 border border-parakeet-500/30 text-parakeet-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Easy Setup in Under 2 Minutes
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            How <span className="text-parakeet-500">Parakeet AI</span> Works
          </h2>
          <p className="mt-4 text-neutral-400 text-base sm:text-lg">
            No complex setup, no monthly subscription fees, and no cloud data storage. Everything executes directly on your machine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#111111] border border-white/10 hover:border-parakeet-500/40 transition-all duration-300 relative flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-parakeet-500/10 border border-parakeet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-3xl font-black text-neutral-700 font-mono group-hover:text-parakeet-500/40 transition-colors">
                    {item.step}
                  </span>
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-neutral-900 border border-white/10 text-[10px] font-mono text-parakeet-400 mb-3">
                  {item.tag}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-parakeet-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center text-xs text-neutral-400 font-medium">
                <span>Step {idx + 1} of 3</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

