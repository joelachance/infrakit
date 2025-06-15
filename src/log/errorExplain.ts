import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const SYSTEM_PROMPT =
  "You're a senior software engineer with a strong understanding of backtraces and errors. Give us a very brief overview of this error, with the location where the error is occurring and a potential solution that is easy to understand for a junior.";

/**
 * Generate a human readable explanation for a stack trace using the OpenAI API.
 * Returns `null` if the backtrace is empty, the API key is missing, or the
 * request fails.
 */
export async function explainError(backtrace: string | null | undefined): Promise<string | null> {
  const trace = typeof backtrace === 'string' ? backtrace.trim() : '';
  if (!trace) {
    return null;
  }

  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      system: SYSTEM_PROMPT,
      prompt: trace,
    });
    return text.trim();
  } catch {
    return null;
  }
}
