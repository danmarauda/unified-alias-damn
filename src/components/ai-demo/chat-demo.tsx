"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Map provider IDs to AI Gateway presets
const PROVIDER_TO_PRESET: Record<string, string> = {
  openai: "default",
  claude: "claude",
  gemini: "gemini",
  cerebras: "fast",
};

export function ChatDemo() {
  const [provider, setProvider] = useState<string>("openai");
  const [inputValue, setInputValue] = useState("");

  // Create transport with dynamic body based on provider
  // Using type assertion for AI SDK v6 beta compatibility
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/chat",
        body: {
          preset: PROVIDER_TO_PRESET[provider] || "default",
        },
      }) as unknown as Parameters<typeof useChat>[0] extends { transport?: infer T } ? T : never,
    [provider]
  );

  // Use AI SDK v6 useChat hook with transport
  const { messages, sendMessage, status, error } = useChat({
    transport,
  });

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputValue.trim() || isLoading) return;

      await sendMessage({ text: inputValue });
      setInputValue("");
    },
    [inputValue, isLoading, sendMessage]
  );

  const providers = [
    { id: "openai", name: "OpenAI GPT-4", icon: "🤖" },
    { id: "claude", name: "Claude 3.5", icon: "🧠" },
    { id: "gemini", name: "Google Gemini", icon: "💎" },
    { id: "cerebras", name: "Cerebras (Fast!)", icon: "⚡" },
  ];

  // Extract text content from message parts
  const getMessageText = (message: UIMessage): string => {
    if (!message.parts) return "";
    return message.parts
      .filter((part): part is { type: "text"; text: string } => part.type === "text")
      .map((part) => part.text)
      .join("");
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>AI Chat Demo - AI SDK v6</CardTitle>
        <div className="mt-4 flex gap-2">
          {providers.map((p) => (
            <Button
              key={p.id}
              onClick={() => setProvider(p.id)}
              size="sm"
              variant={provider === p.id ? "default" : "outline"}
            >
              {p.icon} {p.name}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="h-[400px] space-y-4 overflow-y-auto rounded-lg bg-muted p-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground">
                Send a message to start chatting with{" "}
                {providers.find((p) => p.id === provider)?.name}
              </div>
            )}

            {(messages as UIMessage[]).map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card"
                  }`}
                >
                  <div className="mb-1 text-xs font-semibold">
                    {message.role === "user"
                      ? "You"
                      : providers.find((p) => p.id === provider)?.name}
                  </div>
                  <div className="whitespace-pre-wrap">
                    {getMessageText(message)}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-card p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-sm text-muted-foreground">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form className="flex gap-2" onSubmit={handleSubmit}>
            <Input
              className="flex-1"
              disabled={isLoading}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              value={inputValue}
            />
            <Button disabled={isLoading || !inputValue.trim()} type="submit">
              Send
            </Button>
          </form>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-destructive text-sm">
              Error: {error.message}
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Using{" "}
            <strong>{providers.find((p) => p.id === provider)?.name}</strong>{" "}
            via AI Gateway
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
