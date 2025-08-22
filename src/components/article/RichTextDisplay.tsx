'use client'
import { useEffect, useState } from 'react'

type RichTextDisplayProps = {
  content: string;
  className?: string;
};

type DomPurifyLike = { sanitize: (html: string, options?: unknown) => string }

const RichTextDisplay = ({ content, className = '' }: RichTextDisplayProps) => {
  const [sanitized, setSanitized] = useState<string>('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const mod = (await import('isomorphic-dompurify')) as unknown as DomPurifyLike & { default?: DomPurifyLike }
        const sanitizeFn = (mod.default?.sanitize ?? mod.sanitize) as DomPurifyLike['sanitize']
        const purified = sanitizeFn(String(content ?? ''), { USE_PROFILES: { html: true } })
        if (active) setSanitized(purified)
      } catch (error) {
        console.error('DOMPurify load/sanitize failed:', error)
        if (active) setSanitized(String(content ?? ''))
      }
    })()
    return () => { active = false }
  }, [content])

  return (
    <div
      className={`rich-text-display max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  )
}

export default RichTextDisplay;
