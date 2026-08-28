import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private static readonly MODELS = [
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-pro',
    'gemini-pro',
  ];

  /**
   * Validate Gemini API Key format
   */
  public static isValidGeminiKey(apiKey: string): boolean {
    return Boolean(apiKey && (apiKey.startsWith('AIzaSy') || apiKey.length >= 35));
  }

  /**
   * Stream response from Google Gemini with multi-model auto-fallback
   */
  public static async streamChat(
    apiKey: string,
    systemPrompt: string,
    userMessage: string,
    onChunk: (delta: string) => void
  ): Promise<string> {
    if (!apiKey || !apiKey.trim()) {
      throw new Error('Google Gemini API Key is required.');
    }

    if (!apiKey.startsWith('AIzaSy')) {
      console.warn('[Gemini] Note: Gemini API keys from Google AI Studio typically start with "AIzaSy...".');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    let lastError: any = null;

    // 1. Try with Google SDK across available models
    for (const modelName of GeminiService.MODELS) {
      try {
        console.log(`[Gemini SDK] Trying model: ${modelName}...`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt,
        });

        const result = await model.generateContentStream([
          {
            text: userMessage,
          },
        ]);

        let fullText = '';
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          fullText += chunkText;
          onChunk(chunkText);
        }

        if (fullText.trim()) {
          console.log(`[Gemini Success on ${modelName}]:`, fullText);
          return fullText;
        }
      } catch (err: any) {
        console.warn(`[Gemini Model ${modelName} failed]:`, err.message);
        lastError = err;
      }
    }

    // 2. Direct REST fallback (v1 & v1beta)
    for (const modelName of ['gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-pro']) {
      try {
        console.log(`[Gemini REST Fallback] Trying direct HTTP endpoint for ${modelName}...`);
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\nQuestion: ${userMessage}` }],
                },
              ],
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (answer) {
            onChunk(answer);
            console.log(`[Gemini REST Success on ${modelName}]:`, answer);
            return answer;
          }
        }
      } catch (e) {
        console.warn('[Gemini REST error]:', e);
      }
    }

    throw lastError || new Error('Google Gemini API request failed. Please verify your Gemini API key in Settings.');
  }
}
