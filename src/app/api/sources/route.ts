import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserSources, deleteSource } from "@/services/source";
import { rateLimitResponse } from "@/lib/rate-limit";
import { errorResponse, unauthorizedResponse } from "@/lib/api-error";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return unauthorizedResponse();
    }

    const limited = rateLimitResponse(session.user.id, "default");
    if (limited) return limited;

    const sources = await getUserSources(session.user.id);
    return Response.json(sources);
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
      return Response.json({ error: "Source ID required", code: "BAD_REQUEST" }, { status: 400 });
    }

    await deleteSource(id, session.user.id);
    return Response.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
