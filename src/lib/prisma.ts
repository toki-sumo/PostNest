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
        log: ['query'], // 開発中の DB クエリログ
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
