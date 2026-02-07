"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2, Check, X } from "lucide-react";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { ModelSelector } from "@/components/chat/model-selector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const router = useRouter();
  const conversationId = params.id as string;
  const [model, setModel] = useState<AIModel>("gpt-4o");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationTitle, setConversationTitle] = useState("Chat");
  const [loaded, setLoaded] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");

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

  async function handleRename() {
    const trimmed = editingTitle.trim();
    if (!trimmed) {
      setIsEditing(false);
      return;
    }
    try {
      await fetch(`/api/conversations/${conversationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });
      setConversationTitle(trimmed);
    } catch (error) {
      console.error("Failed to rename:", error);
    } finally {
      setIsEditing(false);
    }
  }

  async function handleDelete() {
    try {
      await fetch(`/api/conversations?id=${conversationId}`, { method: "DELETE" });
      router.push("/chat");
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  }

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
            citations = JSON.parse(atob(citationsHeader));
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
            assistantContent += chunk;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: assistantContent }
                  : m
              )
            );
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
        {isEditing ? (
          <div className="flex items-center gap-1.5">
            <input
              autoFocus
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") setIsEditing(false);
              }}
              className="text-sm font-medium bg-white border border-gray-300 rounded-lg px-2.5 py-1 outline-none focus:border-gray-500 w-64"
            />
            <button
              onClick={handleRename}
              className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <h2 className="text-sm font-medium text-gray-900 truncate max-w-md">
            {conversationTitle}
          </h2>
        )}
        <div className="flex items-center gap-1">
          <ModelSelector value={model} onChange={setModel} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => {
                  setEditingTitle(conversationTitle);
                  setIsEditing(true);
                }}
                className="cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
