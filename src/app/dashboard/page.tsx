// app/dashboard/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const DashboardPage = () => {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin') // 未ログインならリダイレクト
        }
    }, [status, router])

    if (status === 'loading') {
        return <p className="p-4">Loading...</p>
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="bg-white shadow rounded-lg p-4">
                <p className="text-gray-600 mb-2">Welcome,</p>
                <p className="text-xl font-semibold">{session?.user?.name || 'User'}</p>
                <p className="text-sm text-gray-500">{session?.user?.email}</p>
            </div>
        </div>
    )
}

export default DashboardPage
