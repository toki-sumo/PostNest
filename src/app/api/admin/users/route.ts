import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const users = await db.user.findMany({
    orderBy: { id: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      _count: { select: { Article: true, subscriptions: true } },
    },
  })

  return NextResponse.json(users)
}


