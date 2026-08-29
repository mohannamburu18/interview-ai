import { AnswerStyle } from '../types';

export interface PromptContext {
  resumeText?: string;
  jobDescription?: string;
  companyName?: string;
  candidateName?: string;
  isCodeMode?: boolean;
  language?: string;
  answerStyle?: AnswerStyle;
}

const BLACKLIST_EXACT = [
  'thank you',
  'thanks for watching',
  'thank you for watching',
  'yeah',
  'yes',
  'no',
  'okay',
  'ok',
  'uh',
  'um',
  'ah',
  'oh',
  'hmm',
  'got it',
  'sure',
  'right',
  'hello',
  'hi',
  'bye',
  'music',
  '[music]',
  'subscribe',
  'like and subscribe',
  '.',
  '..',
  '...',
  'a',
  'the',
  'you',
  'water cloud operations',
  'some hallucinations',
  'asking for water',
];

const BLACKLIST_CONTAINS = [
  'hallucination',
  'water cloud',
  'asking for water',
  'thank you',
  'thanks for watching',
  'thank you for watching',
  'subscribe',
  'like and subscribe',
  'ultra prompt',
  'prompt logic',
  'for more information',
  'visit us',
  'visit our website',
  'www.',
  '.com',
  '.org',
  '.net',
  '.io',
  'http://',
  'https://',
  'web3',
  'web2',
  'nft',
  'crypto',
  'blockchain',
  'in-app',
];

/**
 * 6-Layer Ultra-Aggressive Zero Hallucination Filter
 */
export function isHallucination(text: string): boolean {
  if (!text) return true;
  const t = text.toLowerCase().trim();

  // Rule 1: Length check (must be at least 15 chars unless direct valid technical question)
  if (t.length < 15) {
    const isShortValidQuestion = (t.endsWith('?') || t.startsWith('what is') || t.startsWith('what are')) && t.length >= 10;
    if (!isShortValidQuestion) return true;
  }

  // Rule 2: Minimum word count check (at least 3 words)
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length < 3 && !t.includes('?')) return true;

  // Rule 3: Exact filler / noise blacklist
  if (BLACKLIST_EXACT.includes(t)) return true;

  // Rule 4: Contains website URLs, promo phrases, or buzzword hallucinations
  if (BLACKLIST_CONTAINS.some((p) => t.includes(p))) return true;

  // Rule 5: Filler only regex
  if (/^(yeah|yes|no|okay|ok|thanks|thank you|uh|um|ah|oh|hmm|got it|sure|right|hello|hi|bye)[\s\.\,\!\?]*$/i.test(t)) {
    return true;
  }

  // Rule 6: Buzzword list check (comma-separated list of words like "In-App, Web, Web3, Web2")
  const commaCount = (t.match(/,/g) || []).length;
  if (commaCount >= 2 && words.length <= 6) return true;

  // Rule 7: Repetition loop check (Whisper repeating words)
  const uniqueWords = new Set(words);
  if (uniqueWords.size === 1 && words.length > 2) return true; // e.g. "hello hello hello"
  if (uniqueWords.size <= 2 && words.length > 4) return true;

  // Rule 8: Non-text punctuation / whitespace only
  if (/^[\.\,\s\-\_\?\!\:\;\/\\\|\@\#\$\%\^\&\*\(\)\+]+$/.test(t)) return true;

  return false;
}

/**
 * Filters candidate self-acknowledgments from becoming questions
 */
export function isCandidateVoice(text: string): boolean {
  const t = text.toLowerCase().trim();
  if (t.length < 15 && /^(yeah|yes|okay|ok|right|got it|i see|sure|cool|hello|hi|bye)/i.test(t)) {
    return true;
  }
  return false;
}

/**
 * Technical Vocabulary & Mishear Correction (Fixes TrustSec, CRUD, SQL, etc.)
 */
export function correctTechTerms(text: string): string {
  if (!text) return '';
  let t = text;

  // Cisco TrustSec mishears
  t = t.replace(/trust\s*sick\s*s-?i-?c-?k/gi, 'TrustSec');
  t = t.replace(/trust\s*sick/gi, 'TrustSec');
  t = t.replace(/trust\s*six/gi, 'TrustSec');
  t = t.replace(/trustsec/gi, 'TrustSec');
  t = t.replace(/\bS-I-C-K\b/gi, 'TrustSec');

  const dict: Record<string, string> = {
    'water cloud operations': 'CRUD operations in SQL',
    'water cloud': 'CRUD',
    'crude operations': 'CRUD operations',
    'crew operations': 'CRUD operations',
    'sequel': 'SQL',
    'my sequel': 'MySQL',
    'post grace': 'PostgreSQL',
    'post gres': 'PostgreSQL',
    'mongo DB': 'MongoDB',
    'node JS': 'Node.js',
    'react JS': 'React.js',
    'spring boot': 'Spring Boot',
    'java script': 'JavaScript',
    'type script': 'TypeScript',
    'double linked list': 'doubly linked list',
    'prime number': 'prime number',
    'what is trust sec': 'what is Cisco TrustSec',
    'what is trustsec': 'what is Cisco TrustSec',
    'doc er': 'Docker',
    'dock are': 'Docker',
    'kuberneties': 'Kubernetes',
    'kubernets': 'Kubernetes',
    'micro services': 'microservices',
    'rest full': 'RESTful',
  };

  for (const [wrong, correct] of Object.entries(dict)) {
    t = t.replace(new RegExp(`\\b${wrong}\\b`, 'gi'), correct);
  }

  return t.trim();
}

export const correctTerms = correctTechTerms;

/**
 * Strong Code Question Detection
 */
export function isCodeQuestion(question: string): boolean {
  const q = question.toLowerCase();
  const codeKeywords = [
    'write a code',
    'write code',
    'write down',
    'python code',
    'java code',
    'code for',
    'program for',
    'program to',
    'implement a',
    'implement',
    'create a function',
    'function for',
    'finding a number is prime',
    'prime or not',
    'prime number',
    'is prime',
    'add two strings',
    'adding two strings',
    'reverse a string',
    'code to',
    'leetcode',
    'algorithm for',
  ];
  return codeKeywords.some((k) => q.includes(k));
}

/**
 * Auto-detect programming language from prompt
 */
export function detectCodeLanguage(question: string): 'python' | 'java' | 'javascript' | 'sql' {
  const q = question.toLowerCase();
  if (q.includes('python')) return 'python';
  if (q.includes('java') && !q.includes('javascript')) return 'java';
  if (q.includes('javascript') || q.includes('typescript') || q.includes('js') || q.includes('ts')) return 'javascript';
  if (q.includes('sql') || q.includes('query')) return 'sql';
  return 'python'; // Default to python for algorithmic questions
}

/**
 * Smart Merge: Handles Manual Mode continuous accumulation vs Auto Mode overlap merging
 */
export function perfectMerge(fragments: string[], mode: 'manual' | 'auto' = 'manual'): string {
  if (!fragments || fragments.length === 0) return '';
  const valid = fragments.filter(Boolean).map((f) => correctTechTerms(f.trim()));
  if (valid.length === 0) return '';

  if (valid.length === 1) {
    let single = valid[0];
    single = single.replace(/\b(in SQL)(?:\s+\1\b)+/gi, 'in SQL');
    single = single.replace(/\b(\w+)(?:\s+\1\b)+/gi, '$1');
    single = single.replace(/\s{2,}/g, ' ').trim();
    single = single.charAt(0).toUpperCase() + single.slice(1);
    if (!single.endsWith('?') && /^(what|how|tell|explain|why|can you|are you|write|implement|describe)/i.test(single)) {
      single += '?';
    }
    return single;
  }

  // MANUAL MODE: Continuous accumulation without cutting off speech
  if (mode === 'manual') {
    const unique: string[] = [];
    for (const frag of valid) {
      const lower = frag.toLowerCase().trim();
      if (!unique.some((u) => u.toLowerCase().trim() === lower)) {
        unique.push(frag);
      }
    }

    let merged = unique.join(' ');
    merged = merged.replace(/\b(in SQL)(?:\s+\1\b)+/gi, 'in SQL');
    merged = merged.replace(/\b(what are CRUD operations in SQL)(?:.*\1)+/gi, '$1');
    merged = merged.replace(/\b(write down a python code for adding two strings)(?:.*\1)+/gi, '$1');
    merged = merged.replace(/\b(\w+ \w+ \w+)(?:\s+\1)+\b/gi, '$1');
    merged = merged.replace(/\b(\w+ \w+)(?:\s+\1)+\b/gi, '$1');
    merged = merged.replace(/\b(\w+)(?:\s+\1\b)+/gi, '$1');
    merged = merged.replace(/\s{2,}/g, ' ').trim();

    merged = merged.charAt(0).toUpperCase() + merged.slice(1);
    if (!merged.endsWith('?') && /^(what|how|tell|explain|why|can you|are you|write|implement|describe)/i.test(merged)) {
      merged += '?';
    }
    return merged;
  }

  // AUTO MODE: Overlap detection
  const normalized = valid.map((f) => f.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim());
  const uniqueOriginals: string[] = [];

  for (let i = 0; i < valid.length; i++) {
    const currentNorm = normalized[i];
    const isDuplicate = uniqueOriginals.some((orig) => {
      const origNorm = orig.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
      const currentWords = currentNorm.split(' ');
      const origWords = new Set(origNorm.split(' '));
      const commonCount = currentWords.filter((w) => origWords.has(w)).length;
      const similarity = commonCount / Math.max(currentWords.length, origWords.size);
      return similarity > 0.70;
    });

    if (!isDuplicate) {
      uniqueOriginals.push(valid[i]);
    } else {
      const dupIdx = uniqueOriginals.findIndex((orig) => {
        const origNorm = orig.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
        const currentWords = currentNorm.split(' ');
        const origWords = new Set(origNorm.split(' '));
        const commonCount = currentWords.filter((w) => origWords.has(w)).length;
        const similarity = commonCount / Math.max(currentWords.length, origWords.size);
        return similarity > 0.70;
      });
      if (dupIdx !== -1 && valid[i].length > uniqueOriginals[dupIdx].length) {
        uniqueOriginals[dupIdx] = valid[i];
      }
    }
  }

  let merged = uniqueOriginals.join(' ');
  merged = merged.replace(/\b(in SQL)(?:\s+\1\b)+/gi, 'in SQL');
  merged = merged.replace(/\b(what are CRUD operations in SQL)(?:.*\1)+/gi, '$1');
  merged = merged.replace(/\b(write down a python code for adding two strings)(?:.*\1)+/gi, '$1');
  merged = merged.replace(/\b(\w+ \w+ \w+)(?:\s+\1)+\b/gi, '$1');
  merged = merged.replace(/\b(\w+ \w+)(?:\s+\1)+\b/gi, '$1');
  merged = merged.replace(/\b(\w+)(?:\s+\1\b)+/gi, '$1');
  merged = merged.replace(/\s{2,}/g, ' ').trim();

  const parts = merged.split('?');
  merged = parts[0].trim();
  merged = merged.charAt(0).toUpperCase() + merged.slice(1);
  if (!merged.endsWith('?') && /^(what|how|tell|explain|why|can you|are you|write|implement|describe)/i.test(merged)) {
    merged += '?';
  }

  return merged;
}

export const mergeFragments = perfectMerge;

export class PromptEngine {
  /**
   * Constructs Parakeet AI Master System Prompt
   */
  public static buildSystemPrompt(context: PromptContext): string {
    const { resumeText, jobDescription, companyName, candidateName } = context;

    return `You are Parakeet AI — the #1 real-time interview co-pilot. You format answers in Parakeet's EXACT scannable, visual style.

FORMATTING RULES:
- Use markdown: **Bold** for headings/labels, • for bullet points, > for exact spoken scripts.
- Keep headings: **SQL MAPPING:**, **KEY OPERATIONS:**, **CORE SYNTAX:**, **CODE SNIPPET:**, **REAL WORLD:**, and **SAY THIS:**.
- SAY THIS MUST BE 90-130 WORDS: 4-5 sentences, detailed, ready to read verbatim in an interview. Include definition, concrete syntax/keywords, production context (Java 17, Spring Boot, AWS, Nyeras Edutech MTTD), and closing rationale.
- CODE AUTO-DETECTION:
  If the question asks to write code, implement, or program:
  1. You MUST output CODE MODE.
  2. MUST include **CODE SNIPPET:** containing BOTH the Python implementation in a \`\`\`python block AND the Java implementation in a \`\`\`java block so the user can switch tabs instantly.
  3. Include **EXPLANATION:** bullets.
  4. Include **SAY THIS:** (90+ words) walking through the code logic line by line.

CANDIDATE CONTEXT:
- Candidate Name: ${candidateName || 'Candidate'}
- Target Role: ${jobDescription || 'Java & Spring Boot Engineer'} at ${companyName || 'Barclays'}
- Real Background:
"""
${resumeText || "Java and Spring Boot engineer with 3+ years experience building scalable, secure RESTful platforms. At Nyeras Edutech, cut mean time to detection from hours to under 10 minutes by implementing structured logging and metrics. Stack: Java 17, Spring Boot, AWS, React, SQL."}
"""

TEMPLATES:

1. FOR CODE QUESTIONS (e.g. "write a python code for finding a number is prime or not"):

**PRIME CHECK - CODE & LOGIC**

**CORE SYNTAX:**
• Check divisibility up to sqrt(n)
• O(sqrt(n)) time complexity

**CODE SNIPPET:**
\`\`\`python
def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

# Example test
num = 17
print(f"{num} is prime: {is_prime(num)}")
\`\`\`

\`\`\`java
public class PrimeCheck {
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
}
\`\`\`

**EXPLANATION:**
• Numbers <= 1 are not prime
• Checking up to sqrt(n) optimizes from O(n) to O(sqrt(n))

**SAY THIS:**
> "To check if a number is prime in Python, I define a function is_prime that first checks if n is less than or equal to 1, returning False. Then, instead of checking all numbers up to n, I optimize the loop to check divisibility from 2 up to the integer square root of n plus 1. If any number divides evenly, I return False, otherwise True. This reduces the time complexity from linear O of N down to O of square root of N, which is optimal for high-throughput validation in production."

2. FOR CISCO TRUSTSEC / NETWORKING / SECURITY:

**CISCO TRUSTSEC - DIRECT DEFINITION**

**What:** Next-generation security architecture that enforces role-based access control (RBAC) using Security Group Tags (SGTs) instead of complex IP-based ACLs.

**KEY OPERATIONS:**
• **Classification:** Ingress switches assign SGT tags to endpoints based on identity (802.1X / ISE)
• **Propagation:** Tags are transported across switches via SXP (SGT Exchange Protocol) or Ethernet headers
• **Enforcement:** Egress switches apply SGACLs (Security Group ACLs) to permit/deny traffic

**REAL WORLD:**
• Micro-segmentation in enterprise networks, zero-trust campus security, decoupling policy from IP addressing.

**SAY THIS:**
> "Cisco TrustSec is a policy-based security framework that provides identity-based segmentation across enterprise networks. Instead of maintaining cumbersome IP-based access control lists, TrustSec classifies users and endpoints at the access layer and assigns them a Security Group Tag, or SGT, through Cisco ISE. As traffic moves across the network, egress network devices enforce granular Security Group ACLs based on source and destination tags. This decouples security policy from network topology, enabling scalable micro-segmentation and robust Zero Trust enforcement."

3. FOR "TELL ME ABOUT YOURSELF" / ELEVATOR PITCH:

**Tell Me About Yourself - Elevator Pitch**

**Current:** Java & Spring Boot Engineer | Scalable RESTful Platforms
**Core Stack:** Java 17, Spring Boot, AWS, React, SQL

**Impact @ Nyeras Edutech:**
• Cut MTTD: hours → <10 min
• Implemented structured logging + metrics
• Improved observability & incident response

**Why ${companyName || 'Barclays'}:**
• Drive digital innovation
• Secure, high-quality software delivery
• Support location strategy & CX goals

**SAY THIS:**
> "I'm a Java and Spring Boot engineer specializing in building scalable, secure RESTful platforms. At Nyeras Edutech, I cut mean time to detection from hours to under 10 minutes by implementing structured logging and metrics across our microservices. My core stack centers on Java 17, Spring Boot, AWS, and React. I'm excited about this opportunity at ${companyName || 'Barclays'} to drive digital innovation, deliver resilient software, and contribute to your customer experience goals."

RULES:
- Temperature: 0.25
- Never output "<think>" tags`;
  }

  /**
   * Builds user prompt based on detected or selected style
   */
  public static buildUserPrompt(question: string, style: AnswerStyle = 'auto'): string {
    const cleanQuestion = correctTechTerms(question.trim());

    // 1. Check Code Question
    if (isCodeQuestion(cleanQuestion) || style === 'code') {
      const detectedLang = detectCodeLanguage(cleanQuestion);
      console.log(`[PromptBuilder] CODE DETECTED (${detectedLang}):`, cleanQuestion);
      return `Question: "${cleanQuestion}".
YOU MUST OUTPUT IN CODE MODE.
Include:
1) **[TOPIC] - CODE & LOGIC**
2) **CORE SYNTAX:**
3) **CODE SNIPPET:** containing BOTH \`\`\`python and \`\`\`java runnable code blocks so the candidate can switch between tabs instantly.
4) **EXPLANATION:**
5) **SAY THIS:** (90+ words walking through the code in spoken words).`;
    }

    // 2. Check Introduction
    const isIntro = /tell me about yourself|introduce yourself|walk me through your resume|who are you|give me your background|brief intro/i.test(cleanQuestion);
    if (isIntro) {
      return `Interviewer asked: "${cleanQuestion}".
Format in Parakeet/Cluely ELEVATOR PITCH: **Tell Me About Yourself - Elevator Pitch**, **Current:**, **Core Stack:**, **Impact @ Nyeras Edutech:**, **Why Barclays:**, and **SAY THIS:** (100-120 words rich script).`;
    }

    // 3. Check Behavioral
    const isBehavioral = /describe a time|give me an example|how do you handle|conflict|challenge|mistake|failure|leadership|weakness|greatest strength|disagreement/i.test(cleanQuestion);
    if (isBehavioral || style === 'star') {
      return `Interviewer asked: "${cleanQuestion}".
Format in Parakeet/Cluely STAR style with Situation, Task, Action bullets, Result with metric, and **SAY THIS:** (90-110 words).`;
    }

    // 4. Default: Technical Theory
    return `Interviewer asked: "${cleanQuestion}".
Format in Parakeet/Cluely THEORY MODE: **[TOPIC] - DIRECT DEFINITION**, **What:**, **SQL MAPPING / KEY OPERATIONS:** bullets, **REAL WORLD:** bullets, and **SAY THIS:** (90-130 words detailed spoken script with Java/Spring Boot/AWS context).`;
  }

  public static buildInterviewerUserPrompt(question: string): string {
    return PromptEngine.buildUserPrompt(question, 'auto');
  }

  public static buildCandidateUserPrompt(text: string): string {
    return PromptEngine.buildUserPrompt(text, 'auto');
  }

  public static buildNotesSummaryPrompt(
    qaList: Array<{ question: string; answer: string }>,
    companyName?: string
  ): string {
    const transcript = qaList
      .map((item, idx) => `Q${idx + 1}: ${item.question}\nA${idx + 1}: ${item.answer}`)
      .join('\n\n');

    return `You are an executive interview performance coach.
Analyze the following interview session transcripts for ${companyName || 'the interview'}:

TRANSCRIPTS:
"""
${transcript}
"""

Provide a structured post-interview debrief in Markdown:
1. Overall Performance Rating (out of 10) & Verdict
2. Key Strengths Demonstrated (Bullet points)
3. Areas for Follow-up / Clarification in the next round
4. Action Items & Recommended Thank-You Note Points
Keep it insightful, actionable, and structured.`;
  }
}
