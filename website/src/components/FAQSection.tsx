"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "Is Interview AI really 100% free and open source?",
      answer:
        "Yes! Interview AI is created by Mohan Krishna Namburu as a 100% open-source MIT licensed project. Unlike paid copilots that charge $49-$149/month, Interview AI uses your free-tier Groq API key (14,400 requests/day for free). You will never be asked for a subscription or credit card.",
    },
    {
      question: "How does the Zero Hallucination filter work during silence?",
      answer:
        "Interview AI features a 6-layer defense system. It measures real-time hardware RMS audio amplitude (dropping noise under 0.022), enforces a 1.4-second continuous speech duration gate, uses deterministic Whisper temperature (0.0), and filters out promotional URLs, phantom repetition loops, and filler acknowledgments.",
    },
    {
      question: "How does the Instant Code Switching work without API delays?",
      answer:
        "When a coding question is detected, Interview AI's prompt engine automatically generates both Python and Java (as well as Go, Rust, or SQL) solutions in a single initial API pass and indexes them in frontend RAM. When you click between language tabs, the code updates in 0.01 seconds without making any secondary network calls.",
    },
    {
      question: "Is the overlay undetectable during Zoom, Teams, and Google Meet screen shares?",
      answer:
        "Yes. The Electron desktop application leverages OS window display protection (`setContentProtection(true)`). When you share your screen or application windows during a video call, the overlay is completely excluded from video encoding, remaining visible only on your physical monitor.",
    },
    {
      question: "What is the difference between Manual Mode and Auto Mode?",
      answer:
        "In Manual Mode, Interview AI continuously accumulates everything the interviewer says without cutting off sentences, and only generates an answer when you press Ctrl+Enter. In Auto Mode, it automatically triggers an answer after detecting 3.5 seconds of silence.",
    },
    {
      question: "What programming languages and frameworks does Interview AI support?",
      answer:
        "Interview AI supports all modern languages and architectures, including Java, Spring Boot, Python, TypeScript, React, Go, Rust, C++, SQL, Docker, Kubernetes, AWS, System Design, and Cisco Networking concepts.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-[#08080a] border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono font-semibold mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            Frequently Asked <span className="text-brand-400">Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl bg-[#0e0e14] border transition-all duration-200 overflow-hidden ${
                  isOpen ? "border-brand-500/30 shadow-glow-orange-sm" : "border-white/5 hover:border-white/20"
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02]"
                >
                  <span className="font-semibold text-white text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-purple-400" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-neutral-300 leading-relaxed border-t border-white/5 font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
