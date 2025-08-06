// src/app/api/articles/user/route.ts
import { auth } from "@/auth" // auth.jsの設定ファイル
import { NextResponse } from "next/server"
import { db } from "@/lib/db" // Prisma Client

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const articles = await db.article.findMany({
    where: {
      authorId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  return NextResponse.json(articles)
}
