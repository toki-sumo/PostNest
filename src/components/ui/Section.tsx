'use client'

import clsx from 'clsx'
import { ReactNode } from 'react'
import Card from './Card'

type Props = {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export default function Section({ title, subtitle, actions, children, className }: Props) {
  return (
    <Card className={clsx('p-6', className)}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text)]">{title}</h2>
          {subtitle && <p className="text-[var(--text)]/85 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
      {children}
    </Card>
  )}


