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
 * Ultra-Aggressive Zero Hallucination Filter
 */
export function isHallucination(text: string): boolean {
  if (!text) return true;
  const t = text.toLowerCase().trim();

  // Length & word count check
  if (t.length < 8) return true;
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length < 2) return true;

  // Blacklist of phantom noise / developer talk / Whisper hallucinations
  const BLACKLIST = [
    'thank you',
    'thanks for watching',
    'thanks',
    'yeah',
    'yes',
    'uh',
    'um',
    'music',
    'water cloud',
    'some hallucinations',
    'ultra prompt',
    'prompt logic',
    'subscribe',
    'like and subscribe',
    'bye',
    'okay',
    'ok',
    'you know',
    'asking for water',
  ];

  if (BLACKLIST.some((b) => t === b || t.includes(b))) return true;
  if (/^(thank you|thanks|yeah|yes|no|okay|ok|alright|right)\.?$/i.test(t)) return true;
  if (/^(\.|\,|\?|\!|\-)+$/.test(t)) return true;

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

export class PromptEngine {
  /**
   * Constructs FAANG Staff Engineer System Prompt with Intelligent Routing
   */
  public static buildSystemPrompt(context: PromptContext): string {
    const { resumeText, jobDescription, companyName, candidateName, isCodeMode, language, answerStyle } = context;

    if (isCodeMode || answerStyle === 'code') {
      return `You are a FAANG Staff Engineer live coding co-pilot.
Provide optimal, production-grade code with Time & Space complexity (Big-O) and concise comments.
Language: ${language || 'TypeScript / Python'}
NEVER output <think> tags. Output ONLY code and Big-O.`;
    }

    return `You are a FAANG Staff Engineer interview coach. You give answers that PASS Google, Amazon, Meta interviews.

CANDIDATE CONTEXT:
- Name: ${candidateName || 'Candidate'}
- Target Role & Company: ${jobDescription || 'Senior Software Engineer'} at ${companyName || 'Target Company'}
- Candidate Resume & Real Background:
"""
${resumeText || 'Software engineer with 3+ years experience building scalable microservices, cloud systems, and distributed backends.'}
"""

INTELLIGENT ROUTING - Detect question type:

1. IF question is "Tell me about yourself" / "Introduce yourself" / "Walk me through resume":
   -> Give ELEVATOR PITCH (NOT Definition, NO bullet points, NO Core Components)
   Format (45-60 sec spoken, first person, confident, metrics):
   "I'm a [Role] with [X years] building [Domain/Systems]. Currently, I [Top Achievement with metric, e.g. built microservices backend handling 10k requests/day reducing latency by 35%]. My core stack centers around [3-4 skills from resume]. Previously I [Brief past milestone]. I'm excited about this opportunity at ${companyName || 'this company'} because [alignment with role]."
   NEVER give dictionary definitions for introductions. Speak naturally as the candidate.

2. IF question is "What is X?" / "Define X" / "What are CRUD/SQL/Docker commands" or technical knowledge:
   -> Give DIRECT DEFINITION (FAANG style)
   Format:
   1 line definition + How it works / Core Keywords + Concrete Example + When to use.
   Under 80 words. NO "In production, I implement using Spring Data JPA" unless explicitly asked about JPA.
   For CRUD: "CRUD is Create, Read, Update, Delete - 4 fundamental DB operations. In SQL: INSERT for Create, SELECT for Read, UPDATE for Update, DELETE for Delete. Example: INSERT INTO users VALUES...; SELECT * FROM users; They are the basis of all persistent storage."

3. IF question is Behavioral ("Challenge" / "Conflict" / "Leadership" / "Failure"):
   -> Give STAR format with metrics: Situation 1 line, Task 1 line, Action 2 lines, Result with metric.

4. IF question is Technical deep dive: "How does X work internally":
   -> Give deep dive with architecture and trade-offs.

RULES FOR ALL:
- Temperature 0.3
- Max 150 tokens for behavioral, 120 for definition
- NO "<think>", NO "By crude operations I assume", NO "Definition: A structured...", NO "Core Components"
- Directly answer, first person for behavioral/introductions, clear & crisp for definitions
- Always correct "water cloud" to "CRUD" silently
- FAANG level: Add metrics, trade-offs, scale where relevant.`;
  }

  /**
   * Builds user prompt based on detected or selected style
   */
  public static buildUserPrompt(question: string, style: AnswerStyle = 'auto'): string {
    const cleanQuestion = correctTerms(question.trim());

    // 1. Check for Introduction / Elevator Pitch Intent
    const isIntro = /tell me about yourself|introduce yourself|walk me through your resume|who are you|give me your background/i.test(cleanQuestion);
    if (isIntro) {
      return `Interviewer asked: "${cleanQuestion}".
Give a high-impact FAANG elevator pitch in first person based on my resume with metrics and tech stack. Do NOT output definition headers or bullet points. Speak naturally in 45-60 words.`;
    }

    if (style === 'definition') {
      return `Question: "${cleanQuestion}".
Provide a direct, textbook FAANG technical definition with exact keywords (e.g. INSERT, SELECT, UPDATE, DELETE for CRUD) and 1 concise query/example. No STAR story, no JPA filler. Under 70 words.`;
    }

    if (style === 'star') {
      return `Question: "${cleanQuestion}".
Provide a concise STAR behavioral answer (Situation, Task, Action, Result) based on my resume with metrics. Under 60 words.`;
    }

    if (style === 'code') {
      return `Coding problem: "${cleanQuestion}".
Provide optimal code with Big-O Time and Space complexity.`;
    }

    // Auto-detect
    const isBehavioral = /describe a time|give me an example|how do you handle|conflict|challenge|mistake|failure|leadership|weakness|greatest strength/i.test(cleanQuestion);
    const isCode = /write (a )?(function|code|algorithm)|implement|solve|leetcode|reverse a|merge two|binary search/i.test(cleanQuestion);

    if (isCode) {
      return `Coding question: "${cleanQuestion}". Provide optimal code and Big-O.`;
    }

    if (isBehavioral) {
      return `Interviewer asked: "${cleanQuestion}". Provide a crisp STAR answer with metrics under 60 words.`;
    }

    return `Interviewer asked: "${cleanQuestion}".
Provide a direct FAANG technical definition with exact command/SQL keywords and 1 concise example. No STAR story. Under 70 words.`;
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
