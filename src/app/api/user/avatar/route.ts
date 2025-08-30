import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createAvatarPresignedPost } from '@/lib/s3'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { contentType } = await req.json()
  if (!contentType || !/^image\//.test(contentType)) {
    return NextResponse.json({ error: 'Invalid contentType' }, { status: 400 })
  }

  const key = `avatars/original/${session.user.id}/${Date.now()}`
  const data = await createAvatarPresignedPost(key, contentType)
  return NextResponse.json(data)
}


