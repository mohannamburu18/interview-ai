"use client";

import React, { useState } from "react";
import { Cpu, Shield, Zap, Layers, Sparkles, Code2, Headphones, Lock, CheckCircle2, ArrowRight, ShieldCheck, Activity, Terminal } from "lucide-react";

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
  capabilities: string[];
  workflow: string[];
  guarantee: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "audio",
    step: "01",
    name: "Dual Audio Loopback",
    tag: "Hardware Level",
    icon: Headphones,
    color: "orange",
    headline: "System & Microphone Separation at 48,000 Hz",
    description: "Captures interviewer speaker audio via low-level OS loopback while isolating candidate microphone audio. Hardware RMS amplitude analysis guarantees zero processing during silence.",
    metrics: [
      { label: "Sample Rate", value: "48,000 Hz" },
      { label: "Noise Floor Gate", value: "> 0.022 RMS" },
      { label: "Channel Latency", value: "< 12 ms" },
    ],
    capabilities: [
      "Hardware-level loopback isolates Zoom, Teams & Google Meet audio from background noise",
      "Real-time RMS energy analysis drops keyboard typing, chair creaks & ambient fan hums",
      "Dedicated multi-channel audio stream routing prevents candidate filler words from becoming questions",
      "Dynamic automatic gain control (AGC) normalizes soft interviewer voices for 100% clarity",
    ],
    workflow: [
      "OS Loopback Audio Capture (48kHz Studio Quality)",
      "RMS Loudness Measurement & Ambient Noise Filter (< 0.022 RMS dropped)",
      "Continuous Speech Duration Gate (Requires >= 1.4s real speech)",
      "Direct Channel Routing to Whisper Transcription Engine",
    ],
    guarantee: "100% Clean Screen during silence — zero ghost transcripts sent to AI.",
  },
  {
    id: "transcribe",
    step: "02",
    name: "Groq Whisper Large v3",
    tag: "STT Engine",
    icon: Zap,
    color: "purple",
    headline: "Sub-50ms Speech-to-Text with Domain Biasing",
    description: "Groq LPU hardware runs Whisper Large v3 at deterministic temperature 0.0, disambiguating complex domain terms (TrustSec, SGT, CRUD, OOPS) with zero creative invention.",
    metrics: [
      { label: "Inference Time", value: "48 ms" },
      { label: "Temperature", value: "0.0 (Deterministic)" },
      { label: "Model", value: "Whisper Large v3" },
    ],
    capabilities: [
      "Ultra-fast transcription running directly on specialized Groq Language Processing Units",
      "Zero prompt echoing vulnerability: eliminates phantom URL and keyword loop hallucinations",
      "Comprehensive technical dictionary auto-corrects misheard acronyms silently before display",
      "Continuous fragment merging joins multi-sentence interview questions without losing final words",
    ],
    workflow: [
      "Deterministic Audio Chunk Ingestion (Temperature: 0.0)",
      "Technical Domain Disambiguation (Cisco TrustSec, CRUD, OOPS)",
      "6-Layer Post-Transcription Sanity Filter (Rejects links, spam & loops)",
      "Zero-Loss Question Buffer Aggregation & Live Diarization",
    ],
    guarantee: "Sub-50ms transcription latency with 100% domain jargon accuracy.",
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
    capabilities: [
      "Generates scannable, high-impact bullet points: Core Syntax, Key Operations & Real World",
      "Translates textbook theory into humanized 5-sentence conversational scripts ready to speak",
      "Deeply grounds answers in your actual resume achievements, metrics, and Java 17 / Spring Boot stack",
      "Automatic question classification: dynamically adjusts between Algorithm, Theory, System Design & STAR",
    ],
    workflow: [
      "Question Intent Classification (Coding vs Theory vs Behavioral)",
      "Resume Grounding & Metric Injection (MTTD Reduction from Hours to < 10 mins)",
      "Structured Technical Bullet Synthesis (SQL Mapping, Operations, Complexity)",
      "Conversational 'SAY THIS' Script Generation in Plain Everyday English",
    ],
    guarantee: "Answers sound like a confident engineer talking face-to-face, never like an AI.",
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
      { label: "Languages", value: "Python, Java, Go, Rust, SQL" },
      { label: "Network Calls on Click", value: "0 (Pure RAM)" },
    ],
    capabilities: [
      "Dual-language pre-generation: returns both Python and Java implementations in one single API call",
      "Instant 0.01-second tab switching between languages with zero loading spinners or waiting",
      "Language auto-detection displays the requested language tab by default while keeping alternates ready",
      "Single-click code copying automatically copies the active tab's syntax to your clipboard",
    ],
    workflow: [
      "Single-Pass Multi-Language Code Generation from LLM",
      "Frontend In-Memory Extraction & State Indexing (Python, Java, C++, SQL)",
      "Zero-Network Instant DOM Tab Switching on User Click",
      "Optimized Syntax Highlighting & Clipboard Dispatch",
    ],
    guarantee: "Instant 0.01s language toggle with zero API latency and zero secondary costs.",
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
    capabilities: [
      "Native OS window protection flags exclude the overlay from desktop and window capture encoders",
      "Always-on-top transparent HUD stays positioned over your interviewer's video call window",
      "Global shortcut control (Ctrl+Enter to trigger answers, Ctrl+\\ to toggle overlay visibility)",
      "Zero telemetry and zero data retention: all local transcripts self-purge on session completion",
    ],
    workflow: [
      "OS Window Affiliation Flag Activation (setContentProtection: true)",
      "Floating HUD Layer Composition over Video Conference Window",
      "Global Hotkey Listening (Ctrl+Enter for Manual Mode Trigger)",
      "Secure Direct BYOK API Transport with Zero Middleman Servers",
    ],
    guarantee: "100% Undetectable by Zoom, Teams, and Google Meet video capture.",
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
            A low-latency, multi-stage processing pipeline built for ultra-fast response delivery, zero hallucinations, and complete privacy.
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

        {/* Technical Matter Showcase Card (No Code Blocks) */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-[#0e0e14] border border-white/10 p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
                  Stage {activeStage.step} • {activeStage.tag}
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

              {/* Engineering Guarantee Banner */}
              <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-white/10 flex items-start gap-2.5">
                <ShieldCheck
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    activeStage.color === "orange" ? "text-brand-400" : "text-purple-400"
                  }`}
                />
                <div className="text-xs text-neutral-200 font-medium leading-relaxed">
                  <strong className="text-white font-semibold">Engineering Guarantee: </strong>
                  {activeStage.guarantee}
                </div>
              </div>
            </div>

            {/* Right Technical Matter & Process Flow Column (Replaces Raw Code) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Technical Capabilities */}
              <div className="p-5 rounded-xl bg-[#08080c] border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-white">
                  <Activity
                    className={`w-4 h-4 ${
                      activeStage.color === "orange" ? "text-brand-400" : "text-purple-400"
                    }`}
                  />
                  <span>Core Processing Capabilities</span>
                </div>
                <div className="space-y-2.5">
                  {activeStage.capabilities.map((cap, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2 text-xs text-neutral-300 leading-snug">
                      <span
                        className={`font-bold mt-[-1px] ${
                          activeStage.color === "orange" ? "text-brand-400" : "text-purple-400"
                        }`}
                      >
                        •
                      </span>
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Execution Workflow */}
              <div className="p-5 rounded-xl bg-[#08080c] border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-white">
                  <Terminal
                    className={`w-4 h-4 ${
                      activeStage.color === "orange" ? "text-brand-400" : "text-purple-400"
                    }`}
                  />
                  <span>Execution Process Flow</span>
                </div>
                <div className="space-y-2">
                  {activeStage.workflow.map((stepItem, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-2 rounded-lg bg-black/40 border border-white/5 text-xs text-neutral-300 flex items-center gap-2.5 font-mono"
                    >
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          activeStage.color === "orange"
                            ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                            : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        }`}
                      >
                        0{sIdx + 1}
                      </span>
                      <span className="truncate">{stepItem}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
