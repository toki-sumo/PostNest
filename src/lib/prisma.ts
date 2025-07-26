// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// グローバルに PrismaClient をキャッシュ（開発環境用）
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ['query'], // 任意：DBクエリのログ出力（開発中のみ役立つ）
    })

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}
