'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type Theme = 'dark' | 'light'

type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')

  // 初期テーマ: localStorage > OSのprefers-color-scheme > dark
  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? (localStorage.getItem('theme') as Theme | null) : null
      if (stored === 'light' || stored === 'dark') {
        setThemeState(stored)
        document.documentElement.setAttribute('data-theme', stored)
        return
      }
      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      const initial: Theme = prefersLight ? 'light' : 'dark'
      setThemeState(initial)
      document.documentElement.setAttribute('data-theme', initial)
    } catch {}
  }, [])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    if (typeof window !== 'undefined') localStorage.setItem('theme', t)
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }, [theme, setTheme])

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}


