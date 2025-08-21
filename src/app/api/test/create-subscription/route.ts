import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  // 開発環境でのみ許可
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'このエンドポイントは開発環境でのみ使用できます' },
      { status: 403 }
    );
  }

  try {
    // セッションを確認
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const { articleId, amount = 1000 } = await request.json();

    if (!articleId) {
      return NextResponse.json(
        { error: '記事IDが必要です' },
        { status: 400 }
      );
    }

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

    if (!article.isPremium) {
      return NextResponse.json(
        { error: '無料記事には購読できません' },
        { status: 400 }
      );
    }

    // 既存の購読を確認
    const existingSubscription = await db.subscription.findUnique({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId: articleId
        }
      }
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: '既に購読済みです' },
        { status: 400 }
      );
    }

    // 購読を作成
    const subscription = await db.subscription.create({
      data: {
        userId: session.user.id,
        articleId: articleId,
        amount: amount,
        status: 'completed',
        stripeSessionId: 'test_session_' + Date.now(),
        stripePaymentIntentId: 'test_payment_' + Date.now()
      }
    });

    return NextResponse.json({
      message: 'テスト用購読を作成しました',
      subscription: {
        id: subscription.id,
        userId: subscription.userId,
        articleId: subscription.articleId,
        amount: subscription.amount,
        status: subscription.status,
        createdAt: subscription.createdAt
      }
    });

  } catch (error) {
    console.error('テスト購読作成エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
