'use client'

import { useState } from 'react'

export default function PurchaseButton({ articleId, disabled }: { articleId: string; disabled?: boolean }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    try {
      setError(null)
      setLoading(true)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '決済セッションの作成に失敗しました')
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('チェックアウトURLが取得できませんでした')
      }
    } catch (e: unknown) {
      const message = (e as Error)?.message ?? 'チェックアウトの作成に失敗しました'
      setError(message)
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold px-8 py-3 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-500/25 disabled:opacity-50"
      >
        {loading ? '処理中...' : '購読する'}
      </button>
      {error && (
        <div className="text-sm text-yellow-200">
          {error}
        </div>
      )}
    </div>
  )
}
