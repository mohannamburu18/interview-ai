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

/**
 * Ultra-Aggressive Zero Hallucination Filter (Accurate & Safe)
 */
export function isHallucination(text: string): boolean {
  if (!text) return true;
  const t = text.toLowerCase().trim();

  // Basic length check: must have at least 4 characters
  if (t.length < 4) return true;

  // Exact standalone filler/hallucination phrases
  const EXACT_FILLERS = [
    /^thank you(\.|\!|\,)?$/i,
    /^thanks(\.|\!|\,)?$/i,
    /^thanks for watching(\.|\!|\,)?$/i,
    /^please subscribe(\.|\!|\,)?$/i,
    /^like and subscribe(\.|\!|\,)?$/i,
    /^subtitles by/i,
    /^bye(\.|\!|\,)?$/i,
    /^yeah(\.|\!|\,)?$/i,
    /^yes(\.|\!|\,)?$/i,
    /^okay(\.|\!|\,)?$/i,
    /^ok(\.|\!|\,)?$/i,
    /^uh(\.|\!|\,)?$/i,
    /^um(\.|\!|\,)?$/i,
    /^you know(\.|\!|\,)?$/i,
    /^\[.*\]$/, // [Music], [Applause], [Silence]
    /^\(.*\)$/,
    /^(\.|\,|\?|\!|\-)+$/,
  ];

  for (const pattern of EXACT_FILLERS) {
    if (pattern.test(t)) return true;
  }

  // Filter out developer meta talk about prompts
  if (t.includes('hallucination') || t.includes('ultra prompt') || t.includes('prompt logic')) {
    return true;
  }

  return false;
}

/**
 * Phonetic & Technical Term Correction
 */
export function correctTerms(text: string): string {
  if (!text) return '';
  let cleaned = text;

  const corrections: Array<[RegExp, string]> = [
    [/\b(water cloud operations|water cloud|crude operations|crude operation|crew operations|cloud operations in sql)\b/gi, 'CRUD operations in SQL'],
    [/\b(crude|crew)\b/gi, 'CRUD'],
    [/\b(are you a familiar)\b/gi, 'are you familiar'],
    [/\b(doc er|dock are|dockers commands)\b/gi, 'Docker commands'],
    [/\b(kuberneties|kubernets|k eight s)\b/gi, 'Kubernetes'],
    [/\b(post grass|postgress|postgre sql)\b/gi, 'PostgreSQL'],
    [/\b(no sequel|no sq l)\b/gi, 'NoSQL'],
    [/\b(my sequel|my sq l)\b/gi, 'MySQL'],
    [/\b(sequel|sq l)\b/gi, 'SQL'],
    [/\b(kaf ca|caffa)\b/gi, 'Kafka'],
    [/\b(micro services)\b/gi, 'microservices'],
    [/\b(rest full|rest api s)\b/gi, 'REST API'],
    [/\b(type script)\b/gi, 'TypeScript'],
    [/\b(java script)\b/gi, 'JavaScript'],
    [/\b(dynamo db)\b/gi, 'DynamoDB'],
    [/\b(mongo db)\b/gi, 'MongoDB'],
  ];

  for (const [regex, replacement] of corrections) {
    cleaned = cleaned.replace(regex, replacement);
  }

  return cleaned;
}

/**
 * Merges sentence fragments into one coherent question
 */
export function mergeFragments(fragments: string[]): string {
  if (!fragments || fragments.length === 0) return '';
  let merged = fragments.join(' ');
  // Remove duplicate adjacent words
  merged = merged.replace(/\b(\w+) \1\b/gi, '$1');
  merged = merged.replace(/\s+/g, ' ').trim();
  // If ends without ?, add ? if it starts with a question word
  if (/^(what|how|tell|explain|why|can you|are you|describe|which|is there)/i.test(merged) && !merged.endsWith('?')) {
    merged += '?';
  }
  return merged;
}

export class PromptEngine {
  /**
   * Constructs FAANG Top 1% Master System Prompt
   */
  public static buildSystemPrompt(context: PromptContext): string {
    const { resumeText, jobDescription, companyName, candidateName, isCodeMode, language, answerStyle } = context;

    if (isCodeMode || answerStyle === 'code') {
      return `You are a FAANG Staff Engineer live coding co-pilot.
Provide optimal, production-grade code with Time & Space complexity (Big-O) and concise comments.
Language: ${language || 'TypeScript / Python'}
NEVER output <think> tags. Output ONLY code and Big-O.`;
    }

    return `You are a FAANG Top 1% interview coach. You give answers that get HIRED at Google, Amazon, Meta, Microsoft.

Context: This is a live technical/behavioral interview between Interviewer and Candidate (${candidateName || 'Candidate'}). You must answer what the Interviewer asks from the Candidate's perspective.

CANDIDATE CONTEXT:
- Role & Target: ${jobDescription || 'Senior Software Engineer'} at ${companyName || 'Target Tech Company'}
- Background & Resume:
"""
${resumeText || 'Backend Engineer with 3+ years building scalable distributed microservices, cloud systems on AWS, Spring Boot/Java/Python, and SQL databases.'}
"""

QUESTION TYPE DETECTION (AUTO):

A) IF "Tell me about yourself" / "Introduce yourself" / "Walk me through your resume" / "Brief intro":
   Give ELEVATOR PITCH - 45 seconds, FAANG level:
   Structure: Role + Years + Current Company + Impact with METRIC + Top 3 Stack + Why this role
   Example: "I'm a Backend Engineer with 3 years building scalable SaaS platforms. At Propilot, I architected a CRM backend on Java, Spring Boot, AWS handling 10k daily requests, cutting infra cost 30% via Docker and ECS. My core is Java, Microservices, AWS, SQL. Previously I built distributed pipelines. I'm excited about this Senior role at ${companyName || 'this company'} to lead distributed systems at scale."
   NO definition, NO bullet points, confident first person, 60-80 words.

B) IF "What is X" / "What are X" / "Define X" / "Explain X" (e.g. CRUD, Docker, SQL, Microservices, REST):
   Give TOP-TIER DEFINITION that impresses FAANG interviewer:
   - 1 line crisp definition
   - How it works (core keywords, e.g. INSERT, SELECT, UPDATE, DELETE for CRUD)
   - Real production example with trade-off (e.g. caching for high throughput, avoiding N+1 queries)
   - When to use / When NOT to use
   - Under 90 words.
   Example for CRUD: "CRUD stands for Create, Read, Update, Delete - the 4 fundamental operations for persistent storage. In SQL: INSERT for Create, SELECT for Read, UPDATE for Update, DELETE for Delete. In production, I use Spring Data JPA which abstracts these, but I always inspect generated SQL to prevent N+1 queries. It forms the basis of database interactions, while caching is added for high-throughput reads."

C) IF Behavioral ("Challenge" / "Conflict" / "Failure" / "Leadership" / "Disagreement"):
   Give STAR with METRICS - FAANG format:
   - Situation: Context (1 line)
   - Task: Your responsibility (1 line)
   - Action: What YOU did (2 lines, technical decisions)
   - Result: Measurable outcome with METRIC (e.g. reduced latency 40%, saved 30% infra cost, handled 10k TPS)
   80-100 words, first person.

D) IF Coding / System Design ("Design X" / "How would you build"):
   Give high-level architecture approach + trade-offs.

RULES:
- Always correct "water cloud operations" -> "CRUD operations in SQL" silently
- Never say "By crude operations I assume" - directly answer
- Temperature 0.25 for accuracy, max_tokens 220 for concise
- NO "<think>", NO "Definition:", NO "Core Components"
- Professional, crisp, metric-driven
- Tailor to background from resume.`;
  }

  /**
   * Builds user prompt based on detected or selected style
   */
  public static buildUserPrompt(question: string, style: AnswerStyle = 'auto'): string {
    const cleanQuestion = correctTerms(question.trim());

    // 1. Check for Introduction / Elevator Pitch Intent
    const isIntro = /tell me about yourself|introduce yourself|walk me through your resume|who are you|give me your background|brief intro/i.test(cleanQuestion);
    if (isIntro) {
      return `Interviewer asked: "${cleanQuestion}".
Give a high-impact FAANG elevator pitch in first person based on my resume with metrics and tech stack. Do NOT output definition headers or bullet points. Speak naturally in 60-80 words.`;
    }

    if (style === 'definition') {
      return `Question: "${cleanQuestion}".
Provide a top-tier FAANG technical definition with exact keywords (e.g. INSERT, SELECT, UPDATE, DELETE for CRUD), production trade-off, and 1 concise query/example. Under 80 words.`;
    }

    if (style === 'star') {
      return `Question: "${cleanQuestion}".
Provide a concise STAR behavioral answer (Situation, Task, Action, Result) based on my resume with metrics. Under 75 words.`;
    }

    if (style === 'code') {
      return `Coding problem: "${cleanQuestion}".
Provide optimal code with Big-O Time and Space complexity.`;
    }

    // Auto-detect
    const isBehavioral = /describe a time|give me an example|how do you handle|conflict|challenge|mistake|failure|leadership|weakness|greatest strength|disagreement/i.test(cleanQuestion);
    const isCode = /write (a )?(function|code|algorithm)|implement|solve|leetcode|reverse a|merge two|binary search/i.test(cleanQuestion);

    if (isCode) {
      return `Coding question: "${cleanQuestion}". Provide optimal code and Big-O.`;
    }

    if (isBehavioral) {
      return `Interviewer asked: "${cleanQuestion}". Provide a crisp STAR answer with metrics under 75 words.`;
    }

    return `Interviewer asked: "${cleanQuestion}".
Provide a top-tier FAANG technical definition with exact SQL/command keywords, production example, and trade-off. Under 80 words.`;
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
