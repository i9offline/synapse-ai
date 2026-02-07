import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createSource } from "@/services/source";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  const redirectUri = `${url.origin}/api/sources/notion/connect`;

  if (!code) {
    const clientId = process.env.NOTION_CLIENT_ID;
    const authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri)}`;
    return NextResponse.redirect(authUrl);
  }

  // Exchange code for access token
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.redirect(new URL("/sign-in", url.origin));
    }

    const tokenRes = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      console.error("Notion OAuth error:", await tokenRes.text());
      return NextResponse.redirect(new URL("/sources?error=notion_auth_failed", url.origin));
    }

    const tokenData = await tokenRes.json();

    const source = await createSource(
      session.user.id,
      "notion",
      tokenData.workspace_name || "Notion Workspace",
      tokenData.access_token,
      {
        workspaceId: tokenData.workspace_id,
        botId: tokenData.bot_id,
      }
    );

    return NextResponse.redirect(new URL(`/sources?success=notion_connected&sync=${source.id}`, url.origin));
  } catch (error) {
    console.error("Notion connect error:", error);
    return NextResponse.redirect(new URL("/sources?error=notion_connect_failed", url.origin));
  }
}
