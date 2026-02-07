import { db } from "@/lib/db";
import type { Citation } from "@/types";

export async function createMessage(
  conversationId: string,
  role: string,
  content: string,
  citations?: Citation[]
) {
  return db.message.create({
    data: {
      conversationId,
      role,
      content,
      citations: citations ? JSON.parse(JSON.stringify(citations)) : undefined,
    },
  });
}

export async function getConversationMessages(conversationId: string) {
  return db.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
}
