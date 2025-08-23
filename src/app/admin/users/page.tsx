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
  const [modalOpen, setModalOpen] = useState(false)
  const [targetUser, setTargetUser] = useState<UserRow | null>(null)
  const [nextRole, setNextRole] = useState<'Admin' | 'user' | 'DISABLED'>('user')
  const [saving, setSaving] = useState(false)

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

  const openRoleModal = (u: UserRow) => {
    setTargetUser(u)
    // 現在の役割を初期選択に
    const current = (u.role === 'Admin' || u.role === 'DISABLED') ? u.role : 'user'
    setNextRole(current)
    setModalOpen(true)
  }

  const applyRoleChange = async () => {
    if (!targetUser) return
    setSaving(true)
    try {
      await fetch(`/api/admin/users/${targetUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setRole', role: nextRole }),
      })
      setModalOpen(false)
      setTargetUser(null)
      await load()
    } finally {
      setSaving(false)
    }
  }

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
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openRoleModal(u)}
                        className="px-3 py-1 rounded border border-[var(--border)] hover:border-[var(--card-hover-border)]"
                      >権限変更</button>
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
        {modalOpen && (
          <div className="fixed inset-0 bg-[color:var(--bg)]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="backdrop-blur-sm p-6 rounded-2xl shadow-2xl border w-full max-w-md text-left bg-[var(--card)] border-[var(--border)]">
              <h3 className="text-xl font-bold text-[var(--text)] mb-4">権限を変更</h3>
              <p className="text-[var(--muted)] text-sm mb-4">対象: {targetUser?.name ?? '(no name)'} ({targetUser?.email ?? '-'})</p>
              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3">
                  <input type="radio" name="role" className="accent-[var(--primary)]" checked={nextRole==='Admin'} onChange={() => setNextRole('Admin')} />
                  <span className="text-[var(--text)]">Admin</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="radio" name="role" className="accent-[var(--primary)]" checked={nextRole==='user'} onChange={() => setNextRole('user')} />
                  <span className="text-[var(--text)]">User</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="radio" name="role" className="accent-[var(--primary)]" checked={nextRole==='DISABLED'} onChange={() => setNextRole('DISABLED')} />
                  <span className="text-[var(--text)]">DISABLED（無効化）</span>
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => { if (!saving) { setModalOpen(false); setTargetUser(null) } }}
                  className="px-4 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--card-hover-border)]"
                  disabled={saving}
                >キャンセル</button>
                <button
                  onClick={applyRoleChange}
                  className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-contrast)] hover:opacity-90"
                  disabled={saving}
                >{saving ? '保存中...' : '更新する'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


