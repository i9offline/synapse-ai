import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createSource } from "@/services/source";
import { getSlackTeamInfo } from "@/lib/slack/client";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  const redirectUri = `${url.origin}/api/sources/slack/connect`;

  if (!code) {
    const clientId = process.env.SLACK_CLIENT_ID;
    const scopes = "channels:history,channels:read,channels:join,groups:history,groups:read,team:read";
    const authUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    return NextResponse.redirect(authUrl);
  }

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.redirect(new URL("/sign-in", url.origin));
    }

    const tokenRes = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.SLACK_CLIENT_ID!,
        client_secret: process.env.SLACK_CLIENT_SECRET!,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.ok) {
      console.error("Slack OAuth error:", tokenData.error);
      return NextResponse.redirect(new URL("/sources?error=slack_auth_failed", url.origin));
    }

    const teamInfo = await getSlackTeamInfo(tokenData.access_token);

    const source = await createSource(
      session.user.id,
      "slack",
      teamInfo?.name || "Slack Workspace",
      tokenData.access_token,
      {
        teamId: tokenData.team?.id,
        botUserId: tokenData.bot_user_id,
      }
    );

    return NextResponse.redirect(new URL(`/sources?success=slack_connected&sync=${source.id}`, url.origin));
  } catch (error) {
    console.error("Slack connect error:", error);
    return NextResponse.redirect(new URL("/sources?error=slack_connect_failed", url.origin));
  }
}
