// auth.config.ts
import { db } from "@/lib/db";
import GitHub from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
// import {  DefaultSession,  NextAuthOptions,  getServerSession,} from "next-auth";

// declare module "next-auth" {
//   interface User {
//     role: string;
//   }
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       role: string;
//     } & DefaultSession["user"];
//   }
// }

// declare module "next-auth" {
//   interface JWT {
//     id: string;
//     role: string;
//   }
// }

export const authConfig = {
  
  adapter: PrismaAdapter(db),

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
  session: { strategy: 'jwt' },

  secret: process.env.NEXTAUTH_SECRET,
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      console.log("jwt user : ", user)
      console.log("user id : ", token.id)
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        // session.user.role = 'guest';
      }
      return session;
    },
    // async session({ session, user }) {
    //   // if (session.user) {
    //   //   session.user.id = user?.id;       // IDを追加（必要であれば）
    //   //   session.user.role = user?.role;   // PrismaのUser.roleを追加
    //   // }
    //   console.log("user : ", user)
    //   // console.log("session : ", session.user)
    //   // console.log("session role : ", session.user.role)
    //   return session;
    // },

  },

  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },

} satisfies NextAuthConfig;
