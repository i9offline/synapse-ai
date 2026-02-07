import { embed } from "ai";
import { getEmbeddingModel } from "./providers";
import { db } from "@/lib/db";

const CHUNK_SIZE = 200;
const CHUNK_OVERLAP = 50;

export function chunkText(text: string, docTitle?: string): string[] {
  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  let currentChunk: string[] = [];
  let currentLength = 0;

  for (const para of paragraphs) {
    const words = para.split(/\s+/).filter(Boolean);

    for (const word of words) {
      currentChunk.push(word);
      currentLength++;

      if (currentLength >= CHUNK_SIZE) {
        let chunkText = currentChunk.join(" ").trim();
        if (docTitle) {
          chunkText = `[${docTitle}]\n${chunkText}`;
        }
        if (chunkText) chunks.push(chunkText);

        // Keep last CHUNK_OVERLAP words for context continuity
        currentChunk = currentChunk.slice(-CHUNK_OVERLAP);
        currentLength = currentChunk.length;
      }
    }
  }

  // Remaining content
  if (currentChunk.length > 0) {
    let chunkText = currentChunk.join(" ").trim();
    if (docTitle) {
      chunkText = `[${docTitle}]\n${chunkText}`;
    }
    if (chunkText) chunks.push(chunkText);
  }

  return chunks;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: getEmbeddingModel(),
    value: text,
  });
  return embedding;
}

export async function embedAndStoreChunks(
  documentId: string,
  content: string,
  metadata?: Record<string, unknown>
) {
  const title = metadata?.title as string | undefined;
  const chunks = chunkText(content, title);

  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk);
    const vectorStr = `[${embedding.join(",")}]`;

    await db.$executeRaw`
      INSERT INTO "DocumentChunk" (id, content, embedding, "documentId", metadata)
      VALUES (
        ${crypto.randomUUID()},
        ${chunk},
        ${vectorStr}::vector,
        ${documentId},
        ${JSON.stringify(metadata ?? {})}::jsonb
      )
    `;
  }

  return chunks.length;
}
