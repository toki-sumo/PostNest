import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // セッションを確認
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const articleId = params.id;

    // 記事の存在確認
    const article = await db.article.findUnique({
      where: { id: articleId },
      select: { id: true, isPremium: true }
    });

    if (!article) {
      return NextResponse.json(
        { error: '記事が見つかりません' },
        { status: 404 }
      );
    }

    // 無料記事の場合は購読不要
    if (!article.isPremium) {
      return NextResponse.json({
        isSubscribed: true,
        message: '無料記事です'
      });
    }

    // 購読状態を確認
    const subscription = await db.subscription.findUnique({
      where: {
        userId_articleId: {
          userId: userId,
          articleId: articleId
        }
      },
      select: {
        id: true,
        status: true,
        amount: true,
        createdAt: true
      }
    });

    // 購読済みで完了状態の場合のみtrue
    const isSubscribed = subscription?.status === 'completed';

    return NextResponse.json({
      isSubscribed,
      subscription: subscription ? {
        id: subscription.id,
        status: subscription.status,
        amount: subscription.amount,
        createdAt: subscription.createdAt
      } : null,
      message: isSubscribed ? '購読済みです' : '未購読です'
    });

  } catch (error) {
    console.error('購読状態確認エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
