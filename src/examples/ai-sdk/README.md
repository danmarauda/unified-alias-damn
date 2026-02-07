# AI SDK v6 Examples

Complete examples for using Vercel AI SDK v6 with your demo keys.

## 📚 Available Examples

1. **basic-text-generation.ts** - Simple text generation with multiple providers
2. **streaming-chat.tsx** - React streaming chat component
3. **structured-outputs.ts** - Type-safe structured data generation with Zod
4. **function-calling.ts** - AI function calling / tool use
5. **multi-provider-comparison.ts** - Compare responses from different providers
6. **voice-integration.ts** - ElevenLabs + Deepgram integration

## 🚀 Quick Start

### 1. API Routes (Server-side)

```bash
# All API routes are in src/app/api/
npm run dev
```

Access at:
- http://localhost:3000/api/chat - Streaming chat
- http://localhost:3000/api/generate - Text generation
- http://localhost:3000/api/structured - Structured outputs

### 2. Client Components (React)

Import and use in your pages:

```tsx
import { ChatComponent } from '@/examples/ai-sdk/streaming-chat';

export default function Page() {
  return <ChatComponent />;
}
```

## 🔑 Available Providers

With your demo keys, you can use:

- ✅ **OpenAI** - GPT-4 Turbo, GPT-3.5
- ✅ **Anthropic** - Claude 3.5 Sonnet
- ✅ **Google** - Gemini Pro
- ✅ **Cerebras** - Ultra-fast inference (2000+ tok/s)
- ✅ **OpenRouter** - Access to 100+ models

## 📖 Example Usage

### Basic Text Generation

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'Write a haiku about coding',
});

console.log(text);
```

### Streaming Chat

```typescript
import { useChat } from '@ai-sdk/react';

export function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });
  
  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>{m.role}: {m.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
```

### Structured Outputs

```typescript
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const { object } = await generateObject({
  model: openai('gpt-4-turbo'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a cookie recipe',
});

console.log(object.recipe.name); // Type-safe!
```

## 🎯 Provider Comparison

| Provider | Speed | Context | Best For |
|----------|-------|---------|----------|
| **Cerebras** | ⚡⚡⚡ 2000+ tok/s | 128K | Fast responses |
| **OpenAI GPT-4** | ⚡⚡ Medium | 128K | Complex reasoning |
| **Claude 3.5** | ⚡⚡ Medium | 200K | Long context, coding |
| **Gemini Pro** | ⚡⚡ Medium | 1M | Multi-modal, huge context |
| **OpenRouter** | ⚡ Varies | Varies | Access to 100+ models |

## 🔧 Testing Your Setup

Run the test script:

```bash
npm run test:ai-sdk
```

This will test all providers and show which keys are working.

## 📝 Notes

- These are **demo keys** - safe for testing and development
- Rate limits may apply to demo keys
- For production, get your own API keys from each provider
