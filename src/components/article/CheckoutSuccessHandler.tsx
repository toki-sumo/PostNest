'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CheckoutSuccessHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const calledRef = useRef(false)

  useEffect(() => {
    const success = searchParams.get('success')
    const sessionId = searchParams.get('session_id')

    // Stripeからのリダイレクトで 500 の場合に備えて軽い遅延を入れる
    // （VPC内DNS/コールドスタート吸収）
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

    if (calledRef.current) return
    if (success === '1' && sessionId) {
      calledRef.current = true
      ;(async () => {
        try {
          await sleep(400)
          const res = await fetch('/api/subscriptions/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId }),
          })
          // 反映後にURLをクリーンアップ
          const url = new URL(window.location.href)
          url.searchParams.delete('success')
          url.searchParams.delete('session_id')
          router.replace(url.pathname + (url.search ? url.search : ''))
          router.refresh()
        } catch (_) {
          // 失敗してもUI崩壊を避ける（Webhook側で反映される想定）
        }
      })()
    }
  }, [router, searchParams])

  return null
}
