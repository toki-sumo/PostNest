// auth.config.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import GitHub from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [GitHub, GoogleProvider, CredentialsProvider],
  adapter: PrismaAdapter(db),
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/signin", // ログインページのルーティング
  },
} satisfies NextAuthConfig;
