'use client';

import { useEffect, useState } from 'react';
import { SubscriptionWithArticle } from '@/types/model_type';
import { formatDate } from '@/lib/utils/formatDate';
import Link from 'next/link';
import Image from 'next/image';
import Spinner from '@/components/ui/Spinner';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import GlassCard from '../../../components/dashboard/GlassCard';

type SubscriptionData = {
  subscriptions: SubscriptionWithArticle[];
  statistics: {
    totalSubscriptions: number;
    totalSpent: number;
    averageSpent: number;
  };
  message: string;
};

export default function SubscriptionsPage() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch('/api/user/subscriptions');
        if (!response.ok) {
          throw new Error('購読履歴の取得に失敗しました');
        }
        const data = await response.json();
        setSubscriptionData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Spinner size={16} />
          <p className="text-[var(--text)]/85 mt-4">購読履歴を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-2xl p-6 max-w-md mx-auto border bg-red-50 border-red-200">
          <svg className="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-bold text-red-700 mb-2">エラーが発生しました</h3>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DashboardHeader title="購読履歴" subtitle="あなたが購読した有料記事の履歴と統計情報を確認できます" />

      {/* 統計情報 */}
      {subscriptionData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[color:var(--muted)]/15">
              <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--primary)] mb-2">
              {subscriptionData.statistics.totalSubscriptions}
            </h3>
            <p className="text-[var(--muted)] text-sm">購読記事数</p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[color:var(--muted)]/15">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-700 mb-2">
              ¥{subscriptionData.statistics.totalSpent.toLocaleString()}
            </h3>
            <p className="text-[var(--muted)] text-sm">総支払額</p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[color:var(--muted)]/15">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-yellow-700 mb-2">
              ¥{subscriptionData.statistics.averageSpent.toLocaleString()}
            </h3>
            <p className="text-[var(--muted)] text-sm">平均購読額</p>
          </GlassCard>
        </div>
      )}

      {/* 購読記事一覧 */}
      <GlassCard className="p-6">
        <h2 className="text-2xl font-bold text-[var(--text)] mb-6 flex items-center">
          <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          購読済み記事一覧
        </h2>

        {subscriptionData?.subscriptions && subscriptionData.subscriptions.length > 0 ? (
          <div className="space-y-4">
            {subscriptionData.subscriptions.map((subscription) => (
              <GlassCard
                key={subscription.id}
                className="p-4 hover:border-[var(--card-hover-border)] transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  {/* 記事画像 */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-[color:var(--muted)]/20">
                      {subscription.article.imageUrl ? (
                        <Image
                          src={subscription.article.imageUrl}
                          alt={subscription.article.title}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 記事情報 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link
                          href={`/articles/${subscription.article.id}`}
                          className="text-lg font-bold text-[var(--text)] hover:text-[var(--primary)] transition-colors duration-300 line-clamp-2"
                        >
                          {subscription.article.title}
                        </Link>
                        <p className="text-[var(--muted)] text-sm mt-1">
                          投稿者: {subscription.article.author.name}
                        </p>
                        <p className="text-[var(--muted)] text-sm">
                          投稿日: {formatDate(subscription.article.createdAt)}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-yellow-700">
                          ¥{subscription.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-[var(--muted)]">
                          購読日: {formatDate(subscription.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-[color:var(--muted)]/10">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[var(--text)] mb-4">まだ購読した記事がありません</h3>
            <p className="text-[var(--text)]/85 mb-6">
              有料記事を購読すると、ここに履歴が表示されます
            </p>
            <Link
              href="/articles"
              className="inline-flex items-center px-6 py-3 font-bold rounded-xl transition-all duration-300 shadow-sm hover:scale-105 bg-[var(--primary)] text-[var(--primary-contrast)]"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              記事を探す
            </Link>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
