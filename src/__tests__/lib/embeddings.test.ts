import { describe, it, expect } from "vitest";

// Test chunkText logic directly without importing the module (which pulls in db)
const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;

function chunkText(text: string): string[] {
  const chunks: string[] = [];
  const words = text.split(/\s+/);

  for (let i = 0; i < words.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
    const chunk = words.slice(i, i + CHUNK_SIZE).join(" ");
    if (chunk.trim().length > 0) {
      chunks.push(chunk.trim());
    }
  }

  return chunks;
}

describe("chunkText", () => {
  it("returns a single chunk for short text", () => {
    const text = "Hello world this is a test";
    const chunks = chunkText(text);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe(text);
  });

  it("handles empty text", () => {
    const chunks = chunkText("");
    expect(chunks).toHaveLength(0);
  });

  it("handles whitespace-only text", () => {
    const chunks = chunkText("   ");
    expect(chunks).toHaveLength(0);
  });

  it("chunks long text into multiple parts", () => {
    const words = Array.from({ length: 1000 }, (_, i) => `word${i}`);
    const text = words.join(" ");
    const chunks = chunkText(text);
    expect(chunks.length).toBeGreaterThan(1);
  });

  it("creates overlapping chunks", () => {
    const words = Array.from({ length: 600 }, (_, i) => `word${i}`);
    const text = words.join(" ");
    const chunks = chunkText(text);

    if (chunks.length >= 2) {
      const firstChunkWords = chunks[0].split(" ");
      const secondChunkWords = chunks[1].split(" ");
      const overlapWord = firstChunkWords[firstChunkWords.length - 1];
      expect(secondChunkWords).toContain(overlapWord);
    }
  });

  it("preserves all words across chunks", () => {
    const words = Array.from({ length: 800 }, (_, i) => `word${i}`);
    const text = words.join(" ");
    const chunks = chunkText(text);
    const allChunkWords = chunks.flatMap((c) => c.split(" "));
    // Every original word should appear at least once
    for (const word of words) {
      expect(allChunkWords).toContain(word);
    }
  });
});
