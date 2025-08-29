// src/app/api/user/route.ts

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ message: "認証が必要です" }, { status: 401 })
  }

  // CSRF: 同一オリジンのみ許可
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  if (!origin || !host || new URL(origin).host !== host) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  }

  const { name, bio, image } = await req.json()
  const safeName = String(name ?? '').slice(0, 50)
  const safeBio = String(bio ?? '').slice(0, 500)

  await db.user.update({
    where: { id: session.user.id },
    data: {
      name: safeName,
      bio: safeBio,
      image: image ? String(image).slice(0, 500) : undefined,
    },
  })

  return NextResponse.json({ message: "更新しました" })
}
