"use client";

import React from "react";
import { Video, Code2, MonitorPlay, Check, Sparkles } from "lucide-react";

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
    badgeColor: "text-brand-400 bg-brand-500/10 border-brand-500/20",
    icon: "📹",
    desc: "Undetectable overlay floats over Zoom window without triggering screen recording flags.",
  },
  {
    name: "Google Meet",
    category: "Video Conferencing",
    badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    icon: "📞",
    desc: "Seamless browser tab audio capture and live speech-to-text response generation.",
  },
  {
    name: "Microsoft Teams",
    category: "Video Conferencing",
    badgeColor: "text-brand-400 bg-brand-500/10 border-brand-500/20",
    icon: "👥",
    desc: "Works inside enterprise Teams calls with system audio loopback detection.",
  },
  {
    name: "HackerRank",
    category: "Coding Assessment",
    badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    icon: "💻",
    desc: "Code Mode instantly analyzes coding prompts and outputs clean, optimal solutions.",
  },
  {
    name: "LeetCode & CodeSignal",
    category: "Coding Assessment",
    badgeColor: "text-brand-400 bg-brand-500/10 border-brand-500/20",
    icon: "⚡",
    desc: "Generates step-by-step Big-O complexity analysis and corner-case test verifications.",
  },
  {
    name: "CoderPad & Karat",
    category: "Interview Suite",
    badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    icon: "🎯",
    desc: "Live pair programming companion with interactive debugging advice.",
  },
];

export function PlatformsSection() {
  return (
    <section className="py-24 bg-[#08080a] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Universal Compatibility</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Works Seamlessly With All Interview Platforms
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400">
            Engineered to run natively on top of any video conferencing or coding assessment environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {PLATFORMS.map((platform, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#0f0f14] border border-white/5 hover:border-brand-500/30 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{platform.icon}</span>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md border ${platform.badgeColor}`}
                  >
                    {platform.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                  {platform.name}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                  {platform.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs text-brand-400 font-medium">
                <Check className="w-4 h-4 text-brand-400" />
                <span>100% Undetectable</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
