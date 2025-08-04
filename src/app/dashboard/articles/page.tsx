'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const dummyArticles = [
  { id: 1, title: 'article1' },
  { id: 2, title: 'article2' },
]

const ArticlesPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return <p className="p-4">Loading...</p>
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">投稿記事</h1>

      <p className="text-lg font-semibold text-gray-700 mb-4">
        {session?.user?.name}さんが投稿した記事
      </p>

      <div className="flex flex-wrap gap-4">
        {dummyArticles.map((article) => (
          <div
            key={article.id}
            className="flex-1 min-w-[40%] p-4 bg-white shadow rounded"
          >
            {article.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ArticlesPage
