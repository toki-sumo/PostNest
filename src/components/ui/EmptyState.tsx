'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { ReactNode } from 'react'

type Props = {
  title: string
  description?: string
  icon?: ReactNode
  action?: { href?: string; onClick?: () => void; label: string }
  className?: string
}

export default function EmptyState({ title, description, icon, action, className }: Props) {
  return (
    <div className={clsx('text-center p-12 rounded-2xl border backdrop-blur-sm', 'bg-[var(--card)] border-[var(--border)]', className)}>
      <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-[color:var(--muted)]/10">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-[var(--text)] mb-4">{title}</h3>
      {description && <p className="text-[var(--text)]/85 mb-6">{description}</p>}
      {action && (
        action.href ? (
          <Link href={action.href} className="inline-flex items-center px-6 py-3 rounded-xl transition-all duration-300 shadow-sm hover:opacity-90 bg-[var(--primary)] text-[var(--primary-contrast)]">
            {action.label}
          </Link>
        ) : (
          <button onClick={action.onClick} className="inline-flex items-center px-6 py-3 rounded-xl transition-all duration-300 shadow-sm hover:opacity-90 bg-[var(--primary)] text-[var(--primary-contrast)]">
            {action.label}
          </button>
        )
      )}
    </div>
  )
}


