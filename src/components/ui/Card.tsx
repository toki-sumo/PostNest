'use client'

import clsx from 'clsx'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
  onClick?: () => void
}

export default function Card({ children, className, as = 'div', onClick }: Props) {
  const Comp = as as any
  return (
    <Comp
      onClick={onClick}
      className={clsx(
        'backdrop-blur-sm rounded-2xl shadow-lg border',
        'bg-[var(--card)] border-[var(--border)]',
        className,
      )}
    >
      {children}
    </Comp>
  )
}


