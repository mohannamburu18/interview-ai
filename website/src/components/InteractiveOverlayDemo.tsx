"use client";

import React, { useState, useEffect } from "react";
import { Mic, Volume2, ShieldAlert, Sparkles, Terminal, Code2, Copy, Check, Eye, EyeOff, Sliders, Play, RefreshCw, Zap } from "lucide-react";

interface SampleQuestion {
  type: "behavioral" | "coding" | "system_design";
  title: string;
  interviewerText: string;
  aiResponse: string;
  codeSnippet?: string;
  starBreakdown: {
    s: string;
    t: string;
    a: string;
    r: string;
  };
}

const SAMPLE_QUESTIONS: SampleQuestion[] = [
  {
    type: "behavioral",
    title: "Tell me about a high-stress conflict with an engineering lead",
    interviewerText: "Can you tell me about a time you had a technical disagreement with a senior engineer or tech lead, and how you resolved it under tight deadlines?",
    aiResponse: "In my previous role, our lead wanted to rebuild our auth service in Go, while I proposed patching our Node.js microservice to hit our 2-week launch deadline. I benchmarked both options with p99 latency data, presented the metrics calmly, and we compromised on patching for MVP and scheduling the Go rewrite for Q3.",
    starBreakdown: {
      s: "Auth latency spiked 2 weeks before a major customer product rollout.",
      t: "Tech lead favored full Go rewrite; I needed to protect our launch SLA.",
      a: "Produced a latency benchmark & rollback safety report in 4 hours to align stakeholders.",
      r: "Shipped on schedule with 0 downtime; completed clean refactor 2 sprints later.",
    },
  },
  {
    type: "coding",
    title: "LeetCode: Two Sum with O(n) Time & Space",
    interviewerText: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target. Can you do it in O(n)?",
    aiResponse: "Use a hash map to store `target - num` as we iterate. For each element, check if the complement already exists in the map. This achieves O(n) time complexity and O(n) space complexity.",
    codeSnippet: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>(); // num -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    starBreakdown: {
      s: "Find pair summing to target in unsorted array.",
      t: "Optimize from brute-force O(n²) to linear O(n) runtime.",
      a: "Maintain single-pass hash map for complement lookup.",
      r: "O(n) time complexity, O(n) auxiliary space.",
    },
  },
  {
    type: "system_design",
    title: "Design a High-Throughput URL Shortener (TinyURL)",
    interviewerText: "How would you design a scalable URL shortening service handling 100M new URLs/month and 10B reads/month with sub-10ms redirect latency?",
    aiResponse: "Architecture: 1) Base62 encoding on 64-bit unique IDs generated via Snowflake ID generator. 2) Read-heavy (100:1) so place Redis cache cluster in front of MongoDB/Postgres. 3) Anycast DNS + Cloudflare CDN edge caching for top 20% hot links.",
    starBreakdown: {
      s: "Scale 10B reads/month (3,800 QPS read, 38 QPS write).",
      t: "Sub-10ms redirect latency with 99.999% availability.",
      a: "Distributed Snowflake IDs + Base62 + Redis Cluster (LRU eviction).",
      r: "Zero collision risk for 3.5 trillion URLs; p99 < 8ms via edge Redis.",
    },
  },
];

export function InteractiveOverlayDemo() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [opacity, setOpacity] = useState(90);
  const [isClickThrough, setIsClickThrough] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"answer" | "star">("answer");

  const currentQ = SAMPLE_QUESTIONS[selectedIdx];

  useEffect(() => {
    setIsTyping(true);
    setDisplayedText("");
    let i = 0;
    const fullText = currentQ.aiResponse;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.slice(0, i + 1));
        i += 3;
      } else {
        setDisplayedText(fullText);
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [selectedIdx]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentQ.aiResponse + (currentQ.codeSnippet ? `\n\n${currentQ.codeSnippet}` : ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="demo" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-parakeet-500/10 border border-parakeet-500/30 text-parakeet-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Experience the <span className="text-parakeet-500">Invisible Overlay</span> in Action
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400">
            Click an interview question scenario below to watch how Parakeet Free Unlimited captures audio, constructs resume-tailored STAR responses, and streams answers instantly.
          </p>
        </div>

        {/* Scenario Selector Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {SAMPLE_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedIdx === idx
                  ? "bg-parakeet-500 text-black font-semibold shadow-glow-green-sm scale-105"
                  : "bg-[#141414] text-neutral-300 hover:bg-[#1f1f1f] border border-white/5"
              }`}
            >
              {q.type === "behavioral" && <Volume2 className="w-4 h-4" />}
              {q.type === "coding" && <Code2 className="w-4 h-4" />}
              {q.type === "system_design" && <Terminal className="w-4 h-4" />}
              <span>{q.title}</span>
            </button>
          ))}
        </div>

        {/* The Mock Desktop Workspace with Video Call & Overlay */}
        <div className="relative rounded-2xl border border-white/10 bg-[#0d0d0d] p-4 sm:p-8 shadow-2xl overflow-hidden">
          {/* Simulated Background: Interview Screen (e.g. Zoom/CoderPad) */}
          <div className="relative rounded-xl border border-white/5 bg-[#121212] overflow-hidden min-h-[460px] flex flex-col md:flex-row">
            {/* Left/Main: Simulated Zoom / Meet Screen */}
            <div className="flex-1 p-6 flex flex-col justify-between relative bg-gradient-to-b from-[#141414] to-[#0c0c0c]">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs text-neutral-400 font-mono ml-2">Zoom Video Call • Technical Screening (Live)</span>
                </div>
                <div className="flex items-center gap-2 bg-neutral-900/90 px-2.5 py-1 rounded text-xs text-neutral-400 border border-white/5">
                  <ShieldAlert className="w-3.5 h-3.5 text-parakeet-400" />
                  <span>Screenshare Active (Protected)</span>
                </div>
              </div>

              {/* Video Mock Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                <div className="aspect-video bg-neutral-900 rounded-lg border border-white/5 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-neutral-300">
                    Interviewer (Principal Eng)
                  </div>
                  <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 font-bold text-xl border border-neutral-700">
                    PE
                  </div>
                  <div className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-parakeet-500/20 border border-parakeet-500/40 text-[10px] text-parakeet-300 font-mono">
                    <Mic className="w-3 h-3 text-parakeet-400 animate-pulse" />
                    <span>Speaking...</span>
                  </div>
                </div>

                <div className="aspect-video bg-neutral-900 rounded-lg border border-white/5 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-neutral-300">
                    You (Candidate)
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-parakeet-600 to-parakeet-400 flex items-center justify-center text-black font-bold text-xl">
                    YOU
                  </div>
                  <div className="absolute bottom-2 left-2 text-[10px] text-neutral-500">
                    Camera On • Overlay hidden from Zoom
                  </div>
                </div>
              </div>

              {/* Bottom call controls */}
              <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-white/5">
                <span>00:18:42</span>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded bg-neutral-800 text-neutral-300">Mute</span>
                  <span className="px-3 py-1 rounded bg-neutral-800 text-neutral-300">Stop Video</span>
                  <span className="px-3 py-1 rounded bg-red-600 text-white font-medium">Leave</span>
                </div>
              </div>
            </div>

            {/* Right: The Floating Parakeet Overlay (Exactly as in Desktop App) */}
            <div
              className="w-full md:w-[420px] bg-[#0a0a0a] border-l md:border-t-0 border-t border-parakeet-500/30 flex flex-col transition-all duration-300 shadow-2xl"
              style={{ opacity: opacity / 100 }}
            >
              {/* Overlay Header / Dragbar */}
              <div className="px-4 py-3 bg-[#111111] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-parakeet-500 animate-pulse" />
                  <span className="text-xs font-bold tracking-wider text-white uppercase font-mono">PARAKEET OVERLAY</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  {/* Opacity control */}
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-neutral-400" />
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="w-16 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-parakeet-500"
                      title="Adjust overlay opacity"
                    />
                    <span className="font-mono text-[10px] text-parakeet-400">{opacity}%</span>
                  </div>
                </div>
              </div>

              {/* Live Audio Transcription Feed */}
              <div className="p-3.5 bg-[#0f0f0f] border-b border-white/5">
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1 font-mono">
                  <span className="flex items-center gap-1 text-parakeet-400">
                    <Zap className="w-3 h-3" /> Groq Whisper v3 (Live):
                  </span>
                  <span className="text-neutral-500">Latency: 142ms</span>
                </div>
                <p className="text-xs text-neutral-300 italic font-sans leading-relaxed">
                  &ldquo;{currentQ.interviewerText}&rdquo;
                </p>
              </div>

              {/* AI Answer Stream Section */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab("answer")}
                      className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors ${
                        activeTab === "answer"
                          ? "bg-parakeet-500/20 text-parakeet-400 border border-parakeet-500/40"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      AI Answer (60 Words)
                    </button>
                    <button
                      onClick={() => setActiveTab("star")}
                      className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors ${
                        activeTab === "star"
                          ? "bg-parakeet-500/20 text-parakeet-400 border border-parakeet-500/40"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      STAR Breakdown
                    </button>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                    title="Copy Answer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-parakeet-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {activeTab === "answer" ? (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-parakeet-300 leading-relaxed bg-parakeet-500/5 p-3 rounded-lg border border-parakeet-500/20 text-glow">
                      {displayedText}
                      {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-parakeet-500 animate-pulse" />}
                    </div>

                    {currentQ.codeSnippet && (
                      <div className="rounded-lg bg-[#050505] p-3 border border-white/10 font-mono text-xs overflow-x-auto text-neutral-300">
                        <div className="text-[10px] text-neutral-500 mb-1 flex items-center justify-between">
                          <span>TypeScript • Optimized O(N)</span>
                          <span className="text-parakeet-400">Gemini 1.5 Flash</span>
                        </div>
                        <pre className="text-parakeet-400">{currentQ.codeSnippet}</pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded bg-neutral-900/90 border border-neutral-800">
                      <span className="font-bold text-parakeet-400 font-mono">S (Situation):</span>{" "}
                      <span className="text-neutral-300">{currentQ.starBreakdown.s}</span>
                    </div>
                    <div className="p-2 rounded bg-neutral-900/90 border border-neutral-800">
                      <span className="font-bold text-parakeet-400 font-mono">T (Task):</span>{" "}
                      <span className="text-neutral-300">{currentQ.starBreakdown.t}</span>
                    </div>
                    <div className="p-2 rounded bg-neutral-900/90 border border-neutral-800">
                      <span className="font-bold text-parakeet-400 font-mono">A (Action):</span>{" "}
                      <span className="text-neutral-300">{currentQ.starBreakdown.a}</span>
                    </div>
                    <div className="p-2 rounded bg-neutral-900/90 border border-neutral-800">
                      <span className="font-bold text-parakeet-400 font-mono">R (Result):</span>{" "}
                      <span className="text-neutral-300">{currentQ.starBreakdown.r}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Overlay Bottom Controls */}
              <div className="p-3 bg-[#111111] border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-parakeet-500/10 text-parakeet-400 font-mono text-[10px] border border-parakeet-500/20">
                    Groq LLaMA 3.3 70B
                  </span>
                  <span className="text-[10px] text-neutral-500">Ctrl+Space</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors">
                    Follow-up
                  </button>
                  <button className="px-2.5 py-1 rounded bg-parakeet-500 hover:bg-parakeet-400 text-black font-semibold text-xs transition-colors">
                    Code Mode
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

