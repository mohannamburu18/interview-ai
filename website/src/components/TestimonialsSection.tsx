"use client";

import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatarText: string;
  quote: string;
  offer: string;
}

export function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      name: "Alex Zhang",
      role: "Senior Full Stack Engineer",
      company: "Ex-FAANG",
      avatarText: "AZ",
      quote:
        "The undetectable overlay is literal magic. I shared my screen on Zoom during a live system design interview at Stripe, and the interviewer had no idea. The STAR answers directly pulled examples from my resume.",
      offer: "L6 Offer Accepted ($385k)",
    },
    {
      name: "Sarah Jenkins",
      role: "Engineering Manager",
      company: "Fintech Unicorn",
      avatarText: "SJ",
      quote:
        "I was paying $50/mo for Parakeet paid and kept hitting daily question caps. Switching to this free Groq BYOK version gives me 14,400 requests a day with 0 lag. It's completely unlimited.",
      offer: "Staff EM Offer ($410k)",
    },
    {
      name: "Rohan Patel",
      role: "Cloud DevOps Architect",
      company: "Enterprise Cloud",
      avatarText: "RP",
      quote:
        "Groq Whisper transcription is ridiculously fast. Before the interviewer even finished their question on Kubernetes networking, the answer was already fully formed on my overlay.",
      offer: "Principal Architect Offer",
    },
  ];

  return (
    <section className="py-24 bg-[#0a0a0a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-parakeet-500/10 border border-parakeet-500/30 text-parakeet-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Real Candidate Results
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            Trusted by Engineers Landing <span className="text-parakeet-500">Top-Tier Offers</span>
          </h2>
          <p className="mt-4 text-neutral-400 text-base sm:text-lg">
            See how candidates use Parakeet Free Unlimited to stay calm, articulate, and confident throughout intense hiring pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#111111] border border-white/5 hover:border-parakeet-500/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-4 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400" />
                  ))}
                </div>

                <p className="text-sm text-neutral-300 leading-relaxed italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-parakeet-600 to-parakeet-400 flex items-center justify-center font-bold text-xs text-black">
                    {t.avatarText}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-neutral-500">{t.role}</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-parakeet-400 bg-parakeet-500/10 px-2 py-1 rounded border border-parakeet-500/20">
                  {t.offer}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

