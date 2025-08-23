// src/app/api/articles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth"

export async function GET() {
  try {
    const session = await auth()
    const isAdmin = (session?.user as any)?.role === 'Admin'

    const articles = await db.article.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        tags: true,
        imageUrl: true,
        isPremium: true,
        price: true,
        authorId: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    
    // 管理者は全件返す。一般ユーザーでも一覧は公開仕様のため、このまま返却
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    // フェイルセーフ：エラーでも空配列を返し、UI を壊さない
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "認証が必要です" }, { status: 401 });
  }

  try {
    // CSRF: 同一オリジンのみ許可
    const origin = req.headers.get('origin')
    const host = req.headers.get('host')
    if (!origin || !host || new URL(origin).host !== host) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
    }

    const body = await req.json();
    const { title, content, tags, imageUrl, isPremium, price } = body;
    const authorId = session.user.id;

    if (!title || !content || !authorId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (tags && !Array.isArray(tags)) {
      return NextResponse.json({ error: 'Tags must be an array' }, { status: 400 });
    }

    // 有料記事の場合は価格のバリデーション（Stripeの最小金額: 50円）
    if (isPremium) {
      if (!price || price < 50) {
        return NextResponse.json({ error: '有料記事の最低価格は50円です' }, { status: 400 });
      }
    }

    const article = await db.article.create({
      data: {
        title,
        content,
        authorId,
        tags: tags || [],
        imageUrl,
        isPremium: isPremium || false,
        price: isPremium ? price : null,
      },
    });

    console.log('記事作成成功:', article); // デバッグログ追加

    return NextResponse.json(article);
  } catch (error) {
    console.error('記事作成エラー:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
