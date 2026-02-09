import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getSource, updateSourceSyncTime } from "@/services/source";
import { createSlackClient, getSlackChannels, getChannelMessages, formatSlackMessages } from "@/lib/slack/client";
import { embedAndStoreChunks } from "@/lib/ai/embeddings";
import { db } from "@/lib/db";
import { rateLimitResponse } from "@/lib/rate-limit";
import { errorResponse, unauthorizedResponse } from "@/lib/api-error";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return unauthorizedResponse();
    }

    const limited = rateLimitResponse(session.user.id, "sync");
    if (limited) return limited;

    const { sourceId } = await req.json();
    const source = await getSource(sourceId, session.user.id);

    if (!source || source.type !== "slack") {
      return Response.json({ error: "Source not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const channels = await getSlackChannels(source.accessToken);
    const client = createSlackClient(source.accessToken);
    let totalChunks = 0;
    let channelsSynced = 0;

    for (const channel of channels) {
      if (!channel.id || !channel.name) continue;

      try {
        // Join the channel if not already a member
        if (!channel.is_member) {
          try {
            await client.conversations.join({ channel: channel.id });
          } catch {
            // Can't join (e.g. private channel) — skip
            continue;
          }
        }

        const messages = await getChannelMessages(source.accessToken, channel.id);
        const content = formatSlackMessages(messages, channel.name);

        if (!content.trim()) continue;

        const docId = `slack-${channel.id}`;

        const document = await db.document.upsert({
          where: { id: docId },
          create: {
            id: docId,
            title: `#${channel.name}`,
            content,
            sourceId: source.id,
            metadata: {
              channelId: channel.id,
              channelName: channel.name,
              messageCount: messages.length,
            },
          },
          update: {
            content,
            metadata: {
              channelId: channel.id,
              channelName: channel.name,
              messageCount: messages.length,
            },
          },
        });

        await db.documentChunk.deleteMany({ where: { documentId: document.id } });

        const chunkCount = await embedAndStoreChunks(document.id, content, {
          channelName: channel.name,
          sourceType: "slack",
        });
        totalChunks += chunkCount;
        channelsSynced++;
      } catch (error) {
        console.warn(`Skipping channel #${channel.name}:`, error instanceof Error ? error.message : error);
      }
    }

    await updateSourceSyncTime(source.id);

    return Response.json({
      success: true,
      channelsProcessed: channelsSynced,
      chunksCreated: totalChunks,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
