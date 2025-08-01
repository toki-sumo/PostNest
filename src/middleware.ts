// src/middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await auth();

  const { pathname } = req.nextUrl;
  const protectedPaths = ["/dashboard"]; // 認証が必要なパスを追加していく

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !session) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/signin";
    loginUrl.searchParams.set("callbackUrl", pathname); // ログイン後戻すため
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// middleware を有効にするパスを定義
export const config = {
  matcher: ["/dashboard/:path*"],
};




// // src/middleware.ts
// import { auth } from "@/auth";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export async function middleware(req: NextRequest) {
//   const session = await auth();
//   // console.log("middlewareのsession情報です。session : ", session);
//   // if (!session) {
//   //   console.log("ユーザーは未認証です。ログインページにリダイレクトします。");
//   //   return NextResponse.redirect(new URL("/signin", req.url));
//   // }

//   // const { pathname } = req.nextUrl;

//   // const protectedPaths = ["/dashboard"];
//   // const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

//   // if (isProtected && !session) {
//   //   const loginUrl = req.nextUrl.clone();
//   //   loginUrl.pathname = "/signin";
//   //   loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
//   //   return NextResponse.redirect(loginUrl);
//   // }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*"],
//   // matcher: ["/aaaa/:path*"],
// };

