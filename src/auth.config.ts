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
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // Map nulls to undefined for NextAuth compatibility
        return {
          ...user,
          name: user.name ?? undefined,
          email: user.email ?? undefined,
          emailVerified: user.emailVerified ?? undefined,
          image: user.image ?? undefined,
          password: user.password ?? undefined,
          role: user.role ?? undefined,
          bio: user.bio ?? undefined,
        };
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
      }
      if (trigger === "update") {
        console.log("trigger is update");
        token.name = session.name;
        token.bio = session.bio;
      }
      return token;
    },
    // async jwt({ token, user }) {
    //   if (user) {
    //     token.id = user.id;
    //     token.role = user.role;
    //     token.name = user.name;
    //     token.bio = user.bio;
    //   }
    //   return token;
    // },
    // async jwt({ token, user, trigger, session }) {
    //   if (trigger === "update" && session) {
    //     token.name = session.name;
    //     token.bio = session.bio;
    //   }
    //   return token;
    // },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.bio = token.bio as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },

} satisfies NextAuthConfig;
