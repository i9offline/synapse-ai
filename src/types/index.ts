export type MessageRole = "user" | "assistant" | "system";

export interface Citation {
  sourceType: "notion" | "slack";
  sourceName: string;
  documentTitle: string;
  chunk: string;
  score: number;
  url?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  citations?: Citation[];
  createdAt: Date;
}

export interface ConversationWithMessages {
  id: string;
  title: string;
  model: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SourceInfo {
  id: string;
  type: "notion" | "slack";
  name: string;
  documentCount: number;
  syncedAt: Date | null;
  createdAt: Date;
}

export type AIModel = "gpt-4o" | "claude-sonnet-4-5-20250929";

export const AI_MODELS: { id: AIModel; name: string; provider: string }[] = [
  { id: "gpt-4o", name: "GPT-4o", provider: "openai" },
  { id: "claude-sonnet-4-5-20250929", name: "Claude Sonnet 4.5", provider: "anthropic" },
];
