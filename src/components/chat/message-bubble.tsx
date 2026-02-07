"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { SourceCitations } from "./source-citation";
import type { Citation } from "@/types";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  isStreaming?: boolean;
}

export function MessageBubble({
  role,
  content,
  citations,
  isStreaming,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex gap-3 max-w-4xl", isUser ? "ml-auto flex-row-reverse" : "")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1",
          isUser && "bg-gray-900"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Logo size={26} />
        )}
      </div>

      {/* Message */}
      <div
        className={cn(
          "flex-1 max-w-[80%]",
          isUser ? "text-right" : ""
        )}
      >
        <div
          className={cn(
            "inline-block text-left px-4 py-3 rounded-2xl text-sm leading-relaxed",
            isUser
              ? "bg-gray-900 text-white"
              : "bg-gray-50 border border-gray-200"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 text-gray-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
              {isStreaming && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-gray-900 ml-1 rounded-sm"
                />
              )}
            </div>
          )}
        </div>

        {!isUser && citations && <SourceCitations citations={citations} />}
      </div>
    </motion.div>
  );
}
