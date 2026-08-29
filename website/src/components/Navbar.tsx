"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Github, ArrowRight, Menu, X } from "lucide-react";

export const GITHUB_REPO_URL = "https://github.com/mohannamburu18/interview-ai";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/85 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00ff88]/80 via-[#00ff88] to-emerald-400 p-[1px] shadow-glow-green-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0a0a0a] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#00ff88]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Interview AI{" "}
              <span className="text-[#00ff88] font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20">
                v2.0
              </span>
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
          <a href="#features" className="hover:text-[#00ff88] transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-[#00ff88] transition-colors">
            How It Works
          </a>
          <a href="#showcase" className="hover:text-[#00ff88] transition-colors">
            Showcase
          </a>
          <a href="#comparison" className="hover:text-[#00ff88] transition-colors">
            Compare
          </a>
          <a href="#tech-stack" className="hover:text-[#00ff88] transition-colors">
            Tech Stack
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-white/10 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Github className="w-4 h-4 text-white" />
            <span>GitHub</span>
          </a>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#00ff88] hover:bg-[#00e67a] text-black font-bold text-xs transition-all duration-200 shadow-glow-green-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e0e0e] border-b border-white/10 px-6 py-6 space-y-4">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-neutral-300 hover:text-[#00ff88] font-medium"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-neutral-300 hover:text-[#00ff88] font-medium"
          >
            How It Works
          </a>
          <a
            href="#showcase"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-neutral-300 hover:text-[#00ff88] font-medium"
          >
            Showcase
          </a>
          <a
            href="#comparison"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-neutral-300 hover:text-[#00ff88] font-medium"
          >
            Compare
          </a>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-neutral-900 text-white font-semibold text-sm border border-white/10"
            >
              <Github className="w-4 h-4" />
              <span>View on GitHub</span>
            </a>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#00ff88] text-black font-bold text-sm shadow-glow-green-sm"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
