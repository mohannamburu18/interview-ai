"use client";

import React from "react";
import { EyeOff, Zap, FileText, Code2, Globe2, Shield, Sparkles, Sliders, Cpu, Trash2 } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
}

export function FeaturesSection() {
  const features: Feature[] = [
    {
      icon: <EyeOff className="w-6 h-6 text-parakeet-400" />,
      title: "100% Undetectable Screen Protection",
      description:
        "Utilizes native OS content protection flags. When you share your desktop or window in Zoom, Teams, or Google Meet, Parakeet remains 100% invisible to interviewers.",
      tag: "Anti-Screen Share",
    },
    {
      icon: <FileText className="w-6 h-6 text-parakeet-400" />,
      title: "Resume & JD STAR Prompt Engineering",
      description:
        "Generates tailored STAR answers grounded strictly in your personal resume projects and metrics, strictly matching the company's job requirements.",
      tag: "Personalized STAR",
    },
    {
      icon: <Code2 className="w-6 h-6 text-parakeet-400" />,
      title: "Instant Code Mode & LeetCode Solver",
      description:
        "Switch into Code Mode with Ctrl+Shift+C. Generates optimal time/space complexity solutions in Python, Java, C++, TypeScript, or Go with step-by-step logic.",
      tag: "Technical & DSA",
    },
    {
      icon: <Cpu className="w-6 h-6 text-parakeet-400" />,
      title: "Multi-Model Engine (Fast / Balanced / Smart)",
      description:
        "Switch instantly between Groq LLaMA 3.1 8B (ultra-fast sub-300ms), Groq LLaMA 3.3 70B (balanced behavioral), and Gemini 1.5 Flash (complex coding).",
      tag: "Triple Model Engine",
    },
    {
      icon: <Sliders className="w-6 h-6 text-parakeet-400" />,
      title: "Click-Through & Opacity Control",
      description:
        "Adjust transparency from 20% to 100% and enable click-through mode (`setIgnoreMouseEvents`) so you can code or browse seamlessly while reading answers.",
      tag: "Custom Overlay",
    },
    {
      icon: <Trash2 className="w-6 h-6 text-parakeet-400" />,
      title: "Zero-Cloud Privacy & 24h Auto-Delete",
      description:
        "All data is encrypted locally on your machine. All transcripts and recordings automatically purge after 24 hours. No audio is ever stored on third-party servers.",
      tag: "Privacy by Design",
    },
  ];

  return (
    <section id="features" className="py-24 bg-[#0a0a0a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-parakeet-500/10 border border-parakeet-500/30 text-parakeet-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Industry Leading Tech
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            Engineered for <span className="text-parakeet-500">Zero Detection</span> & Total Success
          </h2>
          <p className="mt-4 text-neutral-400 text-base sm:text-lg">
            Every feature is carefully built to give you effortless conversational flow and unfair competitive advantage during interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl bg-[#111111] border border-white/5 hover:border-parakeet-500/30 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#181818] border border-white/10 flex items-center justify-center group-hover:border-parakeet-500/30 transition-colors">
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-parakeet-500/10 text-parakeet-400 border border-parakeet-500/20">
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-parakeet-400 transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

