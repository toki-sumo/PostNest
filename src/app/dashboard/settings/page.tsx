// src/app/dashboard/settings/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const SettingsPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
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
      <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto p-4 lg:p-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-slate-300">読み込み中...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 背景の装飾要素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* 浮遊する幾何学的図形 */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* グリッドパターン */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="max-w-4xl mx-auto p-4 lg:p-6 relative z-10">
        {/* ヘッダーセクション */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-600/30 p-6 mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">設定</h1>
          <p className="text-lg lg:text-xl text-slate-300">
            {session?.user?.name} さんのアカウント設定
          </p>
        </div>

        {/* 設定項目 */}
        <div className="space-y-6">
          {/* 通知設定 */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-600/30 p-6 hover:border-slate-500/50 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 004 6v10a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-1.41.59z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white">通知設定</h3>
                  <p className="text-slate-300 mt-1">
                    メール通知やプッシュ通知の設定を行います
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-medium rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-slate-500/25 transform hover:scale-105">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  通知設定を開く
                </button>
              </div>
            </div>
          </div>

          {/* プライバシー設定 */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-600/30 p-6 hover:border-slate-500/50 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white">プライバシー設定</h3>
                  <p className="text-slate-300 mt-1">
                    プロフィールの公開範囲やデータの表示設定を行います
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-medium rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-slate-500/25 transform hover:scale-105">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  プライバシー設定を開く
                </button>
              </div>
            </div>
          </div>

          {/* アカウント退会セクション */}
          <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 backdrop-blur-sm rounded-2xl shadow-lg border border-red-600/30 p-6 hover:border-red-500/50 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-red-300">アカウント退会</h3>
                  <p className="text-red-200 mt-1">
                    この操作は取り消すことができません。アカウントを削除すると、すべてのデータが完全に削除されます。
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/25 transform hover:scale-105"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  アカウントを削除
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 削除確認モーダル */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600/30 max-w-md w-full p-8">
              <div className="flex items-start space-x-3 mb-6">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">アカウント削除の確認</h3>
                  <p className="text-slate-300 mt-2">
                    本当にアカウントを削除しますか？この操作は取り消すことができません。
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-slate-600/30 text-slate-300 font-medium rounded-lg hover:bg-slate-700/50 transition-all duration-300"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
    </div>
  )
}

export default SettingsPage
