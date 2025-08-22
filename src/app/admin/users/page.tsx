'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type UserRow = {
  id: string
  name: string | null
  email: string | null
  role: string
  _count: { Article: number; subscriptions: number }
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [rows, setRows] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/signin')
    if (session?.user?.role !== 'Admin') router.push('/')
  }, [session, status, router])

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users', { cache: 'no-store' })
      const data = (await res.json()) as UserRow[]
      setRows(Array.isArray(data) ? data : [])
    } catch {
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text)] mb-6">ユーザー管理</h1>

        <div className="rounded-2xl border bg-[var(--card)] border-[var(--border)] overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <span className="text-[var(--muted)] text-sm">{rows.length} 件</span>
            <button onClick={load} className="text-sm px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--card-hover-border)]">再読込</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[color:var(--muted)]/10 text-[var(--text)]">
                <tr>
                  <th className="text-left px-4 py-3">名前</th>
                  <th className="text-left px-4 py-3">メール</th>
                  <th className="text-left px-4 py-3">権限</th>
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">投稿数</th>
                  <th className="text-left px-4 py-3">購読数</th>
                  <th className="px-4 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id} className="border-t border-[var(--border)]">
                    <td className="px-4 py-3 text-[var(--text)]">{u.name ?? '(no name)'}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">{u.email ?? '-'}</td>
                    <td className="px-4 py-3 text-[var(--text)]">{u.role}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">{u.id}</td>
                    <td className="px-4 py-3 text-[var(--text)]">{u._count.Article}</td>
                    <td className="px-4 py-3 text-[var(--text)]">{u._count.subscriptions}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={async () => { await fetch(`/api/admin/users/${u.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'setRole', role: 'Admin' }) }); load() }}
                        className="px-3 py-1 rounded border border-[var(--border)] hover:border-[var(--card-hover-border)]"
                      >Admin</button>
                      <button
                        onClick={async () => { await fetch(`/api/admin/users/${u.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'setRole', role: 'user' }) }); load() }}
                        className="px-3 py-1 rounded border border-[var(--border)] hover:border-[var(--card-hover-border)]"
                      >User</button>
                      {u.role === 'DISABLED' ? (
                        <button
                          onClick={async () => { await fetch(`/api/admin/users/${u.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'enable' }) }); load() }}
                          className="px-3 py-1 rounded border border-[var(--border)] text-green-700 hover:border-[var(--card-hover-border)]"
                        >有効化</button>
                      ) : (
                        <button
                          onClick={async () => { await fetch(`/api/admin/users/${u.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'disable' }) }); load() }}
                          className="px-3 py-1 rounded border border-[var(--border)] text-red-700 hover:border-[var(--card-hover-border)]"
                        >無効化</button>
                      )}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-[var(--muted)]">ユーザーがありません</td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-[var(--muted)]">読み込み中...</td>
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


