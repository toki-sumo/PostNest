// src/app/dashboard/settings/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import DashboardHeader from '../../../components/dashboard/DashboardHeader'
import GlassCard from '../../../components/dashboard/GlassCard'
import Section from '../../../components/ui/Section'
import Notice from '../../../components/ui/Notice'

const SettingsPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    try {
      const res = await fetch('/api/user', {
        method: 'DELETE',
      })

      if (res.ok) {
        // アカウント削除成功後、ログアウトしてホームページにリダイレクト
        router.push('/')
      } else {
        const error = await res.json()
        setMessage(`アカウント削除エラー: ${error.message}`)
      }
    } catch (err) {
      setMessage('アカウント削除中にエラーが発生しました')
    } finally {
      setDeleteLoading(false)
      setShowDeleteConfirm(false)
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
      <DashboardHeader title="設定" subtitle={`${session?.user?.name ?? ''} さんのアカウント設定`} />

      {/* 設定項目 */}
      <div className="space-y-6">
        {/* 通知設定 */}
        <Section title="通知設定" subtitle="メール通知やプッシュ通知の設定を行います" actions={(
          <button className="inline-flex items-center px-4 py-2 rounded-lg transition-all duration-300 shadow-sm hover:opacity-90 bg-[var(--primary)] text-[var(--primary-contrast)]">
            開く
          </button>
        )}>
          <Notice>通知チャネルごとの詳細設定は近日追加予定です。</Notice>
        </Section>

        {/* プライバシー設定 */}
        <Section title="プライバシー設定" subtitle="プロフィールの公開範囲やデータの表示設定を行います" actions={(
          <button className="inline-flex items-center px-4 py-2 rounded-lg transition-all duration-300 shadow-sm hover:opacity-90 bg-[var(--primary)] text-[var(--primary-contrast)]">
            開く
          </button>
        )}>
          <Notice>各項目の詳細設定は順次拡充していきます。</Notice>
        </Section>

        {/* アカウント退会セクション */}
        <GlassCard className="p-6 border-red-600/30 hover:border-red-500/50 transition-all duration-300">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-red-600">アカウント退会</h3>
                <p className="text-red-700 mt-1">
                  この操作は取り消すことができません。アカウントを削除すると、すべてのデータが完全に削除されます。
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 bg-red-600 text-white"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                アカウントを削除
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-[color:var(--bg)]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-sm rounded-2xl shadow-2xl border max-w-md w-full p-8 bg-[var(--card)] border-[var(--border)]">
            <div className="flex items-start space-x-3 mb-6">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-medium text-[var(--text)]">アカウント削除の確認</h3>
                <p className="text-[var(--text)]/85 mt-2">
                  本当にアカウントを削除しますか？この操作は取り消すことができません。
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border font-medium rounded-lg transition-all duration-300 bg-[var(--card)] text-[var(--text)] border-[var(--border)] hover:border-[var(--card-hover-border)]"
              >
                キャンセル
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 text-white"
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                  </>
                ) : (
                  '削除する'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* メッセージ表示 */}
      {message && (
        <div className="fixed bottom-4 right-4 bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-xl shadow-lg backdrop-blur-sm">
          <p className="text-sm font-medium flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {message}
          </p>
        </div>
      )}
    </div>
  )
}

export default SettingsPage
