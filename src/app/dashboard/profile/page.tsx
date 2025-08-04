// src/app/dashboard/profile/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const ProfilePage = () => {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
    }

    if (session?.user) {
      setName(session.user.name || '')
      setBio(session.user.bio || '')
    }
  }, [status, router, session])

  const handleSave = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio }),
      })

      if (res.ok) {
        await update({name, bio})
        setMessage('保存しました。')
      } else {
        const error = await res.json()
        setMessage(`エラー: ${error.message}`)
      }
    } catch (err) {
      setMessage('予期せぬエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return <p className="p-4">Loading...</p>
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">プロフィール編集</h1>

      <div>
        <p className="text-gray-600">Welcome,</p>
        <p className="text-xl font-semibold">{session?.user?.name || 'User'}</p>
        <p className="text-sm text-gray-500">email: {session?.user?.email}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ユーザー名</label>
          <input
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-slate-100"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">プロフィール</label>
          <textarea
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-slate-100"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '保存中...' : '保存'}
        </button>

        {message && <p className="text-sm text-green-600">{message}</p>}
      </div>
    </div>
  )
}

export default ProfilePage
