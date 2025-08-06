'use client'

import DeleteButton from '@/components/ui/DeleteButton'
import EditButton from '@/components/ui/EditButton'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Article = {
  id: number
  title: string
  content?: string
  // updated?: string
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

      <p className="text-lg font-semibold text-gray-700 mb-4">
        {session?.user?.name}さんが投稿した記事
      </p>

      <div className="flex flex-wrap gap-4">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div
              key={article.id}
              className="w-full p-4 bg-white shadow rounded"
            >
              <Link href={`${process.env.NEXT_PUBLIC_API_URL}/articles/${article.id}`} className="md w-full">
                タイトル：{article.title}
              </Link>
            </div>
          ))
        ) : (
          <p>まだ記事がありません。</p>
        )}
      </div>
    </div>
  )
}

export default ArticlesPage
