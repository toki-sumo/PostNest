import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
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

    // ユーザーの購読履歴を取得
    const subscriptions = await db.subscription.findMany({
      where: {
        userId: userId,
        status: 'completed' // 完了した購読のみ
      },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            imageURL: true,
            isPremium: true,
            price: true,
            createdAt: true,
            author: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 購読統計を計算
    const totalSpent = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
    const totalSubscriptions = subscriptions.length;

    return NextResponse.json({
      subscriptions: subscriptions.map(sub => ({
        id: sub.id,
        articleId: sub.articleId,
        amount: sub.amount,
        status: sub.status,
        createdAt: sub.createdAt,
        article: sub.article
      })),
      statistics: {
        totalSubscriptions,
        totalSpent,
        averageSpent: totalSubscriptions > 0 ? Math.round(totalSpent / totalSubscriptions) : 0
      },
      message: '購読履歴を取得しました'
    });

  } catch (error) {
    console.error('購読履歴取得エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
