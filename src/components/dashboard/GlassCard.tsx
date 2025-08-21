'use client'

import clsx from 'clsx'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export default function GlassCard({ children, className }: Props) {
  return (
    <div className={clsx(
      'bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-600/30',
      className,
    )}>
      {children}
    </div>
  )
}


