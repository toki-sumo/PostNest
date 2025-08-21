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
      'bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-600/30 p-6 mb-8',
      className,
    )}>
      <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">{title}</h1>
      {subtitle && (
        <p className="text-lg lg:text-xl text-slate-300">
          {subtitle}
        </p>
      )}
    </div>
  )
}


