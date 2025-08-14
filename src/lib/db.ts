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

// lib/db.ts
// import { Pool } from "pg";

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: Number(process.env.DB_PORT),
// });

// export default pool;
