'use client'

import { useState } from 'react'

type Props = {
  src?: string
  alt?: string
  className?: string
}

export default function AvatarImage({ src, alt = 'avatar', className }: Props) {
  const [url, setUrl] = useState<string>(src || '/guest_icon.png')
  const [retry, setRetry] = useState<number>(0)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url || '/guest_icon.png'}
      alt={alt}
      className={className}
      onError={() => {
        if (!url || url.includes('/guest_icon.png')) return
        if (retry < 2) {
          setRetry(retry + 1)
          const sep = url.includes('?') ? '&' : '?'
          setUrl(`${url}${sep}v=${Date.now()}`)
        } else {
          setUrl('/guest_icon.png')
        }
      }}
    />
  )
}


