/**
 * AI SDK v6 - Streaming Chat API Route
 *
 * This demonstrates:
 * - Real-time streaming responses
 * - Multiple AI provider support
 * - Easy switching between models
 *
 * Usage: POST /api/ai-demo/chat
 * Body: { messages: Message[], provider?: string }
 */

import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { cerebras } from '@ai-sdk/cerebras';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, provider = 'openai' } = await req.json();

    // Select model based on provider
    const modelMap = {
      openai: openai('gpt-4-turbo'),
      claude: anthropic('claude-3-5-sonnet-20241022'),
      gemini: google('gemini-1.5-pro'),
      cerebras: cerebras('llama-3.1-70b'),
    };

    const model = modelMap[provider as keyof typeof modelMap] || modelMap.openai;

    // Stream the response
    const result = streamText({
      model,
      messages,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('AI Chat Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
