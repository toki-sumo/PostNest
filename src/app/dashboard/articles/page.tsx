'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { formatDate } from "@/lib/utils/formatDate"
import DashboardHeader from "../../../components/dashboard/DashboardHeader"
import GlassCard from "../../../components/dashboard/GlassCard"
import EmptyState from "../../../components/ui/EmptyState"

// 型の整合（idはcuidのstring）
type Article = {
  id: string
  title: string
  content?: string
  updatedAt?: string
  tags?: string[]
}

const PAGE_SIZE = 6

const ArticlesPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
      return
    }

    if (status === 'authenticated') {
      const controller = new AbortController()
      const fetchArticles = async () => {
        try {
          setLoading(true)
          const res = await fetch('/api/articles/user', { signal: controller.signal })
          if (!res.ok) throw new Error('Failed to fetch')
          const data: unknown = await res.json()
          if (!Array.isArray(data)) {
            setArticles([])
            return
          }
          setArticles(data as Article[])
        } catch (error) {
          const err = error as { name?: string }
          if (err?.name !== 'AbortError') {
            console.error('記事の取得に失敗しました', error)
          }
        } finally {
          setLoading(false)
        }
      }

      fetchArticles()
      return () => controller.abort()
    }
  }, [status, router])

  const displayed = articles.slice(0, visibleCount)
  const hasMore = visibleCount < articles.length

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
            <p className="text-[var(--text)]/85">読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DashboardHeader title="投稿記事" subtitle={`${session?.user?.name ?? ''} さんが投稿した記事`} />

      {/* 記事一覧 */}
      <div className="space-y-6">
        {displayed.length > 0 ? (
          displayed.map((article) => (
            <GlassCard
              key={article.id}
              className="group p-6 transition-all duration-500 cursor-pointer transform hover:scale-[1.02] hover:border-[var(--card-hover-border)] hover:shadow-2xl"
              onClick={() => router.push(`/articles/${article.id}`)}
            >
              <div className="space-y-4">
                {/* タイトル */}
                <h2 className="text-xl lg:text-2xl font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors duration-300 line-clamp-2">
                  {article.title}
                </h2>

                {/* 内容 */}
                {article.content && (
                  <p className="text-[var(--text)]/85 text-base lg:text-lg line-clamp-2 leading-relaxed">
                    {article.content.replace(/<[^>]*>/g, '')}
                  </p>
                )}

                {/* メタ情報 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-[var(--border)]">
                  <div className="space-y-2">
                    {/* 更新日時 */}
                    <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                      <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      最終更新: {formatDate(article.updatedAt ?? '')}
                    </div>

                    {/* タグ */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag, idx) => (
                          <span
                            key={`${article.id}-${tag}-${idx}`}
                            className="text-[var(--text)]/85 text-xs font-medium px-2 py-1 rounded-full border bg-[var(--card)] border-[var(--border)]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 編集ボタン */}
                  <div className="flex gap-3">
                    <Link
                      href={`/articles/${article.id}/edit`}
                      className="inline-flex items-center px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 bg-[var(--primary)] text-[var(--primary-contrast)]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      編集
                    </Link>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))
        ) : (
          <EmptyState
            title="まだ記事がありません"
            description="最初の記事を投稿してみましょう！"
            icon={(
              <svg className="w-12 h-12 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            action={{ href: "/articles/new", label: "記事を書く" }}
          />
        )}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="inline-flex items-center px-6 py-3 font-medium rounded-xl transition-all duration-300 shadow-sm bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--card-hover-border)]"
          >
            もっと見る
          </button>
        </div>
      )}
    </div>
  )
}

export default ArticlesPage
