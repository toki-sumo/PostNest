export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// セキュリティ系ユーティリティ
export function getRequestIp(req: Request | { headers: Headers }) {
  const h = 'headers' in req ? req.headers : new Headers()
  return (
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    '0.0.0.0'
  )
}

export function isSameOrigin(req: Request) {
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  if (!origin || !host) return false
  try {
    const o = new URL(origin)
    return o.host === host
  } catch {
    return false
  }
}

// 簡易レートリミッター（メモリ）
type Counter = { count: number; resetAt: number }
const rateStore = new Map<string, Counter>()

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const entry = rateStore.get(key)
  if (!entry || entry.resetAt < now) {
    rateStore.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }
  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }
  entry.count += 1
  return { allowed: true, remaining: Math.max(0, limit - entry.count), resetAt: entry.resetAt }
}
