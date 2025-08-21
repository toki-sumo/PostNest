'use client'

import clsx from 'clsx'
import { ReactNode } from 'react'
import Card from '../ui/Card'

type Props = {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function GlassCard({ children, className, onClick }: Props) {
  return (
    <Card onClick={onClick} className={clsx(className)}>
      {children}
    </Card>
  )
}


