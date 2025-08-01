// auth.config.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import GitHub from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";

export const authConfig = {
  // providers: [GitHub, GoogleProvider, CredentialsProvider],
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "メールアドレス", type: "email", placeholder: "example@example.com" },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(
        credentials: Partial<Record<"email" | "password", unknown>> | undefined
      ) {
        if (
          !credentials ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return user;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  // adapter: PrismaAdapter(db),
  // session: {
  //   strategy: 'jwt',
  // },
  pages: {
    signIn: "/signin", // ログインページのルーティング
    error: "/auth/error",
  },
  // callbacks: {
  //   async session({ session, user }) {
  //     if (session.user) {
  //       session.user.id = user.id;
  //       session.user.role = user.role;
  //     }
  //     return session;
  //   },
  // },
} satisfies NextAuthConfig;
