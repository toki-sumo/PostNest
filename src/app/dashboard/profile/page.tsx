// src/app/dashboard/profile/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import DashboardHeader from '../../../components/dashboard/DashboardHeader'
import GlassCard from '../../../components/dashboard/GlassCard'
import Section from '../../../components/ui/Section'
import Notice from '../../../components/ui/Notice'

const ProfilePage = () => {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
      return
    }
    if (session?.user) {
      setName(session.user.name || '')
      setBio(session.user.bio || '')
      setAvatarUrl(session.user.image as string | undefined)
    }
  }, [status, router, session])

  const handleSave = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, image: avatarUrl }),
      })
      if (res.ok) {
        await update({ name, bio, image: avatarUrl })
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

  const handleAvatarUpload = async (file: File) => {
    setAvatarUploading(true)
    try {
      const contentType = file.type || 'image/png'
      const pres = await fetch('/api/user/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType }),
      })
      if (!pres.ok) throw new Error('Failed to get presigned URL')
      const { url, fields, publicUrl } = await pres.json()

      const formData = new FormData()
      Object.entries(fields).forEach(([k, v]) => formData.append(k, String(v)))
      formData.append('Content-Type', contentType)
      formData.append('file', file)

      const up = await fetch(url, { method: 'POST', body: formData })
      if (!up.ok) {
        const errText = await up.text().catch(() => '')
        throw new Error(`Upload failed: ${up.status} ${errText?.slice(0,200)}`)
      }

      setAvatarUrl(publicUrl)
      setMessage('アイコンをアップロードしました。保存で反映されます。')
    } catch (e: any) {
      setMessage(`アイコンのアップロードに失敗しました: ${e?.message ?? ''}`)
    } finally {
      setAvatarUploading(false)
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

      <div className="space-y-8">
        <Section title="現在の情報">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-16 h-16 rounded-full object-cover border" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[var(--muted)]/20 border" />
              )}
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleAvatarUpload(f)
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--card-hover)] disabled:opacity-50"
                >
                  {avatarUploading ? 'アップロード中...' : 'アイコンを選択'}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[var(--muted)] font-medium">ユーザー名:</span>
              <span className="text-[var(--text)] font-semibold">{session?.user?.name || '未設定'}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[var(--muted)] font-medium">メールアドレス:</span>
              <span className="text-[var(--text)]/85">{session?.user?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[var(--muted)] font-medium">プロフィール:</span>
              <span className="text-[var(--text)]/85">{session?.user?.bio || '未設定'}</span>
            </div>
          </div>
        </Section>

        {/* 編集フォーム */}
        <Section title="プロフィールを編集">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-3">ユーザー名</label>
              <input
                className="w-full px-4 py-3 rounded-xl shadow-sm transition-all duration-300 bg-[var(--card)] text-[var(--text)] border border-[var(--border)] placeholder-[color:var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ユーザー名を入力してください"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-3">プロフィール</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl shadow-sm transition-all duration-300 resize-vertical bg-[var(--card)] text-[var(--text)] border border-[var(--border)] placeholder-[color:var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="自己紹介やプロフィールを入力してください"
              />
              <p className="text-xs text-[var(--muted)] mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                あなたの興味や専門分野について書いてみましょう
              </p>
            </div>

            {/* 保存ボタン */}
            <div className="pt-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 bg-[var(--primary)] text-[var(--primary-contrast)]"
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
              <Notice variant={message.includes('エラー') ? 'danger' : 'success'}>{message}</Notice>
            )}
          </div>
        </Section>
      </div>
    </div>
  )
}

export default ProfilePage
