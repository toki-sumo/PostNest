'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { formatDate } from "@/lib/utils/formatDate"

type Article = {
  id: number
  title: string
  content?: string
  updatedAt?: string
  tags?: string[]
}

const ArticlesPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
    }

    if (status === 'authenticated') {
      const fetchArticles = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/user`)
          const data = await res.json()
          setArticles(data)
        } catch (error) {
          console.error('記事の取得に失敗しました', error)
        } finally {
          setLoading(false)
        }
      }

      fetchArticles()
    }
  }, [status, router])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto p-4 lg:p-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-slate-300">読み込み中...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-40 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 背景の装飾要素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* 浮遊する幾何学的図形 */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* グリッドパターン */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="max-w-4xl mx-auto p-4 lg:p-6 relative z-10">
        {/* ヘッダーセクション */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-600/30 p-6 mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">投稿記事</h1>
          <p className="text-lg lg:text-xl text-slate-300">
            {session?.user?.name} さんが投稿した記事
          </p>
        </div>

        {/* 記事一覧 */}
        <div className="space-y-6">
          {articles.length > 0 ? (
            articles.map((article) => (
              <div
                key={article.id}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm shadow-lg rounded-2xl border border-slate-600/30 p-6 transition-all duration-500 hover:border-slate-500/50 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer transform hover:scale-[1.02]"
                onClick={() => router.push(`/articles/${article.id}`)}
              >
                <div className="space-y-4">
                  {/* タイトル */}
                  <h2 className="text-xl lg:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300 line-clamp-2">
                    {article.title}
                  </h2>

                  {/* 内容 */}
                  {article.content && (
                    <p className="text-slate-300 text-base lg:text-lg line-clamp-2 leading-relaxed">
                      {article.content.replace(/<[^>]*>/g, '')}
                    </p>
                  )}

                  {/* メタ情報 */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-600/30">
                    <div className="space-y-2">
                      {/* 更新日時 */}
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        最終更新: {formatDate(article.updatedAt ?? '')}
                      </div>

                      {/* タグ */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-slate-700/50 text-slate-300 text-xs font-medium px-2 py-1 rounded-full border border-slate-600/30"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 編集・削除ボタン */}
                    <div className="flex gap-3">
                      <Link
                        href={`/articles/${article.id}/edit`}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105"
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
              </div>
            ))
          ) : (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-600/30 p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">まだ記事がありません</h3>
              <p className="text-slate-300 mb-8 text-lg">最初の記事を投稿してみましょう！</p>
              <Link
                href="/articles/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                記事を書く
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArticlesPage
