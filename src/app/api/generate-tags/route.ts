// app/api/generate-tags/route.ts
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    console.log("Generating tags...");
    const { content } = await req.json();
    // const prompt = `次のブログ記事の内容から関連するタグを3〜5個、日本語でJSON配列で出力してください。\n\n${content}`;
    const prompt = `次のブログ記事の内容から関連するタグを3〜5個、日本語でJSON配列で出力してください。\n\n テスト　テストです。NEXT.jsは、Reactのフレームワークで、サーバーサイドレンダリングや静的サイト生成をサポートしています。`;

    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // gpt-3.5でも可
        messages: [
            { role: "system", content: "あなたは有能なタグ生成アシスタントです。" },
            { role: "user", content: prompt },
        ],
    });

    const tagsText = chatCompletion.choices[0].message.content;

    try {
        const tags = JSON.parse(tagsText || "[]");
        return NextResponse.json({ tags });
    } catch {
        return NextResponse.json({ tags: [] });
    }

}
