import { db } from "@/lib/db";

export async function getUserSources(userId: string) {
  return db.source.findMany({
    where: { userId },
    include: {
      _count: { select: { documents: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSource(id: string, userId: string) {
  return db.source.findFirst({
    where: { id, userId },
    include: {
      documents: {
        include: {
          _count: { select: { chunks: true } },
        },
      },
    },
  });
}

export async function createSource(
  userId: string,
  type: string,
  name: string,
  accessToken: string,
  metadata?: Record<string, unknown>
) {
  return db.source.create({
    data: {
      userId,
      type,
      name,
      accessToken,
      metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
    },
  });
}

export async function deleteSource(id: string, userId: string) {
  return db.source.delete({
    where: { id, userId },
  });
}

export async function updateSourceSyncTime(id: string) {
  return db.source.update({
    where: { id },
    data: { syncedAt: new Date() },
  });
}
