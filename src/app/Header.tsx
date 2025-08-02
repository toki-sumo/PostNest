'use client';

import Link from 'next/link';
import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from "next/navigation";

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === 'loading';
  const user = session?.user;

  return (
    <header className="fixed top-0 left-0 w-full bg-slate-800 text-white z-50 shadow py-5 px-10 flex border-b justify-between items-center">
      <h1 className="text-3xl font-extrabold text-gray-100 text-shadow-lg">
        <Link href="/">Article app</Link>
      </h1>

      <nav className="text-sm font-medium flex items-center space-x-4">
        {/* 記事投稿リンク（ログイン時のみ表示） */}
        {user && (
          <Link
            href="/articles/new"
            className="bg-gray-100 hover:bg-gray-500 hover:text-gray-100 text-gray-600 font-medium py-2 px-4 rounded-md cursor-pointer transition duration-200 shadow-md"
          >
            記事を書く
          </Link>
        )}
        {/* ダッシュボードリンク（ログイン時のみ表示） */}
        {user && (
          <Link
            href="/dashboard"
            className="text-xl underline text-gray-300 hover:text-white"
          >
            Dashboard
          </Link>
        )}
        {/* 管理者用リンク */}
        {user?.role === 'Admin' && (
          <Link
            href="/admin"
            className="text-xs underline text-gray-300 hover:text-white"
          >
            管理者ページ
          </Link>
        )}

        {/* ログイン状態の表示 */}
        {isLoading ? (
          <span>読み込み中...</span>
        ) : user ? (
          <div className="flex items-center space-x-2">
            <span className="text-gray-300 text-sm">
              ようこそ、{user.name ?? 'ゲスト'}さん
            </span>
            <button
              onClick={() => signOut()}
              className="text-xs bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push("/signin")}
              className="text-s bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              ログイン
            </button>
            <Link
              href="/signup"
              className="text-s bg-green-600 hover:bg-green-800 text-white px-3 py-1 rounded"
            >
              新規登録
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
