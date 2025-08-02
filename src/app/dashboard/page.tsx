'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// 仮の投稿データ（後でAPIやDBと接続する）
const dummyArticles = [
    { id: 1, title: 'article1' },
    { id: 2, title: 'article2' },
]

const DashboardPage = () => {
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
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <div className="bg-white shadow rounded-lg p-6 space-y-4">
                {/* ユーザー情報 */}
                <div>
                    <p className="text-gray-600">Welcome,</p>
                    <p className="text-xl font-semibold">{session?.user?.name || 'User'}</p><br />
                    <p className="text-sm text-gray-500">email: {session?.user?.email}</p>
                    <p className="text-sm text-gray-500">role: {session?.user?.role}</p>
                </div>

                {/* 投稿記事セクション */}
                <section className="bg-gray-50 p-6 rounded-lg">
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
                </section>
            </div>
        </div>
    )
}

export default DashboardPage
