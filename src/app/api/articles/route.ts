// src/app/api/articles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth"

export async function GET() {
  try {
    const articles = await db.article.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "認証が必要です" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, content, tags, imageUrl } = body;
    const authorId = session.user.id;

    if (!title || !content || !authorId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (tags && !Array.isArray(tags)) {
      return NextResponse.json({ error: 'Tags must be an array' }, { status: 400 });
    }

    const article = await db.article.create({
      data: {
        title,
        content,
        authorId,
        tags: tags || [],
        imageUrl,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('記事作成エラー:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
