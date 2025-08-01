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
    // strategy: "database",
    strategy: 'jwt',
  },
  // pages: {
  //   signIn: "/signin", // ログインページのルーティング
  //     error: "/auth/error",
  // },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
