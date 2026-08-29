"use client";

import React, { useState } from "react";
import { Cpu, Shield, Zap, Terminal, Layers, Radio, Sparkles, Code2, Headphones, Lock, CheckCircle2, ArrowRight } from "lucide-react";

interface PipelineStage {
  id: string;
  step: string;
  name: string;
  tag: string;
  icon: any;
  color: "orange" | "purple";
  headline: string;
  description: string;
  metrics: Array<{ label: string; value: string }>;
  codeSnippet: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "audio",
    step: "01",
    name: "Dual Audio Loopback",
    tag: "Hardware Level",
    icon: Headphones,
    color: "orange",
    headline: "System & Microphone Separation at 48kHz",
    description: "Captures interviewer speaker audio via OS loopback while isolating candidate microphone audio. Hardware RMS amplitude analysis guarantees zero processing during silence.",
    metrics: [
      { label: "Sample Rate", value: "48,000 Hz" },
      { label: "Noise Floor Gate", value: "> 0.022 RMS" },
      { label: "Channel Latency", value: "< 12 ms" },
    ],
    codeSnippet: `// Hardware-Level Audio Energy & VAD Gate
const rms = calculateAudioRMS(audioFrame);
if (rms < NOISE_FLOOR_THRESHOLD) {
  return; // Drop ambient fan noise & silence
}
if (continuousVoiceMs >= 1400) {
  routeToWhisperEngine(audioSlice);
}`,
  },
  {
    id: "transcribe",
    step: "02",
    name: "Groq Whisper Large v3",
    tag: "STT Engine",
    icon: Zap,
    color: "purple",
    headline: "Sub-50ms Speech-to-Text with Context Biasing",
    description: "Groq LPU hardware runs Whisper Large v3 at temperature 0.0, disambiguating domain jargon (TrustSec, SGT, CRUD, OOPS) with zero hallucination.",
    metrics: [
      { label: "Inference Time", value: "48 ms" },
      { label: "Temperature", value: "0.0 (Deterministic)" },
      { label: "Model", value: "Whisper Large v3" },
    ],
    codeSnippet: `const response = await groq.audio.transcriptions.create({
  file: audioFile,
  model: "whisper-large-v3",
  temperature: 0, // Maximum deterministic accuracy
  response_format: "json",
});`,
  },
  {
    id: "reasoning",
    step: "03",
    name: "Prompt Reasoning Matrix",
    tag: "AI Core",
    icon: Sparkles,
    color: "orange",
    headline: "Resume Grounding & Conversational SAY THIS Synthesis",
    description: "LLaMA 3.3 70B synthesizes structured technical concepts, SQL mappings, and 90-130 word conversational scripts calibrated to your real work experience at Nyeras Edutech.",
    metrics: [
      { label: "Token Velocity", value: "320 tok/sec" },
      { label: "Format", value: "Parakeet Structured" },
      { label: "SAY THIS Target", value: "90 - 130 words" },
    ],
    codeSnippet: `// High-impact conversational verbal response synthesis
const systemPrompt = PromptEngine.buildSystemPrompt({
  resumeContext: candidateProfile,
  targetRole: "Senior Java & Spring Boot Engineer",
  structure: ["DEFINITION", "KEY_OPS", "CODE_DUAL", "SAY_THIS"]
});`,
  },
  {
    id: "cache",
    step: "04",
    name: "Dual-Language Memory Cache",
    tag: "Zero-Latency UI",
    icon: Code2,
    color: "purple",
    headline: "Instant 0.01s Multi-Language Tab Switching",
    description: "Pre-compiles both Python and Java algorithms in the initial generation payload. Tab switches occur entirely in frontend RAM with zero secondary network calls.",
    metrics: [
      { label: "Switch Latency", value: "0.01 seconds" },
      { label: "Languages", value: "Python, Java, C++, SQL" },
      { label: "Network Calls on Click", value: "0 (Pure RAM)" },
    ],
    codeSnippet: `// In-Memory Multi-Language Code Registry
const codeMap = {
  python: "def is_prime(n): ...",
  java: "public class PrimeCheck { ... }",
  cpp: "bool isPrime(int n) { ... }"
};
// 0ms instant tab swap
const activeSnippet = codeMap[selectedTab];`,
  },
  {
    id: "overlay",
    step: "05",
    name: "Undetectable Native HUD",
    tag: "Desktop Engine",
    icon: Lock,
    color: "orange",
    headline: "Chromium Window Exclusion from Screen Share",
    description: "Electron overlay leverages OS window display affinities, rendering completely invisible to Zoom, Microsoft Teams, and Google Meet screen captures.",
    metrics: [
      { label: "Frame Rate", value: "60 FPS" },
      { label: "Screen Capture Mode", value: "WDA_EXCLUDEFROMCAPTURE" },
      { label: "Memory Footprint", value: "< 45 MB" },
    ],
    codeSnippet: `// Native OS Window Sharing Protection
mainWindow.setContentProtection(true);
mainWindow.setAlwaysOnTop(true, 'screen-saver');
mainWindow.setVisibleOnAllWorkspaces(true);`,
  },
];

export function ArchitectureSection() {
  const [activeStage, setActiveStage] = useState<PipelineStage>(PIPELINE_STAGES[0]);

  return (
    <section id="architecture" className="py-24 bg-[#08080a] relative overflow-hidden border-t border-white/5">
      {/* Background Ambient Violet & Amber Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[350px] bg-brand-500/10 blur-[130px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[350px] bg-purple-500/10 blur-[130px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-semibold mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Under The Hood Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered for Sub-Second Precision
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400">
            A low-latency, multi-stage processing pipeline built for ultra-fast response delivery and complete privacy.
          </p>
        </div>

        {/* Pipeline Navigation Steps */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-5xl mx-auto mb-8">
          {PIPELINE_STAGES.map((stage) => {
            const Icon = stage.icon;
            const isSelected = activeStage.id === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage)}
                className={`p-3.5 rounded-xl text-left transition-all duration-200 border flex flex-col justify-between ${
                  isSelected
                    ? stage.color === "orange"
                      ? "bg-brand-500/10 border-brand-500/40 shadow-glow-orange-sm"
                      : "bg-purple-500/10 border-purple-500/40 shadow-glow-purple-sm"
                    : "bg-[#0f0f14] border-white/5 hover:border-white/20 text-neutral-400"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-neutral-500">
                    {stage.step}
                  </span>
                  <Icon
                    className={`w-4 h-4 ${
                      isSelected
                        ? stage.color === "orange"
                          ? "text-brand-400"
                          : "text-purple-400"
                        : "text-neutral-500"
                    }`}
                  />
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {stage.name}
                </div>
                <span
                  className={`text-[10px] font-mono mt-1 ${
                    isSelected
                      ? stage.color === "orange"
                        ? "text-brand-400"
                        : "text-purple-400"
                      : "text-neutral-500"
                  }`}
                >
                  {stage.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Stage Details Card */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-[#0e0e14] border border-white/10 p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-md ${
                    activeStage.color === "orange"
                      ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                      : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                  }`}
                >
                  Step {activeStage.step} • {activeStage.tag}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white leading-snug">
                {activeStage.headline}
              </h3>

              <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                {activeStage.description}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {activeStage.metrics.map((metric, mIdx) => (
                  <div key={mIdx} className="p-3 rounded-xl bg-black/50 border border-white/5">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase truncate">
                      {metric.label}
                    </div>
                    <div
                      className={`text-xs sm:text-sm font-bold font-mono mt-1 truncate ${
                        activeStage.color === "orange" ? "text-brand-400" : "text-purple-400"
                      }`}
                    >
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Interactive Code / Terminal Column */}
            <div className="lg:col-span-6">
              <div className="rounded-xl bg-[#050508] border border-white/10 overflow-hidden font-mono shadow-xl">
                <div className="bg-[#12121a] px-4 py-2.5 border-b border-white/5 flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-[11px] text-neutral-300 ml-1">
                      {activeStage.id}.engine.ts
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500">Execution Kernel</span>
                </div>
                <pre className="p-4 text-xs text-neutral-200 leading-relaxed overflow-x-auto selection:bg-neutral-800 font-mono">
                  {activeStage.codeSnippet}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

