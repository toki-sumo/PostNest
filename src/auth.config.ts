// auth.config.ts
import { db } from "@/lib/db";
import GitHub from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const authConfig = {

  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },

  jwt: {
    maxAge: 3 * 24 * 60 * 60, // 3日
  },

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
          throw new Error("InvalidCredentials");
        }

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error("UserNotFound");
          }

          if (!user.password) {
            throw new Error("NoPassword");
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("InvalidPassword");
          }

          // アカウントが無効化されているかチェック
          if (user.role === "DISABLED") {
            throw new Error("AccountDisabled");
          }

          const { password, ...userWithoutPassword } = user;
          return {
            ...userWithoutPassword,
            name: user.name ?? undefined,
            email: user.email ?? undefined,
            emailVerified: user.emailVerified ?? undefined,
            image: user.image ?? undefined,
            role: user.role ?? undefined,
            bio: user.bio ?? undefined,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw error;
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.bio = user.bio;
        token.image = user.image;
      }
      if (trigger === "update" && session) {
        token.name = session.name;
        token.bio = session.bio;
        // propagate image on client-side session update
        // @ts-ignore
        token.image = (session as any).image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.bio = token.bio as string;
        session.user.image = token.image as string | undefined;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // OAuthログイン時の追加チェック
      if (account?.provider !== "credentials") {
        // 既存ユーザーのメールアドレスとOAuthアカウントのリンク確認
        if (user.email) {
          const existingUser = await db.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser && existingUser.password) {
            // パスワード認証で既に存在するユーザーの場合
            throw new Error("OAuthAccountNotLinked");
          }
        }
      }
      return true;
    },
  },

  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User signed in: ${user.email} via ${account?.provider}`);
    },
    async signOut() {
      console.log("User signed out");
    },
  },

} satisfies NextAuthConfig;
