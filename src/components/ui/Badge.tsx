'use client'

import clsx from 'clsx'
import { ReactNode } from 'react'

type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'
type BadgeSize = 'sm' | 'md'

type Props = {
  children: ReactNode
  className?: string
  variant?: BadgeVariant
  outline?: boolean
  size?: BadgeSize
  leadingIcon?: ReactNode
}

const variantToColors: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  neutral: {
    bg: 'bg-[color:var(--muted)]/10',
    text: 'text-[var(--text)]',
    border: 'border-[var(--border)]',
  },
  primary: {
    bg: 'bg-[color:var(--primary)]/15',
    text: 'text-[var(--primary)]',
    border: 'border-[color:var(--primary)]/30',
  },
  success: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600',
    border: 'border-emerald-300',
  },
  warning: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-600',
    border: 'border-amber-300',
  },
  danger: {
    bg: 'bg-red-500/10',
    text: 'text-red-600',
    border: 'border-red-300',
  },
}

export default function Badge({
  children,
  className,
  variant = 'neutral',
  outline = true,
  size = 'sm',
  leadingIcon,
}: Props) {
  const colors = variantToColors[variant]
  const paddings = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium transition-colors duration-200',
        paddings,
        colors.text,
        outline ? `border ${colors.border} ${colors.bg}` : colors.bg,
        className,
      )}
    >
      {leadingIcon && <span className="mr-1 flex items-center">{leadingIcon}</span>}
      {children}
    </span>
  )
}


