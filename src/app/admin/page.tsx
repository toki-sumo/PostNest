// app/admin/page.tsx
'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const AdminPage = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin')
            return
        }
        if (status === 'authenticated' && session?.user?.role !== 'Admin') {
            router.push('/')
        }
    }, [status, router, session])

    if (status === 'loading') {
        return (
            <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* 背景の装飾要素 */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    {/* 浮遊する幾何学的図形 */}
                    <div className="absolute top-20 left-10 w-32 h-32 bg-[color:var(--muted)]/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-24 h-24 bg-[color:var(--muted)]/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-40 left-20 w-40 h-40 bg-[color:var(--muted)]/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
                    
                    {/* グリッドパターン */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                </div>

                <div className="max-w-4xl mx-auto p-6 relative z-10">
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
        <div className="min-h-screen pt-20">
            {/* 背景の装飾要素 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* 浮遊する幾何学的図形 */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-[color:var(--muted)]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-[color:var(--muted)]/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-40 left-20 w-40 h-40 bg-[color:var(--muted)]/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
                
                {/* グリッドパターン */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            </div>

            <div className="max-w-6xl mx-auto p-6 relative z-10">
                {/* ヘッダーセクション */}
                <div className="backdrop-blur-sm rounded-2xl shadow-lg border p-8 mb-8 bg-[var(--card)] border-[var(--border)]">
                    <div className="text-center">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-[color:var(--muted)]/15">
                            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-[var(--text)] mb-4">管理者用ページ</h1>
                        <p className="text-lg lg:text-xl text-[var(--text)]/85">PostNestの管理機能にアクセス</p>
                    </div>
                </div>

                {/* 管理者情報カード */}
                <div className="backdrop-blur-sm rounded-2xl shadow-lg border p-8 mb-8 bg-[var(--card)] border-[var(--border)]">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-[var(--text)] mb-6 flex items-center justify-center">
                            <svg className="w-6 h-6 text-[var(--primary)] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            管理者情報
                        </h2>
                        <div className="space-y-4">
                            <div className="rounded-xl p-4 border bg-[var(--card)] border-[var(--border)]">
                                <p className="text-[var(--text)]/85 text-sm font-medium mb-2">ようこそ</p>
                                <p className="text-2xl font-bold text-[var(--text)]">{session?.user?.name || 'User'}</p>
                                <p className="text-[var(--muted)] text-sm">{session?.user?.email}</p>
                            </div>
                            <div className="rounded-xl p-4 border bg-red-50 border-red-200">
                                <p className="text-red-600 text-sm font-medium mb-2">権限</p>
                                <p className="text-xl font-bold text-red-700">{session?.user?.role}</p>
                                <p className="text-red-600 text-xs">最高管理者権限</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 管理機能セクション */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* ユーザー管理 */}
                    <div className="backdrop-blur-sm rounded-2xl shadow-lg border p-6 transition-all duration-300 bg-[var(--card)] border-[var(--border)] hover:border-[var(--card-hover-border)]">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[color:var(--muted)]/15">
                                <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-[var(--text)] mb-2">ユーザー管理</h3>
                            <p className="text-[var(--text)]/85 text-sm mb-4">ユーザーアカウントの管理と権限設定</p>
                            <Link
                                href="/admin/users"
                                className="inline-block px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 border border-[var(--border)] hover:border-[var(--card-hover-border)] hover:-translate-y-0.5 hover:shadow-md relative z-10"
                            >
                                ユーザー管理を開く
                            </Link>
                        </div>
                    </div>

                    {/* 記事管理 */}
                    <div className="backdrop-blur-sm rounded-2xl shadow-lg border p-6 transition-all duration-300 bg-[var(--card)] border-[var(--border)] hover:border-[var(--card-hover-border)]">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[color:var(--muted)]/15">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-[var(--text)] mb-2">記事管理</h3>
                            <p className="text-[var(--text)]/85 text-sm mb-4">投稿記事の審査と管理</p>
                            <Link
                                href="/admin/articles"
                                className="inline-block px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 border border-[var(--border)] hover:border-[var(--card-hover-border)] hover:-translate-y-0.5 hover:shadow-md relative z-10"
                            >
                                記事管理を開く
                            </Link>
                        </div>
                    </div>

                    {/* システム設定 */}
                    <div className="backdrop-blur-sm rounded-2xl shadow-lg border p-6 transition-all duration-300 bg-[var(--card)] border-[var(--border)] hover:border-[var(--card-hover-border)]">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[color:var(--muted)]/15">
                                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-[var(--text)] mb-2">システム設定</h3>
                            <p className="text-[var(--text)]/85 text-sm mb-4">アプリケーションの設定とメンテナンス</p>
                            <button className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300">
                                設定画面を開く
                            </button>
                        </div>
                    </div>
                </div>

                {/* 統計情報セクション */}
                <div className="mt-8 backdrop-blur-sm rounded-2xl shadow-lg border p-8 bg-[var(--card)] border-[var(--border)]">
                    <h2 className="text-2xl font-bold text-[var(--text)] mb-6 text-center">システム統計</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 bg-[color:var(--muted)]/15">
                                <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <p className="text-3xl font-bold text-[var(--text)]">1,234</p>
                            <p className="text-[var(--muted)] text-sm">総ユーザー数</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 bg-[color:var(--muted)]/15">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-3xl font-bold text-[var(--text)]">567</p>
                            <p className="text-[var(--muted)] text-sm">総記事数</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 bg-[color:var(--muted)]/15">
                                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <p className="text-3xl font-bold text-[var(--text)]">89,012</p>
                            <p className="text-[var(--muted)] text-sm">総閲覧数</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 bg-[color:var(--muted)]/15">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <p className="text-3xl font-bold text-[var(--text)]">2,345</p>
                            <p className="text-[var(--muted)] text-sm">総タグ数</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminPage
