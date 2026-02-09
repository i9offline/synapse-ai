"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { ModelSelector } from "@/components/chat/model-selector";
import { useToast } from "@/components/ui/toaster";
import type { AIModel, Citation } from "@/types";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

export default function ChatPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [model, setModel] = useState<AIModel>("gpt-4o");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSend = useCallback(
    async (content: string) => {
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsStreaming(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content, model }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          const errorMsg =
            res.status === 429
              ? "Too many requests. Please wait a moment."
              : data?.error || "Failed to send message";
          toast("error", errorMsg);
          setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
          return;
        }

        const convId = res.headers.get("X-Conversation-Id");
        const citationsHeader = res.headers.get("X-Citations");
        let citations: Citation[] | undefined;
        if (citationsHeader) {
          try {
            citations = JSON.parse(atob(citationsHeader));
          } catch {
            // ignore
          }
        }

        // Read streaming response
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let assistantContent = "";
        const assistantId = crypto.randomUUID();

        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: "", citations },
        ]);

        if (reader) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value, { stream: true });
              assistantContent += chunk;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: assistantContent }
                    : m
                )
              );
            }
          } catch {
            toast("error", "Connection lost during response. Please try again.");
          }
        }

        // Navigate to conversation
        if (convId) {
          router.push(`/chat/${convId}`);
        }
      } catch {
        toast("error", "Failed to send message. Check your connection.");
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      } finally {
        setIsStreaming(false);
      }
    },
    [model, router, toast]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-500">New Chat</h2>
        <ModelSelector value={model} onChange={setModel} />
      </div>

      <ChatMessages messages={messages} isStreaming={isStreaming} />

      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={handleSend} isLoading={isStreaming} />
        </div>
      </div>
    </div>
  );
}
