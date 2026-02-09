import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getConversation, updateConversationTitle, deleteConversation } from "@/services/conversation";
import { NextRequest } from "next/server";
import { rateLimitResponse } from "@/lib/rate-limit";
import { errorResponse, unauthorizedResponse } from "@/lib/api-error";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return unauthorizedResponse();
    }

    const limited = rateLimitResponse(session.user.id, "default");
    if (limited) return limited;

    const { id } = await params;
    const conversation = await getConversation(id, session.user.id);

    if (!conversation) {
      return Response.json({ error: "Not found", code: "NOT_FOUND" }, { status: 404 });
    }

    return Response.json(conversation);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return unauthorizedResponse();
    }

    const limited = rateLimitResponse(session.user.id, "default");
    if (limited) return limited;

    const { id } = await params;
    const { title } = await req.json();

    const conversation = await updateConversationTitle(id, session.user.id, title);
    return Response.json(conversation);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return unauthorizedResponse();
    }

    const limited = rateLimitResponse(session.user.id, "default");
    if (limited) return limited;

    const { id } = await params;
    await deleteConversation(id, session.user.id);
    return Response.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
