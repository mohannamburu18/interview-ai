"use client";

import React from "react";
import { Video, Code2, MonitorPlay, Check } from "lucide-react";

interface Platform {
  name: string;
  category: "Video Conferencing" | "Coding Assessment" | "Interview Suite";
  badgeColor: string;
  icon: string;
  desc: string;
}

const PLATFORMS: Platform[] = [
  {
    name: "Zoom Video",
    category: "Video Conferencing",
    badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    icon: "📹",
    desc: "Undetectable overlay floats over Zoom window without triggering screen recording flags.",
  },
  {
    name: "Google Meet",
    category: "Video Conferencing",
    badgeColor: "text-green-400 bg-green-500/10 border-green-500/20",
    icon: "📞",
    desc: "Seamless browser tab audio capture and live speech-to-text response generation.",
  },
  {
    name: "Microsoft Teams",
    category: "Video Conferencing",
    badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    icon: "👥",
    desc: "Works inside enterprise Teams calls with system audio loopback detection.",
  },
  {
    name: "HackerRank",
    category: "Coding Assessment",
    badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    icon: "💻",
    desc: "Code Mode instantly analyzes coding prompts and outputs clean, optimal solutions.",
  },
  {
    name: "LeetCode & CodeSignal",
    category: "Coding Assessment",
    badgeColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    icon: "⚡",
    desc: "Generates step-by-step Big-O complexity analysis and corner-case test verifications.",
  },
  {
    name: "CoderPad & Karat",
    category: "Interview Suite",
    badgeColor: "text-red-400 bg-red-500/10 border-red-500/20",
    icon: "🎯",
    desc: "Live pair programming companion with interactive debugging advice.",
  },
];

export function PlatformsSection() {
  return (
    <section id="platforms" className="py-20 bg-[#0d0d0d] border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-parakeet-500/10 border border-parakeet-500/30 text-parakeet-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Universal Compatibility
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Works with <span className="text-parakeet-500">Any Platform</span> You Use
          </h2>
          <p className="mt-3 text-neutral-400 text-base">
            No browser extensions or sketchy third-party bots joining the meeting. Parakeet runs as a native system overlay on your desktop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORMS.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#121212] border border-white/5 hover:border-parakeet-500/30 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{p.icon}</div>
                <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${p.badgeColor}`}>
                  {p.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-parakeet-400 transition-colors">
                {p.name}
              </h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                {p.desc}
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-parakeet-400 font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>100% Screen share invisible</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

