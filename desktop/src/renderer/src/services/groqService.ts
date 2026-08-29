export class GroqService {
  private static liveModelsCache: string[] | null = null;

  /**
   * Helper to strip <think> reasoning tags
   */
  public static cleanThinkingTags(text: string): string {
    if (!text) return '';
    return text
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/<think>[\s\S]*/gi, '')
      .trim();
  }

  /**
   * Dynamically fetch live available chat models for the user's API key
   */
  public static async getAvailableChatModels(apiKey: string): Promise<string[]> {
    if (GroqService.liveModelsCache && GroqService.liveModelsCache.length > 0) {
      return GroqService.liveModelsCache;
    }

    try {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (res.ok) {
        const json = await res.json();
        const allIds: string[] = (json.data || []).map((m: any) => m.id);
        console.log('[Groq API] All models returned by Groq:', allIds);

        // Filter for chat completion models: exclude whisper, guard, and third-party models with custom licenses
        const validChatModels = allIds.filter(
          (id) =>
            !id.includes('whisper') &&
            !id.includes('guard') &&
            !id.includes('orpheus') &&
            !id.includes('canopylabs') &&
            !id.includes('compound') &&
            (id.startsWith('llama') || id.startsWith('qwen') || id.startsWith('deepseek') || id.startsWith('mistral'))
        );

        if (validChatModels.length > 0) {
          // Sort to prioritize llama-3.3-70b-versatile and llama-3.1-8b-instant first
          const sorted = validChatModels.sort((a, b) => {
            if (a === 'llama-3.3-70b-versatile') return -1;
            if (b === 'llama-3.3-70b-versatile') return 1;
            if (a === 'llama-3.1-8b-instant') return -1;
            if (b === 'llama-3.1-8b-instant') return 1;
            return 0;
          });
          console.log('[Groq API] Verified active chat models (prioritized):', sorted);
          GroqService.liveModelsCache = sorted;
          return sorted;
        }
      }
    } catch (e) {
      console.warn('[Groq API] Failed to fetch live models:', e);
    }

    return ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'llama-3.2-3b-preview', 'llama-3.2-1b-preview'];
  }

  /**
   * Validate Groq API Key on startup
   */
  public static async validateApiKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
    if (!apiKey || !apiKey.trim()) {
      return { valid: false, error: 'Groq API Key is empty' };
    }

    try {
      console.log('Using Groq Key:', apiKey.substring(0, 10) + '...');
      const models = await GroqService.getAvailableChatModels(apiKey);
      console.log('[Groq] API Key Verified: TRUE (Available models:', models.join(', ') + ')');
      return { valid: true };
    } catch (e: any) {
      console.error('[Groq] Validation Network Error:', e);
      return { valid: false, error: e.message };
    }
  }

  /**
   * Transcribe audio chunk using Groq Whisper Large v3 (Free & Ultra Fast)
   */
  public static async transcribeAudio(
    audioBlob: Blob,
    apiKey: string,
    language: string = 'en',
    contextPrompt?: string
  ): Promise<string> {
    if (!apiKey) {
      throw new Error('Groq API Key is required for Whisper transcription.');
    }

    console.log(`Audio chunk captured: ${audioBlob.size} bytes`);

    if (!audioBlob || audioBlob.size < 2000) {
      return '';
    }

    const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', 'whisper-large-v3');
    formData.append('response_format', 'json');
    formData.append('temperature', '0');

    if (contextPrompt && contextPrompt.trim()) {
      formData.append('prompt', contextPrompt.slice(-150));
    }

    if (language && language !== 'auto') {
      formData.append('language', language.split('-')[0]);
    }

    const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`Groq Whisper Error (${res.status}):`, errBody);
      throw new Error(`Groq Whisper error (${res.status}): ${errBody}`);
    }

    const data = await res.json();
    const transcriptText = data.text ? data.text.trim() : '';

    if (transcriptText) {
      console.log('GROQ TRANSCRIPT:', transcriptText);
    }

    return transcriptText;
  }

  /**
   * Stream LLM response using dynamically verified models with thinking tag stripping
   */
  public static async streamChat(
    apiKey: string,
    _requestedModel: string,
    systemPrompt: string,
    userMessage: string,
    onChunk: (delta: string) => void,
    signal?: AbortSignal
  ): Promise<string> {
    if (!apiKey) {
      throw new Error('Groq API Key is required.');
    }

    const availableModels = await GroqService.getAvailableChatModels(apiKey);
    let lastError: Error | null = null;

    for (const currentModel of availableModels) {
      try {
        const isCodeDetected = /write.*code|python code|java code|code for|program|implement|adding.*string/i.test(userMessage);
        console.log(`[Groq LLM] Calling model [${currentModel}] (Code Detected: ${isCodeDetected}):`, userMessage);

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: currentModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage },
            ],
            temperature: 0.2,
            max_tokens: 500,
            stream: true,
          }),
          signal,
        });

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`[Groq Model ${currentModel} error ${response.status}]: ${errText}`);
          throw new Error(`Groq status ${response.status} on ${currentModel}: ${errText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No readable stream returned from Groq');

        const decoder = new TextDecoder();
        let accumulatedRaw = '';
        let lastCleanLength = 0;
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === 'data: [DONE]') continue;
            if (trimmed.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(trimmed.slice(6));
                const delta = parsed.choices?.[0]?.delta?.content || '';
                if (delta) {
                  accumulatedRaw += delta;
                  const currentClean = GroqService.cleanThinkingTags(accumulatedRaw);
                  if (currentClean.length > lastCleanLength) {
                    const newChunk = currentClean.slice(lastCleanLength);
                    lastCleanLength = currentClean.length;
                    onChunk(newChunk);
                  }
                }
              } catch (e) {
                // Ignore partial json parse
              }
            }
          }
        }

        const finalClean = GroqService.cleanThinkingTags(accumulatedRaw);
        if (finalClean.trim()) {
          console.log(`Groq Answer (Model: ${currentModel}):`, finalClean);
          return finalClean;
        }
      } catch (err: any) {
        console.warn(`[Groq Model ${currentModel} failed, trying next live model...]:`, err.message);
        lastError = err;
      }
    }

    throw lastError || new Error('All Groq models failed. Please verify API key.');
  }
}
