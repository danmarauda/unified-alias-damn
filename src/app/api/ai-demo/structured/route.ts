/**
 * AI SDK v6 - Structured Output API Route
 *
 * This demonstrates:
 * - Type-safe structured data generation
 * - Zod schema validation
 * - JSON mode with AI models
 *
 * Usage: POST /api/ai-demo/structured
 * Body: { prompt: string, schema?: string }
 */

import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export const runtime = 'edge';

// Example schemas
const schemas = {
  recipe: z.object({
    recipe: z.object({
      name: z.string().describe('Recipe name'),
      ingredients: z.array(z.string()).describe('List of ingredients'),
      steps: z.array(z.string()).describe('Cooking instructions'),
      cookTime: z.number().describe('Cook time in minutes'),
      servings: z.number().describe('Number of servings'),
    }),
  }),

  person: z.object({
    person: z.object({
      name: z.string(),
      age: z.number(),
      occupation: z.string(),
      hobbies: z.array(z.string()),
      bio: z.string(),
    }),
  }),

  product: z.object({
    product: z.object({
      name: z.string(),
      category: z.string(),
      price: z.number(),
      features: z.array(z.string()),
      description: z.string(),
    }),
  }),
};

export async function POST(req: Request) {
  try {
    const { prompt, schema = 'recipe' } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get schema
    const selectedSchema = schemas[schema as keyof typeof schemas] || schemas.recipe;

    // Generate structured output
    const { object, usage } = await generateObject({
      model: openai('gpt-4-turbo'),
      schema: selectedSchema,
      prompt,
    });

    return new Response(
      JSON.stringify({
        object,
        usage,
        schema: schema,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('AI Structured Output Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate structured output' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
