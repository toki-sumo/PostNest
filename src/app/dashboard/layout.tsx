// src/app/dashboard/layout.tsx

'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import clsx from 'clsx'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const tabs = [
    { name: 'Articles', href: '/dashboard/articles' },
    { name: 'Profile', href: '/dashboard/profile' },
    { name: 'Settings', href: '/dashboard/settings' },
  ]

  return (
    <div className="pt-4">
      {/* 固定タブナビゲーション */}
      <div className="sticky top-20 bg-white border-b border-slate-200 shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={clsx(
                  'py-4 text-sm font-medium border-b-2 transition-colors duration-200',
                  pathname === tab.href
                    ? 'border-slate-600 text-slate-800'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                )}
              >
                {tab.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* メインコンテンツ */}
      <div className="px-4 lg:px-6 py-6">
        {children}
      </div>
    </div>
  )
}
