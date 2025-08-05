// types/next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      name?: string
      email?: string
      bio?: string
    }
  }

  interface User {
    id: string
    role: string
    name?: string
    email?: string
    bio?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    name?: string
    email?: string
    bio?: string
  }
}
