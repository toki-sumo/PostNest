// 使用していません

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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
      // router.push("/dashboard");
      router.push("/");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-xl font-bold mb-4">ログイン</h1>

      {/* OAuthログインボタン群 */}
      <div className="flex flex-col space-y-3 mb-6">
        <button
          onClick={() =>
            signIn("google", { callbackUrl: "/dashboard" })
          }
          className="w-full bg-red-600 text-white py-2 rounded"
        >
          Googleでログイン
        </button>
        <button
          onClick={() =>
            // signIn("github", { callbackUrl: "/dashboard" })
            signIn("github", { callbackUrl: "/" })
          }
          className="w-full bg-gray-800 text-white py-2 rounded"
        >
          GitHubでログイン
        </button>
      </div>

      {/* 仕切り線 */}
      <div className="flex items-center mb-6">
        <hr className="flex-grow border-gray-900" />
        <span className="mx-4 text-gray-900 text-m">または</span>
        <hr className="flex-grow border-gray-900" />
      </div>

      {/* メールアドレスログインフォーム */}
      <form onSubmit={handleSignin} className="space-y-4">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          ログイン
        </button>
      </form>
    </div>
  );
}
