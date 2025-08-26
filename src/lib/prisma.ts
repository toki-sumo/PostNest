// src/lib/prisma.ts
// 統一: `db` を単一の PrismaClient インスタンスとして使用し、
// 既存の `prisma` インポートも壊さないようエイリアスを提供
import { db } from "./db";

export const prisma = db;

export default prisma;
