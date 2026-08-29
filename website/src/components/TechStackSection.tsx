"use client";

import React from "react";
import { Cpu, Terminal, Sparkles, Layers, ShieldCheck, Zap } from "lucide-react";

const TECH_ITEMS = [
  {
    name: "Groq Whisper Large v3",
    role: "Speech-to-Text",
    desc: "48kHz high-sample audio processing running on custom LPUs for near-instant transcription.",
  },
  {
    name: "LLaMA 3.3 70B & DeepSeek",
    role: "Intelligence Engine",
    desc: "Ultra-fast inference generating structured FAANG bullet points in under 400 milliseconds.",
  },
  {
    name: "Electron & Chromium",
    role: "Desktop Framework",
    desc: "Native transparent desktop HUD with hardware window sharing exclusion.",
  },
  {
    name: "TypeScript & React",
    role: "Frontend Architecture",
    desc: "Type-safe, high-performance UI state management powered by Zustand.",
  },
  {
    name: "Web Speech API",
    role: "Interim Streaming",
    desc: "Zero-latency live visual feedback while interviewer or candidate is speaking.",
  },
  {
    name: "Tailwind CSS",
    role: "Design System",
    desc: "Sleek, dark-mode visual interface with accessible contrast and glowing accents.",
  },
];

export function TechStackSection() {
  return (
    <section id="tech-stack" className="py-24 bg-[#070707] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-xs font-mono font-semibold mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>Under The Hood</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built with Modern, Ultra-Fast Tech
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400">
            Powered by Groq LPUs, Electron, and high-performance Web Audio API for sub-second responses.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TECH_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/5 hover:border-[#00ff88]/30 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-semibold text-[#00ff88] bg-[#00ff88]/10 px-2 py-0.5 rounded border border-[#00ff88]/20">
                  {item.role}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-neutral-600 group-hover:text-[#00ff88] transition-colors" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#00ff88] transition-colors">
                {item.name}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

