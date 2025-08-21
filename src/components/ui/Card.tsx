'use client'

import clsx from 'clsx'
import { ReactNode, ElementType, ComponentPropsWithoutRef } from 'react'

type CardProps<T extends ElementType = 'div'> = {
  children: ReactNode
  className?: string
  as?: T
} & Omit<ComponentPropsWithoutRef<T>, 'className' | 'children'>

export default function Card<T extends ElementType = 'div'>({
  children,
  className,
  as,
  ...rest
}: CardProps<T>) {
  const Comp = (as || 'div') as ElementType
  return (
    <Comp
      {...rest}
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


