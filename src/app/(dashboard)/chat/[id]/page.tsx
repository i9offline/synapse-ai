"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { ModelSelector } from "@/components/chat/model-selector";
import type { AIModel, Citation } from "@/types";

interface StoredMessage {
  id: string;
  role: string;
  content: string;
  citations?: Citation[];
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const [model, setModel] = useState<AIModel>("gpt-4o");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationTitle, setConversationTitle] = useState("Chat");
  const [loaded, setLoaded] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    async function loadConversation() {
      try {
        const res = await fetch(`/api/conversations/${conversationId}`);
        if (res.ok) {
          const data = await res.json();
          setConversationTitle(data.title);
          setModel(data.model as AIModel);
          setMessages(
            data.messages.map((m: StoredMessage) => ({
              id: m.id,
              role: m.role as "user" | "assistant",
              content: m.content,
              citations: m.citations as Citation[] | undefined,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to load conversation:", error);
      } finally {
        setLoaded(true);
      }
    }
    loadConversation();
  }, [conversationId]);

  const handleSend = useCallback(
    async (content: string) => {
      // Add user message optimistically
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
          body: JSON.stringify({
            message: content,
            model,
            conversationId,
          }),
        });

        if (!res.ok) throw new Error("Chat request failed");

        const citationsHeader = res.headers.get("X-Citations");
        let citations: Citation[] | undefined;
        if (citationsHeader) {
          try {
            citations = JSON.parse(citationsHeader);
          } catch {
            // ignore
          }
        }

        // Read the streaming response
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let assistantContent = "";
        const assistantId = crypto.randomUUID();

        // Add empty assistant message
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: "", citations },
        ]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            // Parse the data stream format (Vercel AI SDK data stream)
            const lines = chunk.split("\n");
            for (const line of lines) {
              // Text parts start with '0:'
              if (line.startsWith("0:")) {
                try {
                  const text = JSON.parse(line.slice(2));
                  assistantContent += text;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId
                        ? { ...m, content: assistantContent }
                        : m
                    )
                  );
                } catch {
                  // ignore parse errors
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Chat error:", error);
      } finally {
        setIsStreaming(false);
      }
    },
    [model, conversationId]
  );

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-900 truncate max-w-md">
          {conversationTitle}
        </h2>
        <ModelSelector value={model} onChange={setModel} />
      </div>

      {/* Messages */}
      <ChatMessages messages={messages} isStreaming={isStreaming} />

      {/* Input */}
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={handleSend} isLoading={isStreaming} />
        </div>
      </div>
    </div>
  );
}
