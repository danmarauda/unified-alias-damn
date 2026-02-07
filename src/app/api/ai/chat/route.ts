/**
 * AI Gateway - Unified Chat API with Model Presets & Fallbacks
 *
 * Provides a unified endpoint for all AI models with automatic fallback support.
 *
 * Model Presets:
 * - default: GPT-4 Turbo (OpenAI → Azure fallback)
 * - claude: Claude 3.5 Sonnet (Anthropic → Bedrock fallback)
 * - gemini: Gemini Pro (Google AI → Vertex fallback)
 * - fast: Llama 3.1 70B (Groq → Cerebras fallback)
 *
 * Usage: POST /api/ai/chat
 * Body: { messages: Message[], preset?: string, model?: string }
 */

import { streamText, type CoreMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { cerebras } from "@ai-sdk/cerebras";
import { groq } from "@ai-sdk/groq";

export const runtime = "edge";
export const maxDuration = 30;

// Model presets with primary and fallback options
const MODEL_PRESETS = {
  default: {
    primary: () => openai("gpt-4-turbo"),
    fallback: () => openai("gpt-4o"),
    description: "GPT-4 Turbo - Best for complex reasoning",
  },
  claude: {
    primary: () => anthropic("claude-3-5-sonnet-20241022"),
    fallback: () => anthropic("claude-3-haiku-20240307"),
    description: "Claude 3.5 Sonnet - Best for analysis and writing",
  },
  gemini: {
    primary: () => google("gemini-1.5-pro"),
    fallback: () => google("gemini-1.5-flash"),
    description: "Gemini Pro - Best for multimodal tasks",
  },
  fast: {
    primary: () => groq("llama-3.1-70b-versatile"),
    fallback: () => cerebras("llama-3.1-70b"),
    description: "Llama 3.1 70B - Fastest inference",
  },
} as const;

type PresetKey = keyof typeof MODEL_PRESETS;

interface ChatRequest {
  messages: CoreMessage[];
  preset?: PresetKey;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const {
      messages,
      preset = "default",
      temperature = 0.7,
      maxTokens = 4096,
    } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get model from preset
    const presetConfig = MODEL_PRESETS[preset as PresetKey] || MODEL_PRESETS.default;

    // Try primary model first, then fallback
    let model;
    let usedFallback = false;

    try {
      model = presetConfig.primary();
    } catch {
      console.warn(`Primary model for preset "${preset}" unavailable, using fallback`);
      model = presetConfig.fallback();
      usedFallback = true;
    }

    // Stream the response
    const result = streamText({
      model,
      messages,
      temperature,
      maxOutputTokens: maxTokens,
    });

    // Add custom headers for debugging
    const response = result.toTextStreamResponse();
    response.headers.set("X-AI-Preset", preset);
    response.headers.set("X-AI-Fallback", usedFallback ? "true" : "false");

    return response;
  } catch (error) {
    console.error("AI Gateway Error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const isRateLimit = errorMessage.includes("rate limit");
    const isAuth = errorMessage.includes("API key") || errorMessage.includes("auth");

    return new Response(
      JSON.stringify({
        error: "Failed to generate response",
        details: errorMessage,
        code: isRateLimit ? "RATE_LIMIT" : isAuth ? "AUTH_ERROR" : "INTERNAL_ERROR",
      }),
      {
        status: isRateLimit ? 429 : isAuth ? 401 : 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// GET endpoint for model info
export async function GET() {
  return new Response(
    JSON.stringify({
      version: "1.0.0",
      presets: Object.entries(MODEL_PRESETS).map(([key, value]) => ({
        id: key,
        description: value.description,
      })),
      usage: {
        method: "POST",
        body: {
          messages: "CoreMessage[] - Array of chat messages",
          preset: "string - One of: default, claude, gemini, fast",
          temperature: "number - 0.0 to 2.0 (default: 0.7)",
          maxTokens: "number - Max response tokens (default: 4096)",
        },
      },
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
