// src/app/dashboard/layout.tsx
import Link from 'next/link'
import { clsx } from 'clsx'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

const tabs = [
  { name: 'Articles', href: '/dashboard/articles' },
  { name: 'Profile', href: '/dashboard/profile' },
  { name: 'Settings', href: '/dashboard/settings' },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 背景の装飾要素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* 浮遊する幾何学的図形 */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* グリッドパターン */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* スティッキータブナビゲーション */}
      <div className="sticky top-24 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-md border-b border-slate-600/30 shadow-lg z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={clsx(
                  'py-4 text-sm font-medium border-b-2 transition-all duration-300 relative group',
                  tab.href === '/dashboard/articles' && 'border-blue-500 text-blue-400 hover:text-blue-300',
                  tab.href === '/dashboard/profile' && 'border-green-500 text-green-400 hover:text-green-300',
                  tab.href === '/dashboard/settings' && 'border-purple-500 text-purple-400 hover:text-purple-300',
                  'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-500/50'
                )}
              >
                {tab.name}
                {/* ホバー時の下線アニメーション */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  )
}
