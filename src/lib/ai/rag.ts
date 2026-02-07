import { db } from "@/lib/db";
import { generateEmbedding } from "./embeddings";
import type { Citation } from "@/types";

interface RetrievedChunk {
  content: string;
  score: number;
  documentTitle: string;
  sourceType: string;
  sourceName: string;
  metadata: Record<string, unknown> | null;
}

export async function retrieveRelevantChunks(
  query: string,
  userId: string,
  topK: number = 8
): Promise<RetrievedChunk[]> {
  const queryEmbedding = await generateEmbedding(query);
  const vectorStr = `[${queryEmbedding.join(",")}]`;

  const minScore = 0.2;

  const results = await db.$queryRaw<RetrievedChunk[]>`
    SELECT
      dc.content,
      1 - (dc.embedding <=> ${vectorStr}::vector) as score,
      d.title as "documentTitle",
      s.type as "sourceType",
      s.name as "sourceName",
      dc.metadata
    FROM "DocumentChunk" dc
    JOIN "Document" d ON dc."documentId" = d.id
    JOIN "Source" s ON d."sourceId" = s.id
    WHERE s."userId" = ${userId}
      AND dc.embedding IS NOT NULL
      AND 1 - (dc.embedding <=> ${vectorStr}::vector) > ${minScore}
    ORDER BY dc.embedding <=> ${vectorStr}::vector
    LIMIT ${topK}
  `;

  return results;
}

export function buildRAGContext(chunks: RetrievedChunk[]): {
  contextText: string;
  citations: Citation[];
} {
  if (chunks.length === 0) {
    return { contextText: "", citations: [] };
  }

  // Only use RAG context if the best match is actually relevant
  const topScore = Math.max(...chunks.map((c) => Number(c.score)));
  if (topScore < 0.35) {
    return { contextText: "", citations: [] };
  }

  const citations: Citation[] = chunks.map((chunk) => ({
    sourceType: chunk.sourceType as "notion" | "slack" | "file",
    sourceName: chunk.sourceName,
    documentTitle: chunk.documentTitle,
    chunk: chunk.content.slice(0, 200),
    score: Number(chunk.score),
    url: (chunk.metadata as Record<string, string>)?.url,
  }));

  const contextText = chunks
    .map(
      (chunk, i) =>
        `[Source ${i + 1}: ${chunk.sourceType}/${chunk.sourceName} - "${chunk.documentTitle}" (relevance: ${Math.round(Number(chunk.score) * 100)}%)]\n${chunk.content}`
    )
    .join("\n\n");

  return { contextText, citations };
}

export function buildSystemPrompt(contextText: string): string {
  const basePrompt =
    "You are SynapseAI, an intelligent AI assistant. You are helpful, concise, and accurate.";

  if (!contextText) {
    return basePrompt;
  }

  return `${basePrompt}

You have access to the following context from the user's connected sources (Notion, Slack, uploaded files). Use this information to answer their questions accurately. When you use information from the context, mention the source.

--- CONTEXT ---
${contextText}
--- END CONTEXT ---

Instructions:
- Use the context above to answer the user's question when relevant.
- If the context doesn't contain relevant information, answer based on your general knowledge and say you don't have that specific data.
- When citing sources, reference them naturally (e.g., "According to your Notion page...").
- Include ALL relevant details from the context - do not summarize or skip information.
- Be concise and helpful.`;
}
