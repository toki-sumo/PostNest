import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  // 公開パスの定義
  const publicPaths = ["/", "/signin", "/signup", "/favicon.ico"];

  const isPublicPath =
    publicPaths.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.endsWith(".svg");

  if (!isPublicPath && !session) {
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
