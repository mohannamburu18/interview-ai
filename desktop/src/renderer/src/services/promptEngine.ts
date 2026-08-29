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
  'uh',
  'um',
  'music',
  '[music]',
  'subscribe',
  'like and subscribe',
  '.',
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
  'subscribe',
  'like and subscribe',
  'ultra prompt',
  'prompt logic',
];

/**
 * 5-Layer Ultra-Aggressive Zero Hallucination Filter
 */
export function isHallucination(text: string): boolean {
  if (!text) return true;
  const t = text.toLowerCase().trim();

  // Layer 1: Too short or too few words (unless direct question)
  if (t.length < 12 && !t.includes('?')) return true;
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length < 3 && !t.includes('?')) return true;

  // Layer 2: Exact blacklist match
  if (BLACKLIST_EXACT.includes(t)) return true;

  // Layer 3: Contains blacklist phrases
  if (BLACKLIST_CONTAINS.some((p) => t.includes(p))) return true;

  // Layer 4: Filler only
  if (/^(yeah|yes|no|okay|ok|thanks|thank you|uh|um|ah|oh|hmm)[\s\.\,]*$/i.test(t)) return true;

  // Layer 5: Repetition hallucination (Whisper repeating same word)
  const uniqueWords = new Set(words);
  if (uniqueWords.size === 1 && words.length > 2) return true; // e.g. "hello hello hello"
  if (uniqueWords.size <= 2 && words.length > 4) return true;

  // Layer 6: Punctuation/noise only
  if (/^[\.\,\s\-\_\?\!]+$/.test(t)) return true;

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
    [/\b(double linked list)\b/gi, 'doubly linked list'],
  ];

  for (const [regex, replacement] of corrections) {
    cleaned = cleaned.replace(regex, replacement);
  }

  return cleaned.trim();
}

/**
 * Perfect Merge: Deduplicates identical/overlapping fragments and strips repetition loops
 */
export function perfectMerge(fragments: string[]): string {
  if (!fragments || fragments.length === 0) return '';
  const valid = fragments.filter(Boolean).map((f) => correctTerms(f.trim()));
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

  // Step 1: Normalize
  const normalized = valid.map((f) => f.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim());

  // Step 2: Keep unique fragments with >30% new words (75% similarity = duplicate)
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
      // Replace with longer version if current is longer
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

  // Step 3: Join and clean duplicates
  let merged = uniqueOriginals.join(' ');
  merged = merged.replace(/\b(in SQL)(?:\s+\1\b)+/gi, 'in SQL');
  merged = merged.replace(/\b(what are CRUD operations in SQL)(?:.*\1)+/gi, '$1');
  merged = merged.replace(/\b(write down a python code for adding two strings)(?:.*\1)+/gi, '$1');
  merged = merged.replace(/\b(\w+ \w+ \w+)(?:\s+\1)+\b/gi, '$1');
  merged = merged.replace(/\b(\w+ \w+)(?:\s+\1)+\b/gi, '$1');
  merged = merged.replace(/\b(\w+)(?:\s+\1\b)+/gi, '$1');
  merged = merged.replace(/\s{2,}/g, ' ').trim();

  // Capitalize first letter & ensure trailing ?
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
   * Constructs Parakeet AI + Cluely AI Master System Prompt
   */
  public static buildSystemPrompt(context: PromptContext): string {
    const { resumeText, jobDescription, companyName, candidateName, isCodeMode, language, answerStyle } = context;

    return `You are Parakeet AI — the #1 real-time interview co-pilot. You format answers in Parakeet's EXACT scannable, visual style.

FORMATTING RULES:
- Use markdown: **Bold** for headings/labels, • for bullet points, > for exact spoken scripts.
- Keep headings: **SQL MAPPING:**, **KEY OPERATIONS:**, **CORE SYNTAX:**, **CODE SNIPPET:**, **REAL WORLD:**, and **SAY THIS:**.
- SAY THIS MUST BE 90-130 WORDS: 4-5 sentences, detailed, ready to read verbatim in an interview. Include definition, concrete syntax/keywords, production context (Java 17, Spring Boot, AWS, Nyeras Edutech MTTD), and closing rationale.
- CODE DETECTION: If question contains 'write code', 'python code', 'java code', 'code for', 'program', 'implement' -> MUST include **CODE SNIPPET:** with \`\`\`python or \`\`\`java runnable code block + **EXPLANATION:** + long SAY THIS explaining code line-by-line (90+ words).
- THEORY: If 'what are', 'explain', 'tell me about' -> Give theory with KEY OPERATIONS / SQL MAPPING and long SAY THIS.
- Correct 'water cloud' to 'CRUD' silently.

CANDIDATE CONTEXT:
- Candidate Name: ${candidateName || 'Candidate'}
- Target Role: ${jobDescription || 'Java & Spring Boot Engineer'} at ${companyName || 'Barclays'}
- Real Background:
"""
${resumeText || "Java and Spring Boot engineer with 3+ years experience building scalable, secure RESTful platforms. At Nyeras Edutech, cut mean time to detection from hours to under 10 minutes by implementing structured logging and metrics. Stack: Java 17, Spring Boot, AWS, React, SQL."}
"""

TEMPLATES:

1. FOR CODE QUESTIONS (e.g. "write down a python code for adding two strings"):

**PYTHON STRING ADDITION - CODE & LOGIC**

**CORE SYNTAX:**
• Concatenation using + operator
• join() method for sequence concatenation

**CODE SNIPPET:**
\`\`\`python
# Method 1: Using + operator
str1 = "Hello"
str2 = "World"
result = str1 + str2
print(result)  # Output: HelloWorld

# Method 2: Using join() - efficient for multiple strings
result2 = "".join([str1, str2])
print(result2)
\`\`\`

**EXPLANATION:**
• + operator creates a new string object (immutable)
• join() is O(n) linear and avoids quadratic copy overhead

**SAY THIS:**
> "In Python, to concatenate or add two strings, we can use the plus operator. For example, setting str1 to 'Hello' and str2 to 'World', then result equals str1 plus str2 produces 'HelloWorld'. Because strings in Python are immutable, each plus operation creates a new string object in memory. When combining multiple strings or working in loops, I prefer using empty string dot join with a list, which runs in linear O of N time and avoids unnecessary memory reallocation."

2. FOR THEORY / TECHNICAL DEFINITIONS (e.g. "What are CRUD operations in SQL", "Doubly linked list"):

**[TOPIC] - DIRECT DEFINITION**

**What:** [1 line crisp definition]

**SQL MAPPING / KEY OPERATIONS:**
• **C**reate → INSERT INTO users VALUES(...)
• **R**ead → SELECT * FROM users WHERE id = ...
• **U**pdate → UPDATE users SET status = 'active' WHERE id = ...
• **D**elete → DELETE FROM users WHERE id = ...

**REAL WORLD:**
• [Where used in industry, e.g. Relational DB transactions, browser history, cache synchronization]

**SAY THIS:**
> "[90-130 words comprehensive spoken explanation: 2-3 lines definition, 1 line SQL keywords example, 1 line production experience at Nyeras Edutech with Spring Boot/Java/AWS/indexing, and 1 line closing why it forms the backbone of applications]"

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

4. FOR BEHAVIORAL:

**[TOPIC] - STAR**

**Situation:** [1 line context]
**Task:** [1 line objective]
**Action:**
• [Action 1]
• [Action 2]
**Result:** [Outcome with metric]

**SAY THIS:**
> "[90-110 words full STAR narrative in confident first person]"

RULES:
- Temperature: 0.25
- Never output "<think>" tags
- Always correct "water cloud" to "CRUD" silently`;
  }

  /**
   * Builds user prompt based on detected or selected style
   */
  public static buildUserPrompt(question: string, style: AnswerStyle = 'auto'): string {
    const cleanQuestion = correctTerms(question.trim());

    // 1. Check Code Question
    const isCode = /write (a )?(function|code|algorithm|program|script|down)|python code|java code|code for|program for|implement|create a function|coding question|adding two strings|two strings/i.test(cleanQuestion);
    if (isCode || style === 'code') {
      console.log('CODE DETECTED IN PROMPT BUILDER:', cleanQuestion);
      return `Question: "${cleanQuestion}".
YOU MUST OUTPUT IN CODE MODE: **[TOPIC] - CODE & LOGIC**, **CORE SYNTAX:**, **CODE SNIPPET:** with \`\`\`python or \`\`\`java runnable code block, **EXPLANATION:**, and **SAY THIS:** (90+ words explaining code line by line). DO NOT output text only.`;
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
