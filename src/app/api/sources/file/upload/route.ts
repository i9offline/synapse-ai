import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createSource, updateSourceSyncTime } from "@/services/source";
import { embedAndStoreChunks } from "@/lib/ai/embeddings";
import { db } from "@/lib/db";
import { rateLimitResponse } from "@/lib/rate-limit";
import {
  validateFile,
  parseFileToText,
  FileValidationError,
} from "@/lib/files/parser";

const MAX_FILES = 10;

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const limited = rateLimitResponse(session.user.id, "upload");
    if (limited) return limited;

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return Response.json({ error: "No files provided" }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return Response.json(
        { error: `Maximum ${MAX_FILES} files per upload` },
        { status: 400 }
      );
    }

    for (const file of files) {
      try {
        validateFile(file);
      } catch (error) {
        if (error instanceof FileValidationError) {
          return Response.json({ error: error.message }, { status: 400 });
        }
        throw error;
      }
    }

    const sourceName =
      files.length === 1
        ? files[0].name
        : `${files.length} files uploaded`;

    const source = await createSource(
      session.user.id,
      "file",
      sourceName,
      "local",
      { fileCount: files.length, fileNames: files.map((f) => f.name) }
    );

    let totalChunks = 0;

    for (const file of files) {
      let content: string;
      try {
        content = await parseFileToText(file);
      } catch (error) {
        if (error instanceof FileValidationError) {
          return Response.json({ error: error.message }, { status: 400 });
        }
        throw error;
      }
      if (!content.trim()) continue;

      const document = await db.document.create({
        data: {
          title: file.name,
          content,
          sourceId: source.id,
          metadata: {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type || "unknown",
          },
        },
      });

      const chunkCount = await embedAndStoreChunks(document.id, content, {
        title: file.name,
        sourceType: "file",
        fileName: file.name,
      });
      totalChunks += chunkCount;
    }

    await updateSourceSyncTime(source.id);

    return Response.json({
      success: true,
      sourceId: source.id,
      filesProcessed: files.length,
      chunksCreated: totalChunks,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
