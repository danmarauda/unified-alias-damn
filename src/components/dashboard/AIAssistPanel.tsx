"use client";

import {
  Archive,
  ArrowUp,
  Brain,
  Check,
  Copy,
  RefreshCw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}

interface Suggestion {
  id: string;
  text: string;
}

interface AIAssistPanelProps {
  context?: string;
  onSuggestionSelect?: (suggestion: string) => void;
}

const SYSTEM_MESSAGE = `You are the ALIAS AEOS AI assistant, integrated into the Super Admin Console. You help users with:
- Project management and analysis
- Ontology design and entity creation
- Data model optimization
- AI agent configuration and coordination
- Business process flow and automation
- Code generation and architecture suggestions

Be concise but helpful. Focus on actionable insights for the user's enterprise software development needs.`;

const DEFAULT_SUGGESTIONS: Suggestion[] = [
  { id: "s1", text: "Generate an ontology entity" },
  { id: "s2", text: "Create a project timeline" },
  { id: "s3", text: "Analyze my project's architecture" },
  { id: "s4", text: "Suggest improvements for my data model" },
];

const FOLLOW_UP_SUGGESTIONS: Suggestion[] = [
  { id: "sf1", text: "Show me the changes" },
  { id: "sf2", text: "Generate code for this" },
  { id: "sf3", text: "Export this to my ontology" },
  { id: "sf4", text: "Create a visualization" },
];

export function AIAssistPanel({
  context,
  onSuggestionSelect,
}: AIAssistPanelProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your ALIAS AEOS AI assistant. How can I help you with your project today?",
      createdAt: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [suggestions, setSuggestions] =
    useState<Suggestion[]>(DEFAULT_SUGGESTIONS);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message to AI backend
  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setError(null);

    // Update suggestions after user sends a message
    setSuggestions(FOLLOW_UP_SUGGESTIONS);

    try {
      // Prepare messages for the API
      const apiMessages = [
        { role: "system" as const, content: SYSTEM_MESSAGE + (context ? `\n\nCurrent context: ${context}` : "") },
        ...messages.filter(m => m.role !== "system").map(m => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: userMessage },
      ];

      const response = await fetch("/api/ai-demo/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, provider: "openai" }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      if (reader) {
        const assistantMsgId = (Date.now() + 1).toString();

        // Add placeholder message for streaming
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMsgId,
            role: "assistant",
            content: "",
            createdAt: new Date(),
          },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantContent += chunk;

          // Update the assistant message as we receive chunks
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, content: assistantContent }
                : msg
            )
          );
        }
      }
    } catch (err) {
      console.error("AI request failed:", err);
      setError(err instanceof Error ? err.message : "Failed to get response");
    } finally {
      setIsLoading(false);
    }
  }, [context, messages]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: Suggestion) => {
    setInput(suggestion.text);
    onSuggestionSelect?.(suggestion.text);
  };

  // Handle copy message
  const handleCopyMessage = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Retry on error
  const handleRetry = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
    if (lastUserMsg) {
      // Remove failed messages and retry
      setMessages(prev => prev.slice(0, -1));
      sendMessage(lastUserMsg.content);
    }
  };

  return (
    <Card className="flex h-full flex-col border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center font-normal text-base">
          <Brain className="mr-2 h-5 w-5 text-primary" />
          AI Assistant
        </CardTitle>
        <Button className="h-8 w-8" size="icon" variant="ghost">
          <Archive className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-3">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              key={message.id}
            >
              <div
                className={`group relative max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className="mt-1 text-xs opacity-70">
                  {message.createdAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                {message.role === "assistant" && message.content && (
                  <Button
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() =>
                      handleCopyMessage(message.id, message.content)
                    }
                    size="icon"
                    variant="ghost"
                  >
                    {copiedId === message.id ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-lg bg-secondary px-3 py-2 text-sm">
                <RefreshCw className="h-4 w-4 animate-spin text-primary" />
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  <span>Failed to get response. </span>
                  <Button
                    className="h-auto p-0 text-destructive underline"
                    onClick={handleRetry}
                    size="sm"
                    variant="link"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <div className="border-border border-t p-3">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              className="rounded-full bg-primary/10 px-2 py-1 text-primary text-xs transition-colors hover:bg-primary/20"
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              type="button"
            >
              <Sparkles className="mr-1 inline-block h-3 w-3" />
              {suggestion.text}
            </button>
          ))}
        </div>

        <form className="flex gap-2" onSubmit={handleSubmit}>
          <Input
            className="flex-grow border-muted bg-background"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the AEOS assistant..."
            value={input}
            disabled={isLoading}
          />
          <Button
            className="bg-primary text-primary-foreground"
            disabled={isLoading || !input.trim()}
            type="submit"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
