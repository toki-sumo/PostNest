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
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-4xl mx-auto p-4 lg:p-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">読み込み中...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* ヘッダーセクション */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">投稿記事</h1>
          <p className="text-base lg:text-lg font-semibold text-gray-700">
            {session?.user?.name} さんが投稿した記事
          </p>
        </div>

        {/* 記事一覧 */}
        <div className="space-y-4">
          {articles.length > 0 ? (
            articles.map((article) => (
              <div
                key={article.id}
                className="block bg-white shadow-sm hover:shadow-md rounded-lg border border-gray-200 p-4 lg:p-6 transition-all duration-200 hover:border-blue-300 group cursor-pointer"
                onClick={() => router.push(`/articles/${article.id}`)}
              >
                <div className="space-y-3">
                  {/* タイトル */}
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {article.title}
                  </h2>

                  {/* 内容 */}
                  {article.content && (
                    <p className="text-gray-600 text-sm lg:text-base line-clamp-2 leading-relaxed">
                      {article.content}
                    </p>
                  )}

                  {/* メタ情報 */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
                    <div className="space-y-2">
                      {/* 更新日時 */}
                      <p className="text-xs lg:text-sm text-gray-500">
                        最終更新: {formatDate(article.updatedAt ?? '')}
                      </p>

                      {/* タグ */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full border border-blue-200"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 編集・削除ボタン */}
                    <div className="flex gap-2">
                      <Link
                        href={`/articles/${article.id}/edit`}
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">まだ記事がありません</h3>
              <p className="text-gray-600 mb-6">最初の記事を投稿してみましょう！</p>
              <Link
                href="/articles/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
