"use client";

import React, { useState } from "react";
import { Download, Monitor, Laptop, Terminal, Sparkles, Check, ArrowRight, ShieldCheck } from "lucide-react";

export function DownloadSection() {
  const [downloadedPlatform, setDownloadedPlatform] = useState<string | null>(null);

  const handleDownload = (platform: string, filename: string) => {
    setDownloadedPlatform(platform);
    // Trigger download of release artifact or show instant launch helper
    setTimeout(() => {
      setDownloadedPlatform(null);
    }, 4000);
  };

  return (
    <section id="download" className="py-24 bg-gradient-to-b from-[#0a0a0a] via-[#0f1511] to-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.08)_0,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-parakeet-500/10 border border-parakeet-500/30 text-parakeet-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Available on All Operating Systems
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Download <span className="text-parakeet-500">Parakeet Free Unlimited</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-300">
            Get the native desktop overlay with anti-screen share protection and BYOK unlimited free AI access.
          </p>
        </div>

        {/* Download Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Windows */}
          <div className="p-8 rounded-2xl bg-[#111111] border border-parakeet-500/30 hover:border-parakeet-500 transition-all duration-300 flex flex-col justify-between shadow-glow-green-sm hover:scale-105">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-parakeet-500/10 border border-parakeet-500/30 flex items-center justify-center mb-6">
                <Monitor className="w-7 h-7 text-parakeet-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Windows</h3>
              <p className="text-xs text-neutral-400 mb-6">Windows 10, 11 (64-bit)</p>
              <ul className="space-y-2.5 text-xs text-neutral-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-parakeet-400" />
                  <span>Direct audio loopback capture</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-parakeet-400" />
                  <span>Hardware-accelerated rendering</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-parakeet-400" />
                  <span>Auto-updates included</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleDownload("Windows", "Parakeet-Setup-1.0.0.exe")}
              className="w-full py-3.5 px-4 rounded-xl bg-parakeet-500 hover:bg-parakeet-400 text-black font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-glow-green-sm"
            >
              <Download className="w-4 h-4" />
              <span>{downloadedPlatform === "Windows" ? "Downloading .exe..." : "Download .exe"}</span>
            </button>
          </div>

          {/* macOS */}
          <div className="p-8 rounded-2xl bg-[#111111] border border-white/10 hover:border-parakeet-500/40 transition-all duration-300 flex flex-col justify-between hover:scale-105">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#181818] border border-white/10 flex items-center justify-center mb-6">
                <Laptop className="w-7 h-7 text-neutral-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">macOS</h3>
              <p className="text-xs text-neutral-400 mb-6">Apple Silicon (M1/M2/M3/M4) & Intel</p>
              <ul className="space-y-2.5 text-xs text-neutral-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-parakeet-400" />
                  <span>Universal Binary (.dmg)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-parakeet-400" />
                  <span>Content protection for Zoom/Meet</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-parakeet-400" />
                  <span>Optimized Metal acceleration</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleDownload("macOS", "Parakeet-1.0.0.dmg")}
              className="w-full py-3.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all border border-white/10"
            >
              <Download className="w-4 h-4 text-parakeet-400" />
              <span>{downloadedPlatform === "macOS" ? "Downloading .dmg..." : "Download .dmg"}</span>
            </button>
          </div>

          {/* Linux */}
          <div className="p-8 rounded-2xl bg-[#111111] border border-white/10 hover:border-parakeet-500/40 transition-all duration-300 flex flex-col justify-between hover:scale-105">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#181818] border border-white/10 flex items-center justify-center mb-6">
                <Terminal className="w-7 h-7 text-neutral-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Linux</h3>
              <p className="text-xs text-neutral-400 mb-6">Ubuntu, Debian, Fedora, Arch</p>
              <ul className="space-y-2.5 text-xs text-neutral-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-parakeet-400" />
                  <span>AppImage & .deb formats</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-parakeet-400" />
                  <span>Wayland & X11 support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-parakeet-400" />
                  <span>PulseAudio & PipeWire capture</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleDownload("Linux", "Parakeet-1.0.0.AppImage")}
              className="w-full py-3.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all border border-white/10"
            >
              <Download className="w-4 h-4 text-parakeet-400" />
              <span>{downloadedPlatform === "Linux" ? "Downloading .AppImage..." : "Download .AppImage"}</span>
            </button>
          </div>
        </div>

        {/* Developer Quick Run Terminal Snippet */}
        <div className="mt-16 max-w-3xl mx-auto p-6 rounded-2xl bg-[#0c0c0c] border border-white/10">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs text-neutral-400 font-mono">
            <span className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-parakeet-400" /> Or run from source via CLI:
            </span>
            <span className="text-parakeet-400">Node.js 18+</span>
          </div>
          <pre className="mt-3 font-mono text-xs sm:text-sm text-neutral-200 overflow-x-auto leading-relaxed">
            <span className="text-neutral-500"># Clone repo & start local development overlay</span><br />
            <span className="text-parakeet-400">git clone</span> https://github.com/parakeet-free/parakeet-free-unlimited.git<br />
            <span className="text-parakeet-400">cd</span> parakeet-free-unlimited<br />
            <span className="text-parakeet-400">npm</span> install<br />
            <span className="text-parakeet-400">npm</span> run electron:dev
          </pre>
        </div>
      </div>
    </section>
  );
}

