'use client'

import clsx from 'clsx'

type Props = {
  title: string
  subtitle?: string
  className?: string
}

export default function DashboardHeader({ title, subtitle, className }: Props) {
  return (
    <div className={clsx(
      'backdrop-blur-sm rounded-2xl shadow-lg border p-6 mb-8 bg-[var(--card)] border-[var(--border)]',
      className,
    )}>
      <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text)] mb-3">{title}</h1>
      {subtitle && (
        <p className="text-lg lg:text-xl text-[var(--text)]/85">
          {subtitle}
        </p>
      )}
    </div>
  )
}


