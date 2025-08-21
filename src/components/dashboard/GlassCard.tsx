'use client'

import clsx from 'clsx'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function GlassCard({ children, className, onClick }: Props) {
  return (
    <div onClick={onClick} className={clsx(
      'backdrop-blur-sm rounded-2xl shadow-lg border',
      'bg-[var(--card)] border-[var(--border)]',
      className,
    )}>
      {children}
    </div>
  )
}


