'use client'

import Link from 'next/link'
import clsx from 'clsx'

type Props = {
  href: string
  children: React.ReactNode
  className?: string
}

export default function LinkButton({ href, children, className }: Props) {
  return (
    <Link
      href={href}
      className={clsx(
        'inline-flex items-center justify-center rounded-lg px-4 py-2',
        'transition-all duration-300 shadow-sm hover:shadow-md hover:opacity-90',
        'bg-[var(--primary)] text-[var(--primary-contrast)]',
        className,
      )}
    >
      {children}
    </Link>
  )
}


