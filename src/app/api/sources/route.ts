import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserSources, deleteSource } from "@/services/source";
import { rateLimitResponse } from "@/lib/rate-limit";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const limited = rateLimitResponse(session.user.id, "default");
    if (limited) return limited;

    const sources = await getUserSources(session.user.id);
    return Response.json(sources);
  } catch (error) {
    console.error("Get sources error:", error);
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
      return Response.json({ error: "Source ID required" }, { status: 400 });
    }

    await deleteSource(id, session.user.id);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete source error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
