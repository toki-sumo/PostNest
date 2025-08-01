import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db"
import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

// const prisma = new PrismaClient();

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   // debug: !!process.env.AUTH_DEBUG,
//   adapter: PrismaAdapter(db),
//   session: { strategy: 'jwt' },
//   ...authConfig,
//   // providers: [
//   //   GoogleProvider({
//   //     clientId: process.env.GOOGLE_ID!,
//   //     clientSecret: process.env.GOOGLE_SECRET!,
//   //   }),
//   //   GitHub({
//   //     clientId: process.env.GITHUB_ID!,
//   //     clientSecret: process.env.GITHUB_SECRET!,
//   //   }),
//   //   CredentialsProvider({
//   //     name: "Email",
//   //     credentials: {
//   //       email: { label: "メールアドレス", type: "email", placeholder: "example@example.com" },
//   //       password: { label: "パスワード", type: "password" },
//   //     },
//   //     async authorize(
//   //       credentials: Partial<Record<"email" | "password", unknown>> | undefined
//   //     ) {
//   //       if (
//   //         !credentials ||
//   //         typeof credentials.email !== "string" ||
//   //         typeof credentials.password !== "string"
//   //       ) {
//   //         return null;
//   //       }

//   //       const user = await db.user.findUnique({
//   //         where: { email: credentials.email },
//   //       });
//   //       if (!user || !user.password) return null;

//   //       const isValid = await bcrypt.compare(credentials.password, user.password);
//   //       if (!isValid) return null;

//   //       return user;
//   //     },
//   //   }),
//   // ],

//   // secret: process.env.NEXTAUTH_SECRET,
//   // callbacks: {
//   //   async session({ session, user }) {
//   //     if (session.user) {
//   //       session.user.id = user.id;
//   //       session.user.role = user.role;
//   //     }
//   //     return session;
//   //   },
//   // },
// });
