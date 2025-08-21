import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const article = await db.article.findUnique({
      where: { id },
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
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // デフォルトはロック解除
    let locked = false;
    let maskedContent = article.content;

    if (article.isPremium) {
      const session = await auth();
      const isAuthor = !!session?.user?.id && session.user.id === article.authorId;

      if (!isAuthor) {
        // 著者でなければ購読状況を確認
        let isSubscribed = false;
        if (session?.user?.id) {
          const sub = await db.subscription.findUnique({
            where: { userId_articleId: { userId: session.user.id, articleId: id } },
            select: { status: true },
          });
          isSubscribed = sub?.status === 'completed';
        }

        if (!isSubscribed) {
          locked = true;
          // 本文を返さない（APIガード）
          maskedContent = '';
        }
      }
    }

    return NextResponse.json({ ...article, content: maskedContent, locked });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const deletedArticle = await db.article.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Article deleted successfully', deletedArticle },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Prisma の delete は存在しないIDの場合エラーを投げるので、その場合のハンドリング
    const err = error as { code?: string };
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
