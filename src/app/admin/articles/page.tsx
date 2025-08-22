'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DeleteButton from '@/components/ui/DeleteButton'

type ArticleRow = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  isPremium: boolean
  price: number | null
  author?: { name?: string | null; email?: string | null } | null
}

export default function AdminArticlesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [rows, setRows] = useState<ArticleRow[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/signin')
    if (session?.user?.role !== 'Admin') router.push('/')
  }, [session, status, router])

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/articles', { cache: 'no-store' })
      const data = (await res.json()) as ArticleRow[]
      setRows(Array.isArray(data) ? data : [])
    } catch (e) {
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text)] mb-6">記事管理</h1>

        <div className="rounded-2xl border bg-[var(--card)] border-[var(--border)] overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <span className="text-[var(--muted)] text-sm">{rows.length} 件</span>
            <button
              onClick={load}
              className="text-sm px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--card-hover-border)]"
            >
              再読込
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[color:var(--muted)]/10 text-[var(--text)]">
                <tr>
                  <th className="text-left px-4 py-3">タイトル</th>
                  <th className="text-left px-4 py-3">作成日</th>
                  <th className="text-left px-4 py-3">更新日</th>
                  <th className="text-left px-4 py-3">種別</th>
                  <th className="px-4 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-[var(--border)]">
                    <td className="px-4 py-3 text-[var(--text)]">{r.title}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">{new Date(r.createdAt).toLocaleString('ja-JP')}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">{new Date(r.updatedAt).toLocaleString('ja-JP')}</td>
                    <td className="px-4 py-3 text-[var(--text)]">{r.isPremium ? `有料 ¥${(r.price ?? 0).toLocaleString()}` : '無料'}</td>
                    <td className="px-4 py-3 text-right">
                      <DeleteButton id={r.id} onDeleted={load} />
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-[var(--muted)]">記事がありません</td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-[var(--muted)]">読み込み中...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}


