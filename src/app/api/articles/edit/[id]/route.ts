// app/api/articles/[id]/route.ts

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { title, content } = await req.json()

  if (!title || !content) {
    return new NextResponse("Title and content are required", { status: 400 })
  }

  const article = await db.article.findUnique({
    where: { id: (await params).id },
  })

  if (!article || article.authorId !== session.user.id) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const updated = await db.article.update({
    where: { id: (await params).id },
    data: {
      title,
      content,
    },
  })

  return NextResponse.json(updated)
}
