"use client";

import React from "react";
import { Check, X, Sparkles, Download, Zap } from "lucide-react";

export function PricingComparisonSection() {
  const comparisonItems = [
    {
      feature: "Monthly Subscription Price",
      parakeetFree: "$0 / Forever Free",
      parakeetPaid: "$49 / month",
      competitor: "$149 / month",
      highlight: true,
    },
    {
      feature: "AI Intelligence Provider",
      parakeetFree: "Groq LLaMA 3.3 70B & Gemini 1.5 Flash",
      parakeetPaid: "OpenAI GPT-4o Mini (Rate Limited)",
      competitor: "Proprietary GPT wrapper",
    },
    {
      feature: "Live Transcription Engine",
      parakeetFree: "Groq Whisper Large v3 + Web Speech",
      parakeetPaid: "Whisper Base (10 hrs/mo cap)",
      competitor: "Third-party bot (5 hrs cap)",
    },
    {
      feature: "Usage & Question Limits",
      parakeetFree: "100% UNLIMITED (14,400+ req/day)",
      parakeetPaid: "50 questions / session",
      competitor: "25 questions / session",
      highlight: true,
    },
    {
      feature: "Undetectable Invisible Overlay",
      parakeetFree: "Yes (Native Content Protection)",
      parakeetPaid: "Yes",
      competitor: "Partial (Browser only)",
    },
    {
      feature: "LeetCode & Coding Assistant",
      parakeetFree: "Included (Full Code Mode)",
      parakeetPaid: "$20/mo add-on",
      competitor: "Premium tier only ($199/mo)",
    },
    {
      feature: "Data Privacy & Cloud Storage",
      parakeetFree: "Zero cloud storage (Local 24h Auto-Purge)",
      parakeetPaid: "Stored on cloud servers",
      competitor: "Recorded & retained",
    },
    {
      feature: "Total Annual Cost",
      parakeetFree: "$0.00",
      parakeetPaid: "$588.00 / yr",
      competitor: "$1,788.00 / yr",
      highlight: true,
    },
  ];

  return (
    <section id="comparison" className="py-24 bg-[#0d0d0d] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-parakeet-500/10 border border-parakeet-500/30 text-parakeet-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Why Pay $500+/Year?
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            Parakeet Free vs <span className="text-red-400">Overpriced Competitors</span>
          </h2>
          <p className="mt-4 text-neutral-400 text-base sm:text-lg">
            Commercial interview tools charge hundreds of dollars for what free Groq and Gemini APIs deliver faster, with zero subscriptions and higher token limits.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#121212] shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#171717]">
                <th className="p-5 text-sm font-semibold text-neutral-400">Feature</th>
                <th className="p-5 text-sm font-bold text-parakeet-400 bg-parakeet-500/10 border-x border-parakeet-500/30">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-parakeet-500 animate-pulse" />
                    <span>Parakeet Free Unlimited</span>
                  </div>
                </th>
                <th className="p-5 text-sm font-medium text-neutral-400">Parakeet AI (Paid)</th>
                <th className="p-5 text-sm font-medium text-neutral-400">Final Round AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {comparisonItems.map((item, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-white/[0.02] transition-colors ${
                    item.highlight ? "bg-white/[0.03]" : ""
                  }`}
                >
                  <td className="p-5 font-medium text-neutral-300">
                    {item.feature}
                  </td>
                  <td className="p-5 font-bold text-parakeet-300 bg-parakeet-500/5 border-x border-parakeet-500/20">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-parakeet-400 flex-shrink-0" />
                      <span>{item.parakeetFree}</span>
                    </div>
                  </td>
                  <td className="p-5 text-neutral-400">
                    {item.parakeetPaid}
                  </td>
                  <td className="p-5 text-neutral-500">
                    {item.competitor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-[#141414] via-[#1a2520] to-[#141414] border border-parakeet-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Ready to stop paying $49/mo for interview copilots?</h3>
            <p className="text-sm text-neutral-400 mt-1">Download Parakeet Free Unlimited today. Zero credit cards. Zero token limits.</p>
          </div>
          <a
            href="#download"
            className="px-6 py-3.5 rounded-xl bg-parakeet-500 hover:bg-parakeet-400 text-black font-bold text-sm transition-all duration-200 shadow-glow-green-sm hover:scale-105"
          >
            Download Free Desktop App
          </a>
        </div>
      </div>
    </section>
  );
}

