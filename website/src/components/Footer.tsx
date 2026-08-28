"use client";

import React from "react";
import { Shield, Sparkles, Heart, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#070707] border-t border-white/10 py-12 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          {/* Logo & Tag */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-parakeet-500 flex items-center justify-center text-black font-bold text-base">
              P
            </div>
            <div>
              <span className="text-white font-bold text-sm">Parakeet Free Unlimited</span>
              <p className="text-[11px] text-neutral-500">The 100% Free & Open-Source AI Interview Co-pilot</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 text-neutral-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#platforms" className="hover:text-white transition-colors">Platforms</a>
            <a href="#comparison" className="hover:text-white transition-colors">Pricing Comparison</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="#download" className="hover:text-parakeet-400 transition-colors">Downloads</a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Parakeet Free Unlimited. Open Source MIT License.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Powered by</span>
            <span className="text-neutral-300 font-mono">Groq LLaMA 3.3 & Google Gemini 1.5</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

