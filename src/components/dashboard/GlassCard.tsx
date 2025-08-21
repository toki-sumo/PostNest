'use client'

import clsx from 'clsx'
import { ReactNode, Component, type ErrorInfo, useMemo } from 'react'
import Card from '../ui/Card'

type Props = {
  children: ReactNode
  className?: string
  onClick?: () => void
  fallback?: ReactNode
}

class ErrorBoundary extends Component<{
  fallback?: ReactNode
  children: ReactNode
}, { hasError: boolean; error?: unknown }> {
  constructor(props: { fallback?: ReactNode; children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    // 最低限のロギング
    console.error('GlassCard ErrorBoundary caught an error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className={clsx(
          'backdrop-blur-sm rounded-2xl shadow-lg border p-4',
          'bg-[var(--card)] border-[var(--border)] text-[var(--text)]',
        )}>
          コンテンツの表示中にエラーが発生しました。
        </div>
      )
    }
    return this.props.children
  }
}

export default function GlassCard({ children, className, onClick, fallback }: Props) {
  const safeOnClick = useMemo(() => {
    if (!onClick) return undefined
    return () => {
      try {
        onClick()
      } catch (error) {
        console.error('GlassCard onClick error:', error)
      }
    }
  }, [onClick])

  return (
    <ErrorBoundary fallback={fallback}>
      <Card onClick={safeOnClick} className={clsx(className)}>
        {children}
      </Card>
    </ErrorBoundary>
  )
}


