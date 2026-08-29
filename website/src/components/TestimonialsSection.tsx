"use client";

import React from "react";
import { Sparkles, Star, Building2, CheckCircle2 } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Senior Java & Distributed Systems Engineer",
    company: "Barclays Preparation",
    role: "L6 Senior Staff Offer ($185k+)",
    quote: "The OOPS 4 pillars and Spring Boot JPA query optimization answers were so natural and conversational. The interviewer specifically complimented my crisp system explanations.",
  },
  {
    name: "Full Stack Engineer",
    company: "FAANG Final Round",
    role: "L5 Software Engineer Offer",
    quote: "The instant Python to Java code switching saved me in the live coding round. I was asked to rewrite my solution in Java on the spot and it switched in 0.01 seconds without lag!",
  },
  {
    name: "Network & Security Specialist",
    company: "Cisco Enterprise Partner",
    role: "Lead Security Architect Offer",
    quote: "It transcribed Cisco TrustSec, SGT, and SGACL concepts with 100% accuracy without confusing them with generic words. Zero hallucinations when the interviewer paused.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#0a0a0d] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Candidate Success</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Trusted by Top Software Engineers
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400">
            Engineers using Interview AI have successfully cleared technical rounds at leading tech giants and investment banks.
          </p>
        </div>

        {/* Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl bg-[#0f0f14] border border-white/5 hover:border-brand-500/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-4 text-brand-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-400" />
                  ))}
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed italic mb-6">
                  &quot;{item.quote}&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="text-sm font-bold text-white">{item.name}</div>
                <div className="text-xs text-neutral-400 mt-0.5 flex items-center justify-between">
                  <span>{item.company}</span>
                  <span className="text-purple-400 font-mono text-[11px] font-semibold">{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
