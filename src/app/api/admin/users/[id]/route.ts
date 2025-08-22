import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type PatchBody =
  | { action: 'setRole'; role: 'Admin' | 'user' | 'DISABLED' }
  | { action: 'disable' }
  | { action: 'enable' }

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = params
  let body: PatchBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  try {
    let nextRole: 'Admin' | 'user' | 'DISABLED'
    if (body.action === 'setRole') {
      nextRole = body.role
    } else if (body.action === 'disable') {
      nextRole = 'DISABLED'
    } else if (body.action === 'enable') {
      // 有効化時は通常ユーザーに戻す（必要に応じてUIから setRole でAdminへ昇格可）
      nextRole = 'user'
    } else {
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }

    const updated = await db.user.update({
      where: { id },
      data: { role: nextRole },
      select: { id: true, name: true, email: true, role: true },
    })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}


