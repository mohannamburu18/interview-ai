"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "Is Parakeet Free Unlimited really 100% free forever?",
      answer:
        "Yes. Unlike paid clones that charge $40-$150/month for limited tokens, Parakeet Free Unlimited connects directly to your personal Groq and Google Gemini free-tier developer keys. Groq provides 14,400 requests/day for free, and Google Gemini provides 1,500 free requests/day. You will never be asked for a credit card.",
    },
    {
      question: "Is the desktop overlay truly undetectable on Zoom, Teams, and Google Meet?",
      answer:
        "Yes. Parakeet utilizes native OS window protection (`setContentProtection: true` on Windows and macOS). When you share your desktop or individual windows in Zoom, Microsoft Teams, Google Meet, or Slack, the overlay window is completely excluded from video encoding. Only you see it on your physical screen.",
    },
    {
      question: "How does the AI know my personal background and experience?",
      answer:
        "During onboarding (or anytime in Settings), you can paste your resume and target job description. When the interviewer asks questions, our STAR prompt engine matches your actual achievements, metrics, and technologies rather than giving generic answers.",
    },
    {
      question: "What languages does Parakeet support?",
      answer:
        "Parakeet supports 59 global languages via Groq Whisper Large v3 and Web Speech recognition, including English, Spanish, Mandarin, French, German, Hindi, Japanese, Portuguese, Arabic, and more.",
    },
    {
      question: "Is my interview audio stored in the cloud?",
      answer:
        "No. All transcription processing occurs over direct API calls between your machine and Groq/Gemini. Audio buffers are purged immediately from memory, and any local session notes automatically self-destruct after 24 hours.",
    },
    {
      question: "How do I get the free Groq and Gemini API keys?",
      answer:
        "It takes 30 seconds: Visit console.groq.com/keys for a free Groq key, and aistudio.google.com/app/apikey for a free Google Gemini key. Paste them into the Parakeet settings panel.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-[#0d0d0d] border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-parakeet-500/10 border border-parakeet-500/30 text-parakeet-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            Frequently Asked <span className="text-parakeet-500">Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#121212] border border-white/5 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02]"
                >
                  <span className="font-semibold text-white text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-parakeet-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-neutral-400 leading-relaxed border-t border-white/5">
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

