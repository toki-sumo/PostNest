// src/app/signin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSearchParams } from 'next/navigation';
import OAuthButton from "@/components/ui/OAuthButton";
import Spinner from "@/components/ui/Spinner";
import BackgroundDecoration from "@/components/common/BackgroundDecoration";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
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
        case 'Verification':
          setError('メールアドレスの確認が必要です。');
          break;
        case 'Default':
          setError('ログイン中にエラーが発生しました。もう一度お試しください。');
          break;
        default:
          setError('ログイン中にエラーが発生しました。もう一度お試しください。');
          break;
      }
    }
  }, [oauthError]);

  // フォームバリデーション
  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      errors.email = 'メールアドレスを入力してください。';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = '有効なメールアドレスを入力してください。';
    }
    
    if (!password.trim()) {
      errors.password = 'パスワードを入力してください。';
    } else if (password.length < 6) {
      errors.password = 'パスワードは6文字以上で入力してください。';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // エラーをクリア
  const clearErrors = () => {
    setError("");
    setValidationErrors({});
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    clearErrors();

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        switch (result.error) {
          case 'CredentialsSignin':
            setError('メールアドレスまたはパスワードが正しくありません。');
            break;
          case 'UserNotFound':
            setError('ユーザーが見つかりません。');
            break;
          case 'InvalidPassword':
            setError('パスワードが正しくありません。');
            break;
          case 'AccountDisabled':
            setError('アカウントが無効化されています。');
            break;
          default:
            setError('ログイン中にエラーが発生しました。もう一度お試しください。');
            break;
        }
      } else if (result?.ok) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError('予期せぬエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <BackgroundDecoration />
       
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md mx-auto p-6">
          {/* ログインフォーム */}
          <div className="backdrop-blur-sm rounded-2xl shadow-2xl border p-8 bg-[var(--card)] border-[var(--border)]">
            {/* ヘッダー */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-[color:var(--muted)]/15 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-[var(--text)] mb-2">ログイン</h1>
              <p className="text-[var(--text)]/85">PostNestにようこそ！<br />ゲスト用アカウント mail:guest@example.com, password:guestでログインできます</p>
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/15 border border-red-500/30 rounded-xl text-red-600 text-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* ログインフォーム */}
            <form onSubmit={handleSignin} className="space-y-6">
              {/* メールアドレス */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2 flex items-center">
                  <svg className="w-4 h-4 text-[var(--primary)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  メールアドレス
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="guest@example.com"
                  className="w-full px-4 py-3"
                />
                {validationErrors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* パスワード */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2 flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  パスワード
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="パスワードを入力"
                  className="w-full px-4 py-3"
                />
                {validationErrors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* ログインボタン */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Spinner size={4} />
                    <span className="ml-3">ログイン中...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>ログイン</span>
                  </div>
                )}
              </Button>
            </form>

            {/* 区切り線 */}
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border)]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[var(--card)] text-[var(--muted)]">または</span>
                </div>
              </div>
            </div>

            {/* OAuthボタン */}
            <div className="space-y-3">
              <OAuthButton provider="google" />
              <OAuthButton provider="github" />
            </div>

            {/* サインアップリンク */}
            <div className="mt-8 text-center">
              <p className="text-[var(--muted)] text-sm">
                アカウントをお持ちでない方は
                <a
                  href="/signup"
                  className="text-[var(--primary)] hover:opacity-80 font-medium transition-colors duration-300 ml-1"
                >
                  新規登録
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
