"use client";

import React, { useState } from "react";
import { Sparkles, MessageSquare, Code2, Copy, Check, Headphones, Shield, Terminal, Keyboard, Volume2 } from "lucide-react";
import { GITHUB_REPO_URL } from "./Navbar";

interface DemoScenario {
  id: string;
  title: string;
  tag: string;
  question: string;
  fragmentsCount: number;
  answerHeader: string;
  keyDetails: Array<{ label: string; text: string }>;
  codeSnippet?: {
    python: string;
    java: string;
  };
  sayThis: string;
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "oops",
    title: "OOPS 4 Pillars",
    tag: "Core Theory",
    question: "What are the four pillars of OOPS?",
    fragmentsCount: 2,
    answerHeader: "OOPS - 4 CORE PILLARS",
    keyDetails: [
      { label: "Encapsulation", text: "Wrapping data (fields) & code (methods) into a single class with private fields & public accessors." },
      { label: "Abstraction", text: "Hiding internal complexities & exposing only essential interfaces & abstract classes." },
      { label: "Inheritance", text: "Allowing child classes to inherit reusable properties & behaviors from parent classes." },
      { label: "Polymorphism", text: "Executing a single method in different forms via method overloading & overriding." },
    ],
    sayThis: "So basically, the four core pillars of Object-Oriented Programming are Encapsulation, Abstraction, Inheritance, and Polymorphism. For example, Encapsulation lets us protect internal data using private fields, while Abstraction allows us to define clean interfaces without exposing messy underlying logic. In my project at Nyeras Edutech, I used Inheritance and Polymorphism with Spring Boot to create reusable base service classes and dynamic event processors across our microservices. This helps us write clean, modular, and maintainable software that can scale smoothly.",
  },
  {
    id: "prime",
    title: "Prime Check Code",
    tag: "Coding / DSA",
    question: "Write a python code for finding a number is prime or not",
    fragmentsCount: 2,
    answerHeader: "PRIME CHECK - CODE & LOGIC",
    keyDetails: [
      { label: "Algorithm", text: "Divisibility verification up to integer square root of n." },
      { label: "Time Complexity", text: "O(sqrt(n)) optimized runtime vs naive O(n)." },
    ],
    codeSnippet: {
      python: `def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

# Example execution
num = 17
print(f"{num} is prime: {is_prime(num)}") # Output: True`,
      java: `public class PrimeCheck {
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        for (int i = 2; i <= Math.sqrt(n); i++) {
            if (n % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        int num = 17;
        System.out.println(num + " is prime: " + isPrime(num));
    }
}`,
    },
    sayThis: "So basically, to check if a number is prime, we want to see if it has any divisors other than 1 and itself. In my solution, I first check if the number is less than or equal to 1, which immediately returns false. Then, instead of checking every single number up to n, we only need to test divisors up to the square root of n. In production code, this optimization cuts our runtime from linear O of N down to O of square root of N, which is super fast and prevents unnecessary CPU load.",
  },
  {
    id: "crud",
    title: "CRUD in SQL",
    tag: "Databases",
    question: "What are CRUD operations in SQL?",
    fragmentsCount: 2,
    answerHeader: "CRUD - DIRECT DEFINITION",
    keyDetails: [
      { label: "Create (C)", text: "INSERT INTO users (id, name, status) VALUES (1, 'Mohan', 'active');" },
      { label: "Read (R)", text: "SELECT * FROM users WHERE status = 'active';" },
      { label: "Update (U)", text: "UPDATE users SET status = 'verified' WHERE id = 1;" },
      { label: "Delete (D)", text: "DELETE FROM users WHERE id = 1;" },
    ],
    sayThis: "So basically, CRUD stands for Create, Read, Update, and Delete, which are the four core operations we do with any database. For example, when a user signs up, we create a record with INSERT, and when they log in or view their profile, we read it with SELECT. In my project at Nyeras Edutech, I used Spring Boot with JPA repositories to handle these CRUD operations for our incident detection service, making sure queries had proper indexing to prevent slow lookups. This helps us manage application data reliably and safely without manual database overhead.",
  },
  {
    id: "trustsec",
    title: "Cisco TrustSec",
    tag: "Security / Networks",
    question: "What is Cisco TrustSec and how does it work?",
    fragmentsCount: 3,
    answerHeader: "CISCO TRUSTSEC - DIRECT DEFINITION",
    keyDetails: [
      { label: "Classification", text: "Ingress switches assign Security Group Tags (SGT) based on 802.1X / ISE identity." },
      { label: "Propagation", text: "Tags transport across fabric via SXP or native Ethernet headers." },
      { label: "Enforcement", text: "Egress switches apply Security Group ACLs (SGACL) to permit or block packets." },
    ],
    sayThis: "So basically, Cisco TrustSec is a smart way to manage network security using identity tags instead of managing thousands of messy IP addresses. For example, when a device connects, Cisco ISE assigns it a Security Group Tag based on who the user is, rather than where they are plugged in. In my work designing secure microservice communications, applying this tag-based model helps enforce Zero Trust policies consistently across different environments. This helps us stop unauthorized lateral movement and keeps access control clean and scalable.",
  },
];

export function InteractiveOverlayDemo() {
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario>(DEMO_SCENARIOS[0]);
  const [activeCodeLang, setActiveCodeLang] = useState<"python" | "java">("python");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAnswer, setCopiedAnswer] = useState(false);

  const handleCopyCode = () => {
    if (!selectedScenario.codeSnippet) return;
    const code = selectedScenario.codeSnippet[activeCodeLang];
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyAnswer = () => {
    navigator.clipboard.writeText(selectedScenario.sayThis);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  return (
    <section id="showcase" className="py-24 relative overflow-hidden bg-[#070707]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-xs font-mono font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            See the Overlay in Action
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400">
            Select a technical interview question below to experience real-time 0-latency transcription, dual-language code caching, and conversational scripts.
          </p>
        </div>

        {/* Question Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8 max-w-3xl mx-auto">
          {DEMO_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => {
                setSelectedScenario(scenario);
                if (scenario.codeSnippet) setActiveCodeLang("python");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                selectedScenario.id === scenario.id
                  ? "bg-[#00ff88] text-black shadow-glow-green-sm scale-[1.02]"
                  : "bg-neutral-900/90 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-white/5"
              }`}
            >
              <span>{scenario.title}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  selectedScenario.id === scenario.id
                    ? "bg-black/20 text-black font-bold"
                    : "bg-neutral-800 text-neutral-400"
                }`}
              >
                {scenario.tag}
              </span>
            </button>
          ))}
        </div>

        {/* HUD Window Simulation */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* HUD Window Title Bar */}
          <div className="bg-[#141414] px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-mono text-neutral-400 ml-2 flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5 text-[#00ff88]" />
                <span>Interview AI Overlay — Dual Loopback Active</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono bg-black/60 px-2.5 py-1 rounded border border-white/10 text-neutral-300">
                <Keyboard className="w-3 h-3 text-[#00ff88]" />
                <span>Manual: <kbd className="text-[#00ff88] font-bold">Ctrl+Enter</kbd></span>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-[#00ff88] bg-[#00ff88]/10 px-2.5 py-1 rounded-full border border-[#00ff88]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                <span>Listening</span>
              </span>
            </div>
          </div>

          {/* Finalized Question Section */}
          <div className="p-4 bg-[#0f0f0f] border-b border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                <span>🎧 Interviewer (Speaker)</span>
                <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-300 border border-white/5">
                  🔗 Merged {selectedScenario.fragmentsCount} fragments
                </span>
              </span>
              <span className="text-[10px] font-mono text-[#00ff88]">Zero Hallucination Filter: Active</span>
            </div>
            <div className="text-sm font-semibold text-white bg-black/50 p-3 rounded-xl border border-white/5 leading-relaxed font-sans">
              &quot;{selectedScenario.question}&quot;
            </div>
          </div>

          {/* AI Refinement & Output Section */}
          <div className="p-5 space-y-4 bg-[#0a0a0a]">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00ff88]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {selectedScenario.answerHeader}
                </span>
              </div>
              <button
                onClick={handleCopyAnswer}
                className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 text-xs flex items-center gap-1.5 transition-colors font-mono"
              >
                {copiedAnswer ? (
                  <>
                    <Check className="w-3 h-3 text-[#00ff88]" />
                    <span className="text-[#00ff88]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Answer</span>
                  </>
                )}
              </button>
            </div>

            {/* Key Technical Bullets */}
            <div className="space-y-2 bg-[#121212] p-3.5 rounded-xl border border-white/5">
              <div className="text-[11px] font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-2">
                Key Operations / Technical Concepts
              </div>
              {selectedScenario.keyDetails.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-neutral-200">
                  <span className="text-[#00ff88] font-bold mt-[-1px]">•</span>
                  <span>
                    <strong className="text-white font-semibold">{detail.label}:</strong> {detail.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Interactive Dual-Language Code Block (if coding question) */}
            {selectedScenario.codeSnippet && (
              <div className="rounded-xl bg-[#141414] border border-[#00ff88]/20 overflow-hidden font-mono shadow-md">
                <div className="bg-[#1a1a1a] px-3.5 py-2 border-b border-white/5 flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[#00ff88] font-bold uppercase tracking-wider mr-1">
                      <Code2 className="w-4 h-4" />
                    </div>
                    {/* Instant 0.01s Switcher Tabs */}
                    <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded-lg border border-white/10">
                      <button
                        onClick={() => setActiveCodeLang("python")}
                        className={`px-3 py-1 rounded text-xs uppercase font-bold transition-all ${
                          activeCodeLang === "python"
                            ? "bg-[#00ff88] text-black shadow-glow-green-sm"
                            : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                        }`}
                      >
                        Python
                      </button>
                      <button
                        onClick={() => setActiveCodeLang("java")}
                        className={`px-3 py-1 rounded text-xs uppercase font-bold transition-all ${
                          activeCodeLang === "java"
                            ? "bg-[#00ff88] text-black shadow-glow-green-sm"
                            : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                        }`}
                      >
                        Java
                      </button>
                    </div>
                    <span className="text-[10px] text-neutral-500 hidden sm:inline">(Instant 0.01s Switch)</span>
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-[#00ff88] flex items-center gap-1.5 transition-colors text-xs"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-[#00ff88]" />
                        <span className="text-[#00ff88]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs text-[#00ff88] leading-relaxed overflow-x-auto selection:bg-neutral-800 font-mono">
                  {selectedScenario.codeSnippet[activeCodeLang]}
                </pre>
              </div>
            )}

            {/* Humanized "SAY THIS" Section */}
            <div className="p-4 rounded-xl bg-[#00ff88]/5 border border-[#00ff88]/30 shadow-glow-green-sm">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-2">
                <MessageSquare className="w-4 h-4 text-[#00ff88]" />
                <span>Say This (Humanized Conversational Script)</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-100 italic leading-relaxed font-sans font-medium">
                &quot;{selectedScenario.sayThis}&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
