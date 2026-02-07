import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getSource, updateSourceSyncTime } from "@/services/source";
import { getNotionPages, getPageContent, getPageTitle } from "@/lib/notion/client";
import { embedAndStoreChunks } from "@/lib/ai/embeddings";
import { db } from "@/lib/db";
import { rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const limited = rateLimitResponse(session.user.id, "sync");
    if (limited) return limited;

    const { sourceId } = await req.json();
    const source = await getSource(sourceId, session.user.id);

    if (!source || source.type !== "notion") {
      return Response.json({ error: "Source not found" }, { status: 404 });
    }

    const pages = await getNotionPages(source.accessToken);
    let totalChunks = 0;

    for (const page of pages) {
      const title = getPageTitle(page);
      const content = await getPageContent(source.accessToken, page.id, page);

      if (!content.trim()) continue;

      // Upsert document
      const document = await db.document.upsert({
        where: { id: page.id },
        create: {
          id: page.id,
          title,
          content,
          sourceId: source.id,
          metadata: { url: page.url, lastEditedTime: page.last_edited_time },
        },
        update: {
          title,
          content,
          metadata: { url: page.url, lastEditedTime: page.last_edited_time },
        },
      });

      // Clear existing chunks
      await db.documentChunk.deleteMany({ where: { documentId: document.id } });

      // Re-embed
      const chunkCount = await embedAndStoreChunks(document.id, content, {
        url: page.url,
        title,
        sourceType: "notion",
      });
      totalChunks += chunkCount;
    }

    await updateSourceSyncTime(source.id);

    return Response.json({
      success: true,
      pagesProcessed: pages.length,
      chunksCreated: totalChunks,
    });
  } catch (error) {
    console.error("Notion sync error:", error);
    return Response.json({ error: "Sync failed" }, { status: 500 });
  }
}
