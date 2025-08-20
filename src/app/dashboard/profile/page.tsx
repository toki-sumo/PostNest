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
    return (
      <div className="min-h-screen pt-20 bg-slate-50">
        <div className="max-w-4xl mx-auto p-4 lg:p-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
              <p className="text-slate-600">読み込み中...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* ヘッダーセクション */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-3">プロフィール編集</h1>
          <p className="text-base lg:text-lg font-semibold text-slate-700">
            {session?.user?.name} さんのプロフィール情報
          </p>
        </div>

        {/* プロフィール編集フォーム */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="space-y-6">
            {/* 現在のユーザー情報表示 */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-slate-600 text-sm font-medium mb-2">現在の情報</p>
              <div className="space-y-2">
                <p className="text-slate-800 font-semibold">
                  ユーザー名: {session?.user?.name || '未設定'}
                </p>
                <p className="text-slate-600 text-sm">
                  メールアドレス: {session?.user?.email}
                </p>
                <p className="text-slate-600 text-sm">
                  プロフィール: {session?.user?.bio || '未設定'}
                </p>
              </div>
            </div>

            {/* 編集フォーム */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ユーザー名
                </label>
                <input
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ユーザー名を入力してください"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  プロフィール
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200 resize-vertical"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="自己紹介やプロフィールを入力してください"
                />
                <p className="text-xs text-slate-500 mt-1">
                  あなたの興味や専門分野について書いてみましょう
                </p>
              </div>

              {/* 保存ボタン */}
              <div className="pt-4">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 bg-slate-600 text-white font-medium rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      保存中...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      保存
                    </>
                  )}
                </button>
              </div>

              {/* メッセージ表示 */}
              {message && (
                <div className={`p-3 rounded-md ${
                  message.includes('エラー') 
                    ? 'bg-red-50 border border-red-200 text-red-700' 
                    : 'bg-green-50 border border-green-200 text-green-700'
                }`}>
                  <p className="text-sm font-medium">{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
