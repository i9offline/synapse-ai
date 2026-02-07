import { streamText } from "ai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getModel } from "@/lib/ai/providers";
import { retrieveRelevantChunks, buildRAGContext, buildSystemPrompt } from "@/lib/ai/rag";
import { createMessage } from "@/services/message";
import { createConversation } from "@/services/conversation";
import { chatMessageSchema } from "@/lib/validators";
import { db } from "@/lib/db";
import type { AIModel } from "@/types";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const parsed = chatMessageSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { message, conversationId, model } = parsed.data;

    let convId = conversationId;
    if (!convId) {
      const conversation = await createConversation(
        session.user.id,
        message.slice(0, 50),
        model
      );
      convId = conversation.id;
    }

    // Verify conversation belongs to user
    const conversation = await db.conversation.findFirst({
      where: { id: convId, userId: session.user.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 20,
        },
      },
    });

    if (!conversation) {
      return Response.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Save user message
    await createMessage(convId, "user", message);

    // RAG: retrieve relevant context
    const chunks = await retrieveRelevantChunks(message, session.user.id);
    const { contextText, citations } = buildRAGContext(chunks);
    const systemPrompt = buildSystemPrompt(contextText);

    // Build message history
    const history = conversation.messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const result = streamText({
      model: getModel(model as AIModel),
      system: systemPrompt,
      messages: [...history, { role: "user" as const, content: message }],
      onFinish: async ({ text }) => {
        await createMessage(convId!, "assistant", text, citations.length > 0 ? citations : undefined);

        // Auto-generate title from first message
        if (conversation.messages.length === 0) {
          const title = message.length > 50 ? message.slice(0, 47) + "..." : message;
          await db.conversation.update({
            where: { id: convId! },
            data: { title, updatedAt: new Date() },
          });
        } else {
          await db.conversation.update({
            where: { id: convId! },
            data: { updatedAt: new Date() },
          });
        }
      },
    });

    const response = result.toTextStreamResponse();

    // Add custom headers
    response.headers.set("X-Conversation-Id", convId);
    response.headers.set("X-Citations", JSON.stringify(citations));

    return response;
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
