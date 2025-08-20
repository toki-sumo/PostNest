// src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

// メールアドレスからユーザー名を生成する関数
function generateUsernameFromEmail(email: string): string {
    // メールアドレスの@より前の部分を取得
    const localPart = email.split('@')[0];
    
    // 特殊文字を除去し、アンダースコアに置換
    const cleanUsername = localPart.replace(/[^a-zA-Z0-9]/g, '_');
    
    // 数字で始まる場合は'user_'をプレフィックスとして追加
    const username = /^\d/.test(cleanUsername) ? `user_${cleanUsername}` : cleanUsername;
    
    return username;
}

export async function POST(req: NextRequest) {
    const { email, password } = await req.json()

    if (!email || !password) {
        return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        return NextResponse.json({ message: "Email is already used" }, { status: 400 })
    }

    const hashedPassword = await hash(password, 10)
    const username = generateUsernameFromEmail(email)

    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: username,
            role: "user",
            bio: "よろしくお願いします！", // デフォルトの自己紹介も設定
        },
    })

    return NextResponse.json({ 
        message: "User created successfully",
        username: username 
    }, { status: 201 })
}
