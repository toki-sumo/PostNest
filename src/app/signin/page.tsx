// src/app/signin/pagetsx
"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // 作成したButtonコンポーネントをimport
import { Input } from "@/components/ui/input"; // 作成したInputコンポーネントをimport
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthError = searchParams.get('error');

  useEffect(() => {
    if (oauthError) {
      switch (oauthError) {
        case 'OAuthAccountNotLinked':
          setError('そのメールアドレスは別のログイン方法で既に使われています。');
          break;
        case 'AccessDenied':
          setError('OAuthプロバイダーでのアクセスが拒否されました。');
          break;
        case 'Configuration':
          setError('OAuth設定エラーが発生しました。管理者に連絡してください。');
          break;
        default:
          setError('ログイン中にエラーが発生しました。もう一度お試しください。');
          break;
      }
    }
  }, [oauthError]);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res && res?.error) {
      setError("メールアドレスかパスワードが違います");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-xl font-bold mb-4">ログイン</h1>

      <div className="flex flex-col space-y-3 mb-6">
        <Button variant="danger" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
          Googleでログイン
        </Button>
        <Button variant="secondary" onClick={() => signIn("github", { callbackUrl: "/dashboard" })}>
          GitHubでログイン
        </Button>
      </div>

      {/* 仕切り線 */}
      <div className="flex items-center mb-6">
        <hr className="flex-grow border-gray-900" />
        <span className="mx-4 text-gray-900 text-m">または</span>
        <hr className="flex-grow border-gray-900" />
      </div>

      {/* メールアドレスログインフォーム */}
      <form onSubmit={handleSignin} className="space-y-4">
        {/* Inputコンポーネントを使用 */}
        <Input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit">
          ログイン
        </Button>
      </form>
    </div>
  );
}
