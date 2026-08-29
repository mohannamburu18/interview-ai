"use client";

import React from "react";
import { Github, Sparkles, Heart } from "lucide-react";
import { GITHUB_REPO_URL } from "./Navbar";

export function Footer() {
  return (
    <footer className="bg-[#050508] border-t border-white/10 py-12 text-xs text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">Interview AI</span>
              <span className="text-neutral-500 ml-2">— Real-Time Technical Interview Co-Pilot</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center gap-6 font-medium text-neutral-300">
            <a href="#features" className="hover:text-brand-400 transition-colors">
              Features
            </a>
            <a href="#architecture" className="hover:text-purple-400 transition-colors">
              Architecture
            </a>
            <a href="#showcase" className="hover:text-brand-400 transition-colors">
              Showcase
            </a>
            <a href="#comparison" className="hover:text-purple-400 transition-colors">
              Comparison
            </a>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-400 transition-colors flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>

          {/* Copyright & Author */}
          <div className="text-center md:text-right">
            <p className="text-neutral-400">
              Built with <Heart className="w-3 h-3 inline text-red-500 mx-0.5" /> by{" "}
              <a
                href="https://github.com/mohannamburu18"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-brand-400 font-semibold transition-colors"
              >
                Mohan Krishna Namburu
              </a>{" "}
              — Open Source
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">
              Released under the MIT License • 100% Free Forever
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
