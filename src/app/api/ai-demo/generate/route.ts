/**
 * AI SDK v6 - Text Generation API Route
 *
 * This demonstrates:
 * - Simple text generation
 * - Provider selection
 * - System prompts
 *
 * Usage: POST /api/ai-demo/generate
 * Body: { prompt: string, provider?: string, systemPrompt?: string }
 */

import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { cerebras } from '@ai-sdk/cerebras';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { prompt, provider = 'openai', systemPrompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Select model
    const modelMap = {
      openai: openai('gpt-4-turbo'),
      claude: anthropic('claude-3-5-sonnet-20241022'),
      gemini: google('gemini-1.5-pro'),
      cerebras: cerebras('llama-3.1-70b'),
    };

    const model = modelMap[provider as keyof typeof modelMap] || modelMap.openai;

    // Generate text
    const { text, usage } = await generateText({
      model,
      prompt,
      system: systemPrompt,
      temperature: 0.7,
    });

    return new Response(
      JSON.stringify({
        text,
        usage,
        provider,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('AI Generate Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate text' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
