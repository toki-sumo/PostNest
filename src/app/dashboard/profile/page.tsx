// src/app/dashboard/profile/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardHeader from '../../../components/dashboard/DashboardHeader'
import GlassCard from '../../../components/dashboard/GlassCard'

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
      return
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
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio }),
      })
      if (res.ok) {
        await update({ name, bio })
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-slate-300">読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DashboardHeader title="プロフィール編集" subtitle={`${session?.user?.name ?? ''} さんのプロフィール情報`} />

      <GlassCard className="p-8">
        <div className="space-y-8">
          {/* 現在のユーザー情報表示 */}
          <GlassCard className="p-6">
            <p className="text-slate-300 text-sm font-medium mb-4 flex items-center">
              <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              現在の情報
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-medium">ユーザー名:</span>
                <span className="text-white font-semibold">{session?.user?.name || '未設定'}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-medium">メールアドレス:</span>
                <span className="text-slate-300">{session?.user?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-medium">プロフィール:</span>
                <span className="text-slate-300">{session?.user?.bio || '未設定'}</span>
              </div>
            </div>
          </GlassCard>

          {/* 編集フォーム */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">ユーザー名</label>
              <input
                className="w-full px-4 py-3 border border-slate-600/30 rounded-xl shadow-sm bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ユーザー名を入力してください"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">プロフィール</label>
              <textarea
                className="w-full px-4 py-3 border border-slate-600/30 rounded-xl shadow-sm bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-vertical"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="自己紹介やプロフィールを入力してください"
              />
              <p className="text-xs text-slate-400 mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                あなたの興味や専門分野について書いてみましょう
              </p>
            </div>

            {/* 保存ボタン */}
            <div className="pt-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    保存中...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    保存
                  </>
                )}
              </button>
            </div>

            {/* メッセージ表示 */}
            {message && (
              <div className={`p-4 rounded-xl ${
                message.includes('エラー')
                  ? 'bg-red-500/20 border border-red-500/30 text-red-300'
                  : 'bg-green-500/20 border border-green-500/30 text-green-300'
              }`}>
                <p className="text-sm font-medium flex items-center">
                  {message.includes('エラー') ? (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {message}
                </p>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

export default ProfilePage
