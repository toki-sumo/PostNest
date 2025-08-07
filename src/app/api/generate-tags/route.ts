import { NextResponse } from 'next/server'
import { GoogleGenAI } from "@google/genai";

// export const runtime = 'edge' // App Router用

export async function POST(req: Request) {
    const ai = new GoogleGenAI({});

    const { title } = await req.json();

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
        Title: 「${title}」`
    });

    const data = res?.text ?? "";
    console.log("data :", data);
    const tags = data
        .replace(/["「」]/g, "")
        .split(/[,\n、]/)
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    console.log("tags : ", tags);
    return NextResponse.json({ tags })
}
