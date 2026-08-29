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

  // Basic length check: must have at least 8 characters
  if (t.length < 8) return true;

  // Must have at least 3 words unless it's a direct short question
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length < 3 && !t.includes('?')) return true;

  // Standalone filler blacklist
  const blacklist = [
    'thank you',
    'thanks for watching',
    'thanks',
    'yeah',
    'yes',
    'uh',
    'um',
    'water cloud',
    'some hallucinations',
    'music',
    'subscribe',
    'like and subscribe',
    'hallucinations',
    'ultra prompt',
    'prompt logic',
    'bye',
    'okay',
    'ok',
    'you know',
  ];

  if (blacklist.some((b) => t === b || t.startsWith(b + ' ') || t.endsWith(' ' + b))) {
    return true;
  }

  // Lowercase short without ? is almost always Whisper background hallucination
  if (t === t.toLowerCase() && t.length < 15 && !t.includes('?')) {
    return true;
  }

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
   * Constructs Parakeet AI + Cluely AI Structured Formatting System Prompt
   */
  public static buildSystemPrompt(context: PromptContext): string {
    const { resumeText, jobDescription, companyName, candidateName, isCodeMode, language, answerStyle } = context;

    if (isCodeMode || answerStyle === 'code') {
      return `You are Parakeet AI + Cluely AI live coding co-pilot.
Provide optimal, production-grade code with Time & Space complexity (Big-O) and concise comments.
Language: ${language || 'TypeScript / Python'}
NEVER output <think> tags. Output ONLY code and Big-O.`;
    }

    return `You are Parakeet AI + Cluely AI — you give answers in their EXACT visual, high-impact scannable style.

FORMATTING RULES (CRITICAL):
- NEVER give a plain wall of paragraph text.
- ALWAYS use markdown: **Bold** for labels, • for bullets, > for exact script.
- Keep each bullet under 12 words.
- Must be scannable in 3 seconds.
- Provide 2 distinct layers for every answer:
  1) Quick glanceable bullets
  2) "Say This:" block with the exact verbatim script.

CANDIDATE CONTEXT:
- Candidate Name: ${candidateName || 'Candidate'}
- Target Role: ${jobDescription || 'Java & Spring Boot Engineer'} at ${companyName || 'Barclays'}
- Candidate Resume & Background:
"""
${resumeText || "Java and Spring Boot engineer with 3+ years experience building scalable, secure RESTful platforms. At Nyeras Edutech, cut mean time to detection from hours to under 10 minutes by implementing structured logging and metrics. Stack: Java 17, Spring Boot, AWS, React, SQL."}
"""

TEMPLATES BY QUESTION TYPE:

1. FOR "TELL ME ABOUT YOURSELF" / INTRODUCTIONS:

**Tell Me About Yourself - Elevator Pitch**

**Current:** [Role] | [Domain / Specialization]
**Core Stack:** [3-4 technologies]

**Impact @ [Previous/Current Company]:**
• [Metric 1 - e.g. Cut MTTD: hours → <10 min]
• [Action - e.g. Structured logging + metrics]
• [Result - e.g. Improved observability & detection]

**Why ${companyName || 'Target Company'}:**
• [Key company goal 1 - e.g. Drive digital innovation]
• [Key company goal 2 - e.g. Secure, high-quality software delivery]
• [Key company goal 3 - e.g. Support location strategy & CX]

**Say This (45 sec script):**
> "[Full 2-3 line spoken version in confident first person combining role, metric, stack, and company intent]"

2. FOR TECHNICAL DEFINITIONS (e.g. "What are CRUD operations in SQL", "What is Docker", "Kafka vs RabbitMQ"):

**[Topic] - Direct Definition**

**What:** [1 line crisp definition]

**SQL / Core Mapping:**
• **C**reate → INSERT INTO users VALUES(...)
• **R**ead → SELECT * FROM users WHERE...
• **U**pdate → UPDATE users SET...
• **D**elete → DELETE FROM users WHERE...

**Prod Trade-off & Example:**
• [How you use it in production, e.g. Spring Data JPA, checking logs for N+1]
• [Trade-off or optimization, e.g. Add Redis cache for high-throughput reads]

**When to use:** [1 concise line]

**Say This:**
> "[Concise spoken explanation covering definition, SQL commands, and production trade-off]"

3. FOR BEHAVIORAL QUESTIONS (Challenge, Conflict, Leadership, Failure):

**[Topic] - STAR Format**

**Situation:** [1 line context]
**Task:** [1 line objective]
**Action:**
• [Technical decision 1]
• [Technical decision 2]
**Result:** [Measurable outcome with METRIC]

**Say This:**
> "[Full STAR story in confident first person]"

GENERAL CONSTRAINTS:
- Keep total output under 140 words.
- Scannable bullets + bold labels ONLY.
- Always include the **Say This:** block.
- Temperature 0.25.
- Correct "water cloud" to "CRUD" silently.`;
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
Format in Parakeet/Cluely style: **Tell Me About Yourself - Elevator Pitch** with **Current:**, **Core Stack:**, **Impact @ Company:** bullets, **Why Company:** bullets, and **Say This:** block. NO plain paragraphs.`;
    }

    if (style === 'definition') {
      return `Question: "${cleanQuestion}".
Format in Parakeet/Cluely style: **[Topic] - Direct Definition** with **What:**, **SQL / Core Mapping:** bullets, **Prod Trade-off:** bullets, and **Say This:** block. NO plain paragraphs.`;
    }

    if (style === 'star') {
      return `Question: "${cleanQuestion}".
Format in Parakeet/Cluely STAR style with Situation, Task, Action bullets, Result with metric, and **Say This:** block.`;
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
      return `Interviewer asked: "${cleanQuestion}". Format in Parakeet/Cluely STAR bullet style with **Say This:** block.`;
    }

    return `Interviewer asked: "${cleanQuestion}".
Format in Parakeet/Cluely style with scannable bullets, bold labels, and **Say This:** block. NO plain paragraphs.`;
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
