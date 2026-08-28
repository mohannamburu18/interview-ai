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
 * Phonetic & misheard technical term corrections
 */
export function correctTechnicalTerms(text: string): string {
  if (!text) return '';
  let cleaned = text;

  const corrections: Array<[RegExp, string]> = [
    [/\b(water cloud|crude operations|crude operation|crew operations|cloud operations in sql)\b/gi, 'CRUD operations in SQL'],
    [/\b(crude|crew)\b/gi, 'CRUD'],
    [/\b(doc er|dock are|dockers)\b/gi, 'Docker'],
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
   * Constructs System Prompt based on selected style
   */
  public static buildSystemPrompt(context: PromptContext): string {
    const { resumeText, jobDescription, companyName, candidateName, isCodeMode, language, answerStyle } = context;

    if (isCodeMode || answerStyle === 'code') {
      return `You are a world-class coding interview co-pilot.
Provide optimal, production-grade code with Time & Space complexity (Big-O) and concise comments. NEVER output <think> tags.`;
    }

    if (answerStyle === 'definition') {
      return `You are an expert technical interview assistant.
The candidate needs a PURE, CRISP, DIRECT technical definition.

RULES FOR DIRECT DEFINITIONS:
1. Give the exact definition in 1 line.
2. List the core operations/components with their exact keywords or commands (e.g. for CRUD: Create=INSERT, Read=SELECT, Update=UPDATE, Delete=DELETE).
3. Provide 1 concrete, concise example.
4. Keep it strictly under 70 words.
5. ZERO conversational filler: DO NOT say "In production, I implement using Spring Data JPA...", "By X I assume you mean Y...", or personal STAR stories. Answer the exact technical concept directly.
6. NEVER output <think> tags.`;
    }

    return `You are an elite interview assistant giving crisp, interview-ready answers.

CANDIDATE PROFILE:
- Name: ${candidateName || 'Candidate'}
- Target Role & Company: ${jobDescription || 'Software Engineer'} at ${companyName || 'Target Company'}
- Background / Resume:
"""
${resumeText || 'Full-stack software engineer with experience in distributed systems, backend architectures, databases, and cloud.'}
"""

RULES:
1. KNOWLEDGE & TECHNICAL QUESTIONS (e.g. "What is CRUD in SQL?", "What is DP?", "Docker commands"):
   - Give a direct, accurate definition with core keywords and 1 concrete example.
   - Keep under 70 words.
   - If a phonetic mispronunciation occurs (e.g., "crude" for "CRUD"), answer the correct technical topic directly without saying "I assume you mean".
2. BEHAVIORAL QUESTIONS (e.g. "Tell me about yourself", "Challenge", "Leadership"):
   - Give a crisp STAR story (Situation, Task, Action, Result) with metrics under 60 words.
3. NEVER output <think> tags or meta-commentary. Output ONLY the spoken response.`;
  }

  /**
   * Builds user prompt based on detected or selected style
   */
  public static buildUserPrompt(question: string, style: AnswerStyle = 'auto'): string {
    const cleanQuestion = correctTechnicalTerms(question.trim());

    if (style === 'definition') {
      return `Question: "${cleanQuestion}".
Provide a direct, textbook technical definition with core keywords and 1 concise query/example. No STAR story, no framework filler. Strictly under 70 words.`;
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
    const isBehavioral = /tell me about|describe a time|give me an example|how do you handle|conflict|challenge|mistake|failure|leadership|weakness|greatest strength/i.test(cleanQuestion);
    const isCode = /write (a )?(function|code|algorithm)|implement|solve|leetcode|reverse a|merge two|binary search/i.test(cleanQuestion);

    if (isCode) {
      return `Coding question: "${cleanQuestion}". Provide optimal code and Big-O.`;
    }

    if (isBehavioral) {
      return `Interviewer asked: "${cleanQuestion}". Provide a crisp STAR answer with metrics under 60 words.`;
    }

    return `Interviewer asked: "${cleanQuestion}".
Provide a direct technical definition, core keywords, and 1 concise example. No STAR story. Under 70 words.`;
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
