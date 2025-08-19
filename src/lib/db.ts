// lib/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// 開発環境では PrismaClient をグローバルにキャッシュ
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // 開発中にクエリログを出したい場合
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
