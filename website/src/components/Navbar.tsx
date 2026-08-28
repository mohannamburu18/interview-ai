"use client";

import React, { useState, useEffect } from "react";
import { Download, Sparkles, Shield, Cpu, ExternalLink, Menu, X } from "lucide-react";

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-parakeet-600 via-parakeet-500 to-parakeet-400 p-[1px] shadow-glow-green-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0a0a0a] rounded-[11px] flex items-center justify-center">
              {/* Parakeet Bird Icon */}
              <svg className="w-6 h-6 text-parakeet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 7h.01" />
                <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 18" />
                <path d="m20 7 2 .5-2 .5" />
                <path d="M10 18v3" />
                <path d="M14 17.75V21" />
                <path d="M7 18a6 6 0 0 0 3.84-10.61" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              Parakeet <span className="text-parakeet-500 font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-parakeet-500/10 border border-parakeet-500/20">FREE UNLIMITED</span>
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
          <a href="#demo" className="hover:text-parakeet-400 transition-colors">Live Demo</a>
          <a href="#how-it-works" className="hover:text-parakeet-400 transition-colors">How it Works</a>
          <a href="#platforms" className="hover:text-parakeet-400 transition-colors">Platforms</a>
          <a href="#features" className="hover:text-parakeet-400 transition-colors">Features</a>
          <a href="#comparison" className="hover:text-parakeet-400 transition-colors">Compare vs Paid</a>
          <a href="#faq" className="hover:text-parakeet-400 transition-colors">FAQ</a>
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-neutral-800">
            <span className="w-2 h-2 rounded-full bg-parakeet-500 animate-ping" />
            <span>100% Free Forever</span>
          </div>
          <a
            href="#download"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-parakeet-500 hover:bg-parakeet-400 text-black font-semibold text-sm transition-all duration-200 shadow-glow-green-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>Download Desktop App</span>
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
            href="#demo"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-neutral-300 hover:text-parakeet-400 font-medium"
          >
            Live Demo
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-neutral-300 hover:text-parakeet-400 font-medium"
          >
            How it Works
          </a>
          <a
            href="#platforms"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-neutral-300 hover:text-parakeet-400 font-medium"
          >
            Platforms
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-neutral-300 hover:text-parakeet-400 font-medium"
          >
            Features
          </a>
          <a
            href="#comparison"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-neutral-300 hover:text-parakeet-400 font-medium"
          >
            Compare vs Paid
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-neutral-300 hover:text-parakeet-400 font-medium"
          >
            FAQ
          </a>
          <div className="pt-2">
            <a
              href="#download"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-parakeet-500 text-black font-bold text-sm shadow-glow-green-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Desktop App</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

