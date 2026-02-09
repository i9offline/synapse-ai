import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  getUserConversations,
  createConversation,
  deleteConversation,
} from "@/services/conversation";
import { createConversationSchema } from "@/lib/validators";
import { rateLimitResponse } from "@/lib/rate-limit";
import { errorResponse, unauthorizedResponse, validationErrorResponse } from "@/lib/api-error";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return unauthorizedResponse();
    }

    const limited = rateLimitResponse(session.user.id, "default");
    if (limited) return limited;

    const conversations = await getUserConversations(session.user.id);
    return Response.json(conversations);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return unauthorizedResponse();
    }

    const limited = rateLimitResponse(session.user.id, "default");
    if (limited) return limited;

    const body = await req.json();
    const parsed = createConversationSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const conversation = await createConversation(
      session.user.id,
      parsed.data.title,
      parsed.data.model
    );

    return Response.json(conversation, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return unauthorizedResponse();
    }

    const limited = rateLimitResponse(session.user.id, "default");
    if (limited) return limited;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Conversation ID required", code: "BAD_REQUEST" }, { status: 400 });
    }

    await deleteConversation(id, session.user.id);
    return Response.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
