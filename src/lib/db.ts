// lib/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// 開発環境では PrismaClient をグローバルにキャッシュ
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // クエリログはデフォルト無効。必要なときのみ PRISMA_LOG_QUERIES=true で有効化
    log: process.env.PRISMA_LOG_QUERIES === "true" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
