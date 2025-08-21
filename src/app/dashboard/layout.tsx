'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BackgroundDecoration from '@/components/common/BackgroundDecoration';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <BackgroundDecoration />

      <div className="relative z-10">
        {/* タブナビゲーション */}
        <div className="sticky top-20 left-0 right-0 z-30 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-md border-b border-slate-600/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              <Link
                href="/dashboard"
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  pathname === '/dashboard'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-300 hover:text-slate-200 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>ダッシュボード</span>
                </div>
              </Link>

              <Link
                href="/dashboard/articles"
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  pathname === '/dashboard/articles'
                    ? 'border-green-500 text-green-400'
                    : 'border-transparent text-slate-300 hover:text-slate-200 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4m0 0H7m6 0h4" />
                  </svg>
                  <span>記事管理</span>
                </div>
              </Link>

              <Link
                href="/dashboard/subscriptions"
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  pathname === '/dashboard/subscriptions'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-slate-300 hover:text-slate-200 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>購読履歴</span>
                </div>
              </Link>

              <Link
                href="/dashboard/profile"
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  pathname === '/dashboard/profile'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-300 hover:text-slate-200 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>プロフィール</span>
                </div>
              </Link>

              <Link
                href="/dashboard/settings"
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  pathname === '/dashboard/settings'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-slate-300 hover:text-slate-200 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>設定</span>
                </div>
              </Link>
            </nav>
          </div>
        </div>

        {/* メインコンテンツ */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
          {children}
        </main>
      </div>
    </div>
  );
}
