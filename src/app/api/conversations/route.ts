import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  getUserConversations,
  createConversation,
  deleteConversation,
} from "@/services/conversation";
import { createConversationSchema } from "@/lib/validators";
import { rateLimitResponse } from "@/lib/rate-limit";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const limited = rateLimitResponse(session.user.id, "default");
    if (limited) return limited;

    const conversations = await getUserConversations(session.user.id);
    return Response.json(conversations);
  } catch (error) {
    console.error("Get conversations error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const limited = rateLimitResponse(session.user.id, "default");
    if (limited) return limited;

    const body = await req.json();
    const parsed = createConversationSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const conversation = await createConversation(
      session.user.id,
      parsed.data.title,
      parsed.data.model
    );

    return Response.json(conversation, { status: 201 });
  } catch (error) {
    console.error("Create conversation error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const limited = rateLimitResponse(session.user.id, "default");
    if (limited) return limited;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Conversation ID required" }, { status: 400 });
    }

    await deleteConversation(id, session.user.id);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete conversation error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
