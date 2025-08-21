import NextAuth from "next-auth";
export const runtime = 'nodejs'
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut, } = NextAuth({
  ...authConfig,
});
