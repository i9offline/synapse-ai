import { db } from "@/lib/db";

export async function getUserConversations(userId: string) {
  return db.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: { select: { messages: true } },
    },
  });
}

export async function getConversation(id: string, userId: string) {
  return db.conversation.findFirst({
    where: { id, userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function createConversation(
  userId: string,
  title?: string,
  model?: string
) {
  return db.conversation.create({
    data: {
      userId,
      title: title || "New Chat",
      model: model || "gpt-4o",
    },
  });
}

export async function updateConversationTitle(
  id: string,
  userId: string,
  title: string
) {
  return db.conversation.update({
    where: { id, userId },
    data: { title },
  });
}

export async function deleteConversation(id: string, userId: string) {
  return db.conversation.delete({
    where: { id, userId },
  });
}
