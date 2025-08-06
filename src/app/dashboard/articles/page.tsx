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
    return <p className="p-4">Loading...</p>
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">投稿記事</h1>

      <p className="text-lg font-semibold text-gray-700 mb-6">
        {session?.user?.name} さんが投稿した記事
      </p>

      <div className="space-y-4">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="block bg-slate-100 shadow hover:shadow-md rounded-lg p-4 transition duration-200"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {article.title}
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                最終更新日時：{formatDate(article.updatedAt ?? '')}
              </p>

              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))
        ) : (
          <p className="text-gray-600">まだ記事がありません。</p>
        )}
      </div>
    </div>
  )
}

export default ArticlesPage
