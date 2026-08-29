"use client";

import React, { useState } from "react";
import { Sparkles, MessageSquare, Code2, Copy, Check, Headphones, Shield, Terminal, Keyboard, Volume2, Globe } from "lucide-react";
import { GITHUB_REPO_URL } from "./Navbar";

interface DemoScenario {
  id: string;
  title: string;
  language: string;
  tag: string;
  question: string;
  fragmentsCount: number;
  answerHeader: string;
  keyDetails: Array<{ label: string; text: string }>;
  codeSnippet?: {
    primary: string;
    secondary: string;
    primaryLang: string;
    secondaryLang: string;
  };
  sayThis: string;
}

const UNIVERSAL_SCENARIOS: DemoScenario[] = [
  {
    id: "polyglot-dsa",
    title: "Algorithm / LeetCode",
    language: "Python ⇄ Java",
    tag: "Works with All Languages",
    question: "Write an optimal solution to find if a number is prime and explain its complexity",
    fragmentsCount: 2,
    answerHeader: "PRIME NUMBER VALIDATION - DUAL LANGUAGE MATRIX",
    keyDetails: [
      { label: "Optimal Bounds", text: "Test divisors strictly up to integer square root of n (sqrt(n))." },
      { label: "Complexity", text: "Time: O(sqrt(n)), Space: O(1) auxiliary auxiliary memory." },
    ],
    codeSnippet: {
      primaryLang: "Python",
      secondaryLang: "Java",
      primary: `def is_prime(n: int) -> bool:
    if n <= 1:
        return False
    # Check divisors up to square root of n
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

# Example execution
print(is_prime(17)) # Returns: True`,
      secondary: `public class Solution {
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        for (int i = 2; i <= Math.sqrt(n); i++) {
            if (n % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPrime(17)); // Returns: true
    }
}`,
    },
    sayThis: "So basically, to check if a number is prime, we verify whether it has any divisors other than 1 and itself. In my implementation, I first handle boundary conditions by returning false for numbers less than or equal to 1. Then, rather than iterating through all numbers up to n, we optimize the loop to check divisibility only up to the square root of n. In production systems, this cuts the time complexity from linear down to O of square root of N, minimizing CPU cycles under high-throughput request validation.",
  },
  {
    id: "system-design",
    title: "System Design & Architecture",
    language: "Distributed Systems",
    tag: "Works with All Frameworks",
    question: "How do you handle distributed transactions across microservices without two-phase commit bottlenecks?",
    fragmentsCount: 3,
    answerHeader: "SAGA PATTERN & EVENTUAL CONSISTENCY",
    keyDetails: [
      { label: "Orchestrated Saga", text: "Central orchestrator coordinates local transactions & publishes compensatory events on failure." },
      { label: "Choreographed Saga", text: "Decentralized event publishing via Kafka/RabbitMQ with idempotent subscriber consumers." },
      { label: "Idempotency", text: "Deduplication keys stored in Redis ensure transactions never double-process." },
    ],
    codeSnippet: {
      primaryLang: "Go",
      secondaryLang: "TypeScript",
      primary: `// Go Event Sourcing & Saga Dispatcher
func (s *OrderSagaOrchestrator) ProcessOrder(ctx context.Context, order Order) error {
    if err := s.paymentClient.Authorize(ctx, order.Amount); err != nil {
        return s.compensateOrder(ctx, order.ID)
    }
    return s.inventoryClient.ReserveStock(ctx, order.Items)
}`,
      secondary: `// TypeScript / Node.js Saga State Machine
async function handleOrderSaga(order: OrderPayload): Promise<void> {
  try {
    await paymentService.authorize(order.amount);
    await inventoryService.reserveItems(order.items);
  } catch (error) {
    await orderSaga.executeCompensations(order.id);
  }
}`,
    },
    sayThis: "So basically, when handling distributed transactions across microservices, we use the Saga pattern instead of blocking two-phase commits. For example, when an order is placed, each service executes its own local database transaction and emits an event. In my project at Nyeras Edutech, I implemented an orchestrated Saga using Spring Boot and Apache Kafka to coordinate order processing and MTTD tracking with automated compensating transactions on failure. This helps us ensure eventual consistency and high availability without distributed deadlocks.",
  },
  {
    id: "fullstack-api",
    title: "SQL & Backend Persistence",
    language: "SQL / Spring Boot",
    tag: "Works with All Databases",
    question: "What are CRUD operations in SQL and how do you optimize them in high-concurrency applications?",
    fragmentsCount: 2,
    answerHeader: "CRUD LIFECYCLE & DATABASE OPTIMIZATION",
    keyDetails: [
      { label: "CRUD Operations", text: "Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE)." },
      { label: "Indexing Strategy", text: "Composite B-Tree indexes on high-cardinality filter columns to eliminate full table scans." },
      { label: "Connection Pooling", text: "HikariCP connection pool tuning to minimize connection handshake latency." },
    ],
    codeSnippet: {
      primaryLang: "SQL",
      secondaryLang: "Java JPA",
      primary: `-- Optimized SQL CRUD Query with Composite Indexing
SELECT u.id, u.email, u.status 
FROM users u 
WHERE u.tenant_id = 42 AND u.status = 'active'
ORDER BY u.created_at DESC 
LIMIT 20;`,
      secondary: `// Spring Data JPA Repository with Index Hinting
@Query("SELECT u FROM User u WHERE u.tenantId = :tenantId AND u.status = 'ACTIVE'")
Page<User> findActiveUsersByTenant(
    @Param("tenantId") Long tenantId, 
    Pageable pageable
);`,
    },
    sayThis: "So basically, CRUD stands for Create, Read, Update, and Delete, which are the foundational operations in any relational database. For example, when a user registers, we issue an INSERT statement, and when retrieving their profile, we execute an indexed SELECT query. In my work at Nyeras Edutech, I used Spring Boot with MySQL and indexed foreign keys to streamline incident queries and reduce lookup latency. This helps us guarantee low latency and transactional safety across production microservices.",
  },
  {
    id: "core-oop",
    title: "Object-Oriented Design (OOPS)",
    language: "Java / C++ / Rust",
    tag: "Works with All Paradigms",
    question: "Explain the four pillars of OOPS and how they enforce maintainability in enterprise software",
    fragmentsCount: 2,
    answerHeader: "OOPS - 4 CORE PILLARS & ARCHITECTURE",
    keyDetails: [
      { label: "Encapsulation", text: "Wrapping state & methods within classes; private fields accessed via controlled getters/setters." },
      { label: "Abstraction", text: "Exposing high-level contracts (interfaces) while encapsulating implementation complexities." },
      { label: "Inheritance", text: "Code reusability and hierarchical class extension via superclass relationships." },
      { label: "Polymorphism", text: "Dynamic method dispatch via overloading (compile-time) and overriding (runtime)." },
    ],
    sayThis: "So basically, the four core pillars of Object-Oriented Programming are Encapsulation, Abstraction, Inheritance, and Polymorphism. For example, Encapsulation lets us safeguard internal object state, while Abstraction allows us to design clean interfaces without exposing complicated underlying mechanisms. In my project at Nyeras Edutech, I used Inheritance and Polymorphism in Java 17 and Spring Boot to create reusable base service abstractions and dynamic telemetry handlers. This helps us build decoupled, maintainable software that scales easily across distributed teams.",
  },
];

export function InteractiveOverlayDemo() {
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario>(UNIVERSAL_SCENARIOS[0]);
  const [activeCodeLang, setActiveCodeLang] = useState<"primary" | "secondary">("primary");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAnswer, setCopiedAnswer] = useState(false);

  const handleCopyCode = () => {
    if (!selectedScenario.codeSnippet) return;
    const code = activeCodeLang === "primary" ? selectedScenario.codeSnippet.primary : selectedScenario.codeSnippet.secondary;
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
    <section id="showcase" className="py-24 relative overflow-hidden bg-[#0a0a0d] border-t border-white/5">
      {/* Background Amber Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brand-500/10 blur-[150px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono font-semibold mb-4">
            <Globe className="w-3.5 h-3.5" />
            <span>Universal Domain Support</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            See the Overlay in Action
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-300">
            Works across all programming languages, frameworks, system design patterns, and engineering domains. Experience instant transcription and 0-latency dual-language caching.
          </p>
        </div>

        {/* Universal Scenario Selectors */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8 max-w-4xl mx-auto">
          {UNIVERSAL_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => {
                setSelectedScenario(scenario);
                setActiveCodeLang("primary");
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                selectedScenario.id === scenario.id
                  ? "bg-gradient-to-r from-brand-500 to-brand-600 text-black shadow-glow-orange-sm scale-[1.02]"
                  : "bg-[#111118] text-neutral-400 hover:text-white hover:bg-[#181822] border border-white/5"
              }`}
            >
              <span>{scenario.title}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                  selectedScenario.id === scenario.id
                    ? "bg-black/20 text-black font-bold"
                    : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                }`}
              >
                {scenario.language}
              </span>
            </button>
          ))}
        </div>

        {/* HUD Window Simulation */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#0c0c12] border border-brand-500/20 shadow-glow-hybrid overflow-hidden backdrop-blur-xl">
          {/* HUD Window Title Bar */}
          <div className="bg-[#12121c] px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-mono text-neutral-400 ml-2 flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5 text-brand-400" />
                <span>Interview AI Overlay — Universal Language Stream</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono bg-black/60 px-2.5 py-1 rounded border border-white/10 text-neutral-300">
                <Keyboard className="w-3 h-3 text-brand-400" />
                <span>Manual: <kbd className="text-brand-400 font-bold">Ctrl+Enter</kbd></span>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                <span>Active</span>
              </span>
            </div>
          </div>

          {/* Finalized Question Section */}
          <div className="p-4 bg-[#0f0f18] border-b border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                <span>🎧 Interviewer (Speaker)</span>
                <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-300 border border-white/5">
                  🔗 Merged {selectedScenario.fragmentsCount} fragments
                </span>
              </span>
              <span className="text-[10px] font-mono text-purple-400">Deterministic Whisper v3</span>
            </div>
            <div className="text-sm font-semibold text-white bg-black/50 p-3 rounded-xl border border-white/5 leading-relaxed font-sans">
              &quot;{selectedScenario.question}&quot;
            </div>
          </div>

          {/* AI Refinement & Output Section */}
          <div className="p-5 space-y-4 bg-[#08080c]">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
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
                    <Check className="w-3 h-3 text-brand-400" />
                    <span className="text-brand-400">Copied</span>
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
            <div className="space-y-2 bg-[#101018] p-3.5 rounded-xl border border-white/5">
              <div className="text-[11px] font-mono font-bold text-brand-400 uppercase tracking-wider mb-2">
                Key Operations & Architecture Points
              </div>
              {selectedScenario.keyDetails.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-neutral-200">
                  <span className="text-brand-400 font-bold mt-[-1px]">•</span>
                  <span>
                    <strong className="text-white font-semibold">{detail.label}:</strong> {detail.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Interactive Dual-Language Code Block */}
            {selectedScenario.codeSnippet && (
              <div className="rounded-xl bg-[#101018] border border-brand-500/20 overflow-hidden font-mono shadow-md">
                <div className="bg-[#151522] px-3.5 py-2 border-b border-white/5 flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-brand-400 font-bold uppercase tracking-wider mr-1">
                      <Code2 className="w-4 h-4" />
                    </div>
                    {/* Instant 0.01s Switcher Tabs */}
                    <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded-lg border border-white/10">
                      <button
                        onClick={() => setActiveCodeLang("primary")}
                        className={`px-3 py-1 rounded text-xs uppercase font-bold transition-all ${
                          activeCodeLang === "primary"
                            ? "bg-brand-500 text-black shadow-glow-orange-sm"
                            : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                        }`}
                      >
                        {selectedScenario.codeSnippet.primaryLang}
                      </button>
                      <button
                        onClick={() => setActiveCodeLang("secondary")}
                        className={`px-3 py-1 rounded text-xs uppercase font-bold transition-all ${
                          activeCodeLang === "secondary"
                            ? "bg-purple-500 text-white shadow-glow-purple-sm"
                            : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                        }`}
                      >
                        {selectedScenario.codeSnippet.secondaryLang}
                      </button>
                    </div>
                    <span className="text-[10px] text-neutral-500 hidden sm:inline">(Instant 0.01s Switch)</span>
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-brand-400 flex items-center gap-1.5 transition-colors text-xs"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-brand-400" />
                        <span className="text-brand-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs text-brand-300 leading-relaxed overflow-x-auto selection:bg-neutral-800 font-mono">
                  {activeCodeLang === "primary" ? selectedScenario.codeSnippet.primary : selectedScenario.codeSnippet.secondary}
                </pre>
              </div>
            )}

            {/* Humanized "SAY THIS" Section */}
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/30 shadow-glow-purple-sm">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-wider mb-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
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
