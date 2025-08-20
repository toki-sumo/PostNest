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
    
    // フォームバリデーション
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    clearErrors();

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false, // リダイレクトを無効にして結果を確認
      });

      if (result?.error) {
        // ログイン失敗時のエラーハンドリング
        switch (result.error) {
          case 'CredentialsSignin':
            setError('メールアドレスまたはパスワードが正しくありません。');
            break;
          case 'UserNotFound':
            setError('このメールアドレスで登録されたアカウントが見つかりません。');
            break;
          case 'NoPassword':
            setError('このアカウントはパスワード認証に対応していません。OAuthログインをお試しください。');
            break;
          case 'InvalidPassword':
            setError('パスワードが正しくありません。');
            break;
          case 'AccountDisabled':
            setError('アカウントが無効化されています。管理者に連絡してください。');
            break;
          case 'OAuthAccountNotLinked':
            setError('このメールアドレスは別のログイン方法で既に使われています。');
            break;
          case 'InvalidCredentials':
            setError('無効な認証情報です。');
            break;
          default:
            setError('ログインに失敗しました。もう一度お試しください。');
            break;
        }
      } else if (result?.ok) {
        // ログイン成功
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('予期しないエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  // 入力フィールドの変更時にエラーをクリア
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (validationErrors.email) {
      setValidationErrors(prev => ({ ...prev, email: undefined }));
    }
    if (error) clearErrors();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (validationErrors.password) {
      setValidationErrors(prev => ({ ...prev, password: undefined }));
    }
    if (error) clearErrors();
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-md mx-auto p-6 border rounded-lg shadow-lg bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">ログイン</h1>

      {/* OAuthボタン */}
      <div className="flex flex-col space-y-3 mb-6">
        <OAuthButton provider="google" />
        <OAuthButton provider="github" />
      </div>

      {/* 仕切り線 */}
      <div className="flex items-center mb-6">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-4 text-gray-500 text-sm">または</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* メールアドレスログインフォーム */}
      <form onSubmit={handleSignin} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={handleEmailChange}
            required
            disabled={isLoading}
            className={validationErrors.email ? 'border-red-500' : ''}
          />
          {validationErrors.email && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
          )}
        </div>

        <div>
          <Input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={handlePasswordChange}
            required
            disabled={isLoading}
            className={validationErrors.password ? 'border-red-500' : ''}
          />
          {validationErrors.password && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
          )}
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* ログインボタン */}
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Spinner size={16} />
              <span>ログイン中...</span>
            </>
          ) : (
            'ログイン'
          )}
        </Button>
      </form>

      {/* サインアップリンク */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          アカウントをお持ちでない方は{' '}
          <a 
            href="/signup" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            こちら
          </a>
        </p>
      </div>
    </div>
    </div>
  );
}
