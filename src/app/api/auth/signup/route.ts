// src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma" // あなたのPrismaクライアントの場所に応じて修正

export async function POST(req: Request) {
    const { email, password } = await req.json()

    if (!email || !password) {
        return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await hash(password, 10)

    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: "user",
        },
    })

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
}
