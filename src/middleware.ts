// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicPaths = ["/", "/signin", "/signup", "/favicon.ico"];

  const isPublicPath =
    publicPaths.includes(pathname) ||
    pathname === "/articles" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.endsWith(".svg");

  // 公開パスは認証確認をスキップ（UntrustedHost を避ける）
  if (isPublicPath) {
    return NextResponse.next();
  }

  // 記事詳細などの保護: クッキーにセッショントークンが無ければサインインへ
  const hasSessionToken =
    req.cookies.has("__Secure-authjs.session-token") ||
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("next-auth.session-token")

  if (!isPublicPath && !hasSessionToken) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/signin";
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon.ico|.*\\.svg$).*)',
  ],
};
