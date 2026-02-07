'use client';

/**
 * AI SDK v6 Demo Page
 *
 * Test all AI SDK features with your demo keys:
 * - Streaming chat
 * - Text generation
 * - Structured outputs
 * - Provider comparison
 */

import { useState } from 'react';
import { ChatDemo } from '@/components/ai-demo/chat-demo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export default function AIDemoPage() {
  const [generatedText, setGeneratedText] = useState<string>('');
  const [structuredData, setStructuredData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testTextGeneration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-demo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Write a creative story about a time-traveling programmer in 3 paragraphs.',
          provider: 'openai',
        }),
      });

      const data = await response.json();
      setGeneratedText(data.text);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testStructuredOutput = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-demo/structured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Create a chocolate chip cookie recipe',
          schema: 'recipe',
        }),
      });

      const data = await response.json();
      setStructuredData(data.object);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">AI SDK v6 Demo</h1>
        <p className="text-muted-foreground">
          Test Vercel AI SDK v6 with multiple providers using your demo API keys
        </p>
        <div className="flex gap-2">
          <Badge>AI SDK v6.0.0-beta.84</Badge>
          <Badge variant="secondary">22 Packages Installed</Badge>
          <Badge variant="outline">15 AI Providers</Badge>
        </div>
      </div>

      {/* Available Providers */}
      <Card>
        <CardHeader>
          <CardTitle>🤖 Available AI Providers</CardTitle>
          <CardDescription>You have demo keys configured for these providers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <ProviderCard name="OpenAI" models="GPT-4, GPT-3.5" speed="⚡⚡" />
            <ProviderCard name="Anthropic" models="Claude 3.5 Sonnet" speed="⚡⚡" />
            <ProviderCard name="Google" models="Gemini Pro" speed="⚡⚡" />
            <ProviderCard name="Cerebras" models="Llama 3.1 70B" speed="⚡⚡⚡" />
            <ProviderCard name="OpenRouter" models="100+ models" speed="⚡" />
            <ProviderCard name="ElevenLabs" models="Text-to-Speech" speed="⚡⚡" />
          </div>
        </CardContent>
      </Card>

      {/* Demo Tabs */}
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">💬 Chat</TabsTrigger>
          <TabsTrigger value="generate">✨ Generate</TabsTrigger>
          <TabsTrigger value="structured">📋 Structured</TabsTrigger>
          <TabsTrigger value="info">ℹ️ Info</TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <ChatDemo />
        </TabsContent>

        {/* Text Generation Tab */}
        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Text Generation</CardTitle>
              <CardDescription>
                Generate text with a single API call (no streaming)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testTextGeneration} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Story'}
              </Button>

              {generatedText && (
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Generated Text:</h3>
                  <p className="whitespace-pre-wrap">{generatedText}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Structured Output Tab */}
        <TabsContent value="structured" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Structured Outputs</CardTitle>
              <CardDescription>
                Generate type-safe JSON with Zod schemas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testStructuredOutput} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Recipe'}
              </Button>

              {structuredData && (
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Structured Data (Type-Safe!):</h3>
                  <pre className="overflow-x-auto">
                    {JSON.stringify(structuredData, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>📚 Quick Reference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Basic Usage:</h3>
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
{`import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'Your prompt here',
});`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">React Streaming:</h3>
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
{`import { useChat } from '@ai-sdk/react';

const { messages, input, handleSubmit } = useChat({
  api: '/api/chat',
});`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Installed Packages:</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>ai@6.0.0-beta.84 (Core SDK)</li>
                  <li>@ai-sdk/react (React hooks)</li>
                  <li>@ai-sdk/openai (OpenAI provider)</li>
                  <li>@ai-sdk/anthropic (Claude provider)</li>
                  <li>@ai-sdk/google (Gemini provider)</li>
                  <li>@ai-sdk/cerebras (Cerebras provider)</li>
                  <li>+ 15 more providers!</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProviderCard({
  name,
  models,
  speed,
}: {
  name: string;
  models: string;
  speed: string;
}) {
  return (
    <div className="p-4 border rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{name}</h3>
        <span className="text-sm">{speed}</span>
      </div>
      <p className="text-xs text-muted-foreground">{models}</p>
    </div>
  );
}
