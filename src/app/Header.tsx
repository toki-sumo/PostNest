'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider'
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from "next/navigation";
import LinkButton from '@/components/ui/LinkButton';

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isLoading = status === 'loading';
  const user = session?.user;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 w-full z-500 text-[var(--text)] relative
      bg-[color:var(--bg)] backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
      {/* メインヘッダー */}
      <div className="px-4 lg:px-8 h-[80px] flex items-center">
        <div className="flex justify-between items-stretch w-full h-full">
          {/* ロゴ */}
          <h1 className="text-xl lg:text-2xl font-bold text-[var(--text)] h-full flex items-center">
            <Link 
              href="/" 
              onClick={closeMenu}
              className="p-0 relative text-[var(--text)] hover:text-[var(--primary)] transition-colors duration-200 h-full flex items-center leading-none"
            >
              PostNest
            </Link>
          </h1>

          {/* デスクトップナビゲーション（右寄せ） */}
          <nav className="hidden lg:flex items-stretch space-x-6 ml-auto h-full">
            {/* 記事一覧リンク */}
            <Link
              href="/articles"
              className="relative flex items-center self-stretch p-0 text-[var(--text)]/85 hover:text-[var(--primary)] transition-colors duration-200 "
            >
              記事一覧
            </Link>
            
            {/* 記事投稿リンク（ログイン時のみ表示） */}
            {user && (
              <Link
                href="/articles/new"
                className="relative flex items-center self-stretch p-0 text-[var(--text)]/85 hover:text-[var(--primary)] transition-colors duration-200 "
              >記事を書く</Link>
            )}
            
            {/* ダッシュボードリンク（ログイン時のみ表示） */}
            {user && (
              <Link
                href="/dashboard"
                className="relative flex items-center self-stretch p-0 text-[var(--text)]/85 hover:text-[var(--primary)] transition-colors duration-200 "
              >
                ダッシュボード
              </Link>
            )}
            
            {/* 管理者用リンク */}
            {user?.role === 'Admin' && (
              <Link
                href="/admin"
                className="relative flex items-center self-stretch p-0 text-[var(--text)]/85 hover:text-[var(--primary)] transition-colors duration-200 "
              >
                管理者
              </Link>
            )}

            {/* テーマトグル */}
            <button
              onClick={toggleTheme}
              className="p-0 inline-block relative text-[var(--text)]/85 hover:text-[var(--primary)] transition-colors duration-200  h-full flex items-center"
              aria-label="テーマ切り替え"
              title="テーマ切り替え"
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>

            {/* ログイン状態の表示 */}
            {isLoading ? (
              <div className="flex items-center space-x-2 h-full">
                <div className="w-4 h-4 border-2 border-[var(--muted)] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[var(--muted)] text-sm">読み込み中...</span>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-3 h-full">
                <span className="text-[var(--text)]/85 text-sm font-medium">
                  {user.name ?? 'ゲスト'}さん
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-0 inline-block relative text-[var(--text)]/85 hover:text-[var(--primary)] transition-colors duration-200  h-full flex items-center"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 h-full">
                <button
                  onClick={() => router.push("/signin")}
                  className="p-0 inline-block relative text-[var(--text)]/85 hover:text-[var(--primary)] transition-colors duration-200  h-full flex items-center"
                >
                  ログイン
                </button>
                <Link
                  href="/signup"
                  className="p-0 inline-block relative text-[var(--text)]/85 hover:text-[var(--primary)] transition-colors duration-200  h-full flex items-center"
                >新規登録</Link>
              </div>
            )}
          </nav>

          {/* ハンバーガーメニューボタン */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg text-[var(--text)]/85 hover:text-[var(--text)] hover:bg-[color:var(--muted)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 transition-colors duration-200 h-full flex items-center"
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
        <div className="bg-[var(--card)] border-t border-[var(--border)] px-4 py-4 space-y-3 shadow-lg">
          {/* 記事一覧リンク */}
          <Link
            href="/articles"
            onClick={closeMenu}
            className="block w-full text-[var(--text)]/85 hover:text-[var(--text)] py-3 px-4 rounded-lg text-center font-medium hover:bg-[color:var(--muted)]/10 transition-colors duration-200"
          >
            記事一覧
          </Link>
          
          {/* 記事投稿リンク（ログイン時のみ表示） */}
          {user && (
            <LinkButton href="/articles/new" className="block w-full text-center">記事を書く</LinkButton>
          )}
          
          {/* ダッシュボードリンク（ログイン時のみ表示） */}
          {user && (
            <Link
              href="/dashboard"
              onClick={closeMenu}
              className="block w-full text-[var(--text)]/85 hover:text-[var(--text)] py-3 px-4 rounded-lg text-center font-medium hover:bg-[color:var(--muted)]/10 transition-colors duration-200"
            >
              ダッシュボード
            </Link>
          )}
          
          {/* 管理者用リンク */}
          {user?.role === 'Admin' && (
            <Link
              href="/admin"
              onClick={closeMenu}
              className="block w-full text-[var(--text)]/85 hover:text-red-500 py-3 px-4 rounded-lg text-center font-medium hover:bg-[color:var(--muted)]/10 transition-colors duration-200"
            >
              管理者ページ
            </Link>
          )}

          {/* ログイン状態の表示 */}
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2 py-4 text-[var(--muted)]">
              <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">読み込み中...</span>
            </div>
          ) : user ? (
            <div className="space-y-3 pt-2 border-t border-[var(--border)]">
              <div className="text-center py-3 text-[var(--text)]/85 font-medium bg-[var(--card)] rounded-lg">
                ようこそ、{user.name ?? 'ゲスト'}さん
              </div>
              <button
                onClick={() => {
                  closeMenu();
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full font-medium py-3 px-4 rounded-lg text-center transition-colors duration-200 bg-[var(--card)] text-[var(--text)] hover:border-[var(--card-hover-border)] hover:opacity-90 border border-[var(--border)]"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-2 border-t border-[var(--border)]">
              <button
                onClick={() => {
                  closeMenu();
                  router.push("/signin");
                }}
                className="w-full font-medium py-3 px-4 rounded-lg text-center transition-colors duration-200 shadow-sm hover:opacity-90 bg-[var(--primary)] text-[var(--primary-contrast)]"
              >
                ログイン
              </button>
              <LinkButton href="/signup" className="block w-full text-center">新規登録</LinkButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
