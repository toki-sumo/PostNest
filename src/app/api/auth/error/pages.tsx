// src/app/auth/error/page.tsx (Next.js App Routerの場合)

"use client";

import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div>
      <h1>認証エラーが発生しました</h1>
      <p>{error}</p>
      <p>もう一度試してください。</p>
    </div>
  );
}
