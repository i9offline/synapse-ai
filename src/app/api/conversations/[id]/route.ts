import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getConversation, updateConversationTitle, deleteConversation } from "@/services/conversation";
import { NextRequest } from "next/server";
import { rateLimitResponse } from "@/lib/rate-limit";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const limited = rateLimitResponse(session.user.id, "default");
    if (limited) return limited;

    const { id } = await params;
    const conversation = await getConversation(id, session.user.id);

    if (!conversation) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(conversation);
  } catch (error) {
    console.error("Get conversation error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const limited = rateLimitResponse(session.user.id, "default");
    if (limited) return limited;

    const { id } = await params;
    const { title } = await req.json();

    const conversation = await updateConversationTitle(id, session.user.id, title);
    return Response.json(conversation);
  } catch (error) {
    console.error("Update conversation error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const limited = rateLimitResponse(session.user.id, "default");
    if (limited) return limited;

    const { id } = await params;
    await deleteConversation(id, session.user.id);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete conversation error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
