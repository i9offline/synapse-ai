import { WebClient } from "@slack/web-api";

export function createSlackClient(accessToken: string) {
  return new WebClient(accessToken);
}

export async function getSlackChannels(accessToken: string) {
  const client = createSlackClient(accessToken);
  const result = await client.conversations.list({
    types: "public_channel,private_channel",
    limit: 100,
  });
  return result.channels || [];
}

export async function getChannelMessages(
  accessToken: string,
  channelId: string,
  limit: number = 200
) {
  const client = createSlackClient(accessToken);
  const result = await client.conversations.history({
    channel: channelId,
    limit,
  });
  return result.messages || [];
}

export async function getSlackTeamInfo(accessToken: string) {
  const client = createSlackClient(accessToken);
  const result = await client.team.info();
  return result.team;
}

export function formatSlackMessages(
  messages: Array<{ text?: string; user?: string; ts?: string }>,
  channelName: string
): string {
  return messages
    .filter((m) => m.text)
    .map((m) => `[${channelName}] ${m.user || "unknown"}: ${m.text}`)
    .join("\n");
}
