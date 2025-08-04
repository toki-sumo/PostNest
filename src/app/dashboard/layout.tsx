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
  ]

  return (
    <div className="p-4">
      <div className="flex space-x-4 border-b mb-4">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={clsx(
              'pb-2 text-sm font-medium',
              pathname === tab.href
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.name}
          </Link>
        ))}
      </div>
      <div>{children}</div>
    </div>
  )
}
