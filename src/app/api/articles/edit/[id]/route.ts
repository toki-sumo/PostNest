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

  try {
    const { title, content, tags, imageURL, isPremium, price } = await req.json()

    if (!title || !content) {
      return new NextResponse("Title and content are required", { status: 400 })
    }

    // 有料記事の場合は価格のバリデーション
    if (isPremium && (!price || price <= 0)) {
      return new NextResponse("有料記事の場合は価格を設定してください", { status: 400 })
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
        tags,
        imageUrl: imageURL, // imageURLをimageUrlとして保存
        isPremium: isPremium || false,
        price: isPremium ? price : null,
      },
    })

    console.log('記事更新成功:', updated); // デバッグログ追加

    return NextResponse.json(updated)
  } catch (error) {
    console.error('記事更新エラー:', error);
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
