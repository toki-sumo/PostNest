// src/lib/prisma.ts
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// PrismaClient の初期化
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        // クエリログはデフォルト無効。必要時のみ PRISMA_LOG_QUERIES=true で有効化
        log: process.env.PRISMA_LOG_QUERIES === 'true' ? ['query'] : [],
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    });

// 開発環境ではグローバルキャッシュ
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
