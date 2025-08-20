'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from "next/navigation";

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoading = status === 'loading';
  const user = session?.user;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-slate-900 border-b border-slate-700 text-white z-50 shadow-lg">
      {/* メインヘッダー */}
      <div className="px-4 py-4 lg:px-8 lg:py-5">
        <div className="flex justify-between items-center">
          {/* ロゴ */}
          <h1 className="text-xl lg:text-2xl font-bold text-white">
            <Link 
              href="/" 
              onClick={closeMenu}
              className="hover:text-slate-300 transition-colors duration-200"
            >
              PostNest
            </Link>
          </h1>

          {/* デスクトップナビゲーション */}
          <nav className="hidden lg:flex items-center space-x-6">
            {/* 記事一覧リンク */}
            <Link
              href="/articles"
              className="text-slate-300 hover:text-slate-200 font-medium transition-colors duration-200 py-2 px-3 rounded-md hover:bg-slate-800"
            >
              記事一覧
            </Link>
            
            {/* 記事投稿リンク（ログイン時のみ表示） */}
            {user && (
              <Link
                href="/articles/new"
                className="bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                記事を書く
              </Link>
            )}
            
            {/* ダッシュボードリンク（ログイン時のみ表示） */}
            {user && (
              <Link
                href="/dashboard"
                className="text-slate-300 hover:text-slate-200 font-medium transition-colors duration-200 py-2 px-3 rounded-md hover:bg-slate-800"
              >
                ダッシュボード
              </Link>
            )}
            
            {/* 管理者用リンク */}
            {user?.role === 'Admin' && (
              <Link
                href="/admin"
                className="text-slate-300 hover:text-red-400 font-medium transition-colors duration-200 py-2 px-3 rounded-md hover:bg-slate-800"
              >
                管理者
              </Link>
            )}

            {/* ログイン状態の表示 */}
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-slate-400 text-sm">読み込み中...</span>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <span className="text-slate-300 text-sm font-medium">
                  {user.name ?? 'ゲスト'}さん
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-3 rounded-lg transition-colors duration-200"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push("/signin")}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  ログイン
                </button>
                <Link
                  href="/signup"
                  className="bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  新規登録
                </Link>
              </div>
            )}
          </nav>

          {/* ハンバーガーメニューボタン */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200"
            aria-label="メニューを開く"
          >
            <svg
              className={`h-6 w-6 transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* モバイルナビゲーションメニュー */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-slate-800 border-t border-slate-700 px-4 py-4 space-y-3 shadow-lg">
          {/* 記事一覧リンク */}
          <Link
            href="/articles"
            onClick={closeMenu}
            className="block w-full text-slate-300 hover:text-slate-200 py-3 px-4 rounded-lg text-center font-medium hover:bg-slate-700 transition-colors duration-200"
          >
            記事一覧
          </Link>
          
          {/* 記事投稿リンク（ログイン時のみ表示） */}
          {user && (
            <Link
              href="/articles/new"
              onClick={closeMenu}
              className="block w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors duration-200 shadow-sm"
            >
              記事を書く
            </Link>
          )}
          
          {/* ダッシュボードリンク（ログイン時のみ表示） */}
          {user && (
            <Link
              href="/dashboard"
              onClick={closeMenu}
              className="block w-full text-slate-300 hover:text-slate-200 py-3 px-4 rounded-lg text-center font-medium hover:bg-slate-700 transition-colors duration-200"
            >
              ダッシュボード
            </Link>
          )}
          
          {/* 管理者用リンク */}
          {user?.role === 'Admin' && (
            <Link
              href="/admin"
              onClick={closeMenu}
              className="block w-full text-slate-300 hover:text-red-400 py-3 px-4 rounded-lg text-center font-medium hover:bg-slate-700 transition-colors duration-200"
            >
              管理者ページ
            </Link>
          )}

          {/* ログイン状態の表示 */}
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2 py-4 text-slate-400">
              <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">読み込み中...</span>
            </div>
          ) : user ? (
            <div className="space-y-3 pt-2 border-t border-slate-700">
              <div className="text-center py-3 text-slate-300 font-medium bg-slate-700 rounded-lg">
                ようこそ、{user.name ?? 'ゲスト'}さん
              </div>
              <button
                onClick={() => {
                  closeMenu();
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-3 px-4 rounded-lg text-center transition-colors duration-200"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-2 border-t border-slate-700">
              <button
                onClick={() => {
                  closeMenu();
                  router.push("/signin");
                }}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors duration-200 shadow-sm"
              >
                ログイン
              </button>
              <Link
                href="/signup"
                onClick={closeMenu}
                className="block w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors duration-200 shadow-sm"
              >
                新規登録
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
