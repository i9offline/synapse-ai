"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { MessageBubble } from "./message-bubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Citation } from "@/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

interface ChatMessagesProps {
  messages: Message[];
  isStreaming: boolean;
}

export function ChatMessages({ messages, isStreaming }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Start a conversation
          </h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm">
            Ask me anything. If you&apos;ve connected Notion or Slack, I can
            answer based on your data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <AnimatePresence>
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              role={message.role}
              content={message.content}
              citations={message.citations}
              isStreaming={
                isStreaming &&
                index === messages.length - 1 &&
                message.role === "assistant"
              }
            />
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
