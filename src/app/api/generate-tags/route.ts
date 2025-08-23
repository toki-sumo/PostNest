import { NextResponse } from 'next/server'
import { GoogleGenAI } from "@google/genai";
import { auth } from '@/auth'
import { getRequestIp, rateLimit, isSameOrigin } from '@/lib/utils'

// export const runtime = 'edge' // App Router用

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  }

  const ip = getRequestIp(req)
  const key = `gen-tags:${session.user.id}:${ip}`
  const rl = rateLimit(key, 10, 60_000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { title } = await req.json();
  const safeTitle = String(title ?? '').slice(0, 120)
  if (!safeTitle) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  }

  const ai = new GoogleGenAI({});
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a blog assistant that generates relevant and concise tags from blog titles.

    Task:
    Given a Japanese blog title, generate exactly 3 relevant and short tags in Japanese. Do not translate to English.
    Only return the tags, separated by commas, without explanations or quotation marks.

    Examples:
    Title: 「AIが人間を超える未来」
    Output: AI, 人工知能, テクノロジー

    Title: 「子育てに役立つ最新アプリ」
    Output: 子育て, アプリ, ライフスタイル

    Title: 「キャリアアップに必要なスキルとは？」
    Output: キャリア, スキル, 働き方

    Now generate tags for the following title:
    Title: 「${safeTitle}」`
  });

  const data = res?.text ?? "";
  const tags = data
    .replace(/["「」]/g, "")
    .split(/[,\n、]/)
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .slice(0, 3)
  return NextResponse.json({ tags })
}
