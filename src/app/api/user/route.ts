// src/app/api/user/route.ts

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ message: "認証が必要です" }, { status: 401 })
  }

  const { name, bio } = await req.json()

  await db.user.update({
    where: { id: session.user.id },
    data: {
      name,
      bio,
    },
  })

  return NextResponse.json({ message: "更新しました" })
}
