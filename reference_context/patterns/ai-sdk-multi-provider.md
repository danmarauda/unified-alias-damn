# AI SDK Multi-Provider Pattern

## Pattern Overview

This pattern abstracts multiple AI providers behind a unified interface, allowing easy switching between providers without changing application code.

## Architecture

```
Application Code → AI SDK → Provider Adapter → LLM API
```

## Implementation

### 1. Provider Map

```typescript
// src/app/api/ai-demo/chat/route.ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { cerebras } from '@ai-sdk/cerebras';

const modelMap = {
  openai: openai('gpt-4-turbo'),
  claude: anthropic('claude-3-5-sonnet-20241022'),
  gemini: google('gemini-1.5-pro'),
  cerebras: cerebras('llama-3.1-70b'),
};
```

### 2. Unified API Route

```typescript
export async function POST(req: Request) {
  const { messages, provider = 'openai' } = await req.json();
  
  const model = modelMap[provider as keyof typeof modelMap] || modelMap.openai;
  
  const result = streamText({
    model,
    messages,
    temperature: 0.7,
  });
  
  return result.toTextStreamResponse();
}
```

### 3. React Hook Usage

```typescript
// src/components/ai-demo/chat-demo.tsx
export function ChatDemo() {
  const [provider, setProvider] = useState<string>('openai');
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai-demo/chat',
    body: { provider },
  });
  
  // UI with provider selection
}
```

## Provider Selection Strategy

### By Use Case

- **Fast Responses:** Cerebras (2000+ tok/s)
- **Complex Reasoning:** OpenAI GPT-4
- **Long Context:** Claude 3.5 (200K tokens)
- **Huge Context:** Gemini Pro (1M tokens)

### By Cost

- **Budget:** Cerebras, OpenRouter
- **Balanced:** OpenAI, Anthropic
- **Premium:** Latest models

## Structured Outputs

```typescript
import { generateObject } from 'ai';
import { z } from 'zod';

const { object } = await generateObject({
  model: openai('gpt-4-turbo'),
  schema: z.object({
    name: z.string(),
    age: z.number(),
    email: z.string().email(),
  }),
  prompt: 'Generate a user profile',
});

// Type-safe access
console.log(object.name);  // string
console.log(object.age);   // number
```

## Best Practices

1. **Provider Abstraction:** Keep provider logic in API routes
2. **Fallback Strategy:** Default to reliable provider
3. **Error Handling:** Handle provider-specific errors
4. **Cost Tracking:** Monitor token usage per provider
5. **Type Safety:** Use Zod for structured outputs

## Advanced Patterns

### Provider Routing

```typescript
function selectProvider(task: string): string {
  if (task.includes('code')) return 'claude';
  if (task.includes('fast')) return 'cerebras';
  if (task.includes('context')) return 'gemini';
  return 'openai';
}
```

### Cost Optimization

```typescript
// Use cheaper provider for simple tasks
const model = isSimpleTask(task) 
  ? cerebras('llama-3.1-70b')
  : openai('gpt-4-turbo');
```

## Related Patterns

- See `ai-sdk-streaming.md` for streaming patterns
- See `ai-sdk-structured-outputs.md` for structured data
- See `cost-tracking.md` for cost management


