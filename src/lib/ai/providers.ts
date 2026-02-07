import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import type { AIModel } from "@/types";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export function getModel(modelId: AIModel) {
  switch (modelId) {
    case "gpt-4o":
      return openai("gpt-4o");
    case "claude-sonnet-4-5-20250929":
      return anthropic("claude-sonnet-4-5-20250929");
    default:
      return openai("gpt-4o");
  }
}

export function getEmbeddingModel() {
  return openai.embedding("text-embedding-3-small");
}
