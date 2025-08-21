// src/app/page.tsx
import Link from "next/link";
import ArticleList from "./articles/page";
import BackgroundDecoration from "@/components/common/BackgroundDecoration";
import { headers } from "next/headers";

export default async function Home() {
  const hdrs = await headers();
  const host = hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;
  const res = await fetch(`${baseUrl}/api/articles`, {
    cache: "no-store",
  });
  const allArticles = await res.json();
  const latestArticles = allArticles.slice(0, 3); // 最新3件

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* 背景の装飾要素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* 浮遊する幾何学的図形 */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* グリッドパターン */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* ヒーローセクション */}
      <section className="relative pt-32 pb-20 px-4 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center relative z-10">
            {/* メインタイトル */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-100 leading-tight mb-6">
                Web開発の
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  未来
                </span>
                を創造
              </h1>
            </div>

            {/* サブタイトル */}
            <p className="text-xl md:text-2xl lg:text-3xl text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
              最新のWeb技術から実践的なTipsまで、<br className="hidden lg:block" />
              <span className="text-blue-300 font-medium">開発者のための知識プラットフォーム</span>
            </p>

            {/* CTAボタン */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                href="/articles"
                className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 overflow-hidden"
              >
                <span className="relative z-10">記事を探す</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                href="/signup"
                className="group relative px-10 py-5 bg-transparent text-white text-xl font-bold rounded-2xl border-2 border-white/30 hover:border-white/60 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                <span className="relative z-10">無料で始める</span>
                <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>

            {/* 統計情報 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2 group-hover:text-blue-300 transition-colors duration-300">
                  100+
                </div>
                <div className="text-slate-400 text-lg">技術記事</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2 group-hover:text-purple-300 transition-colors duration-300">
                  24/7
                </div>
                <div className="text-slate-400 text-lg">更新中</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2 group-hover:text-green-300 transition-colors duration-300">
                  1000+
                </div>
                <div className="text-slate-400 text-lg">開発者</div>
              </div>
            </div>
          </div>
        </div>

        {/* スクロールインジケーター */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* 最新記事セクション */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              最新の
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                記事
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              最新のWeb開発情報をお届けします
            </p>
          </div>
          
          {latestArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {latestArticles.map((article: any, index: number) => (
                <div 
                  key={article.id} 
                  className="group relative bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl border border-slate-600/30 overflow-hidden hover:border-slate-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* カードの背景効果 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative p-8">
                    <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2 group-hover:text-blue-300 transition-colors duration-300">
                      {article.title}
                    </h3>
                    <p className="text-slate-300 mb-6 line-clamp-3 leading-relaxed">
                      {article.content.replace(/<[^>]*>/g, '')}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">
                        {new Date(article.createdAt).toLocaleDateString('ja-JP')}
                      </span>
                      <Link
                        href={`/articles/${article.id}`}
                        className="text-blue-400 hover:text-blue-300 font-semibold group-hover:translate-x-1 transition-all duration-300"
                      >
                        続きを読む →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-400 text-xl">まだ記事がありません</p>
            </div>
          )}
          
          <div className="text-center">
            <Link
              href="/articles"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              すべての記事を見る
              <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              なぜ
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                PostNest
              </span>
              なのか
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              開発者に寄り添った次世代プラットフォーム
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-blue-500/30 group-hover:border-blue-400/50 transition-all duration-300">
                <svg className="w-12 h-12 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">実践的な内容</h3>
              <p className="text-slate-300 text-lg leading-relaxed">
                実際の開発で使える知識とTipsを提供
              </p>
            </div>
            
            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="relative w-24 h-24 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-green-500/30 group-hover:border-green-400/50 transition-all duration-300">
                <svg className="w-12 h-12 text-green-400 group-hover:text-green-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-300 transition-colors duration-300">最新技術</h3>
              <p className="text-slate-300 text-lg leading-relaxed">
                常に最新のWeb技術情報をキャッチアップ
              </p>
            </div>
            
            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-purple-500/30 group-hover:border-purple-400/50 transition-all duration-300">
                <svg className="w-12 h-12 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">コミュニティ</h3>
              <p className="text-slate-300 text-lg leading-relaxed">
                開発者同士の知識共有と交流
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-slate-900 via-blue-900/20 to-slate-900">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            今すぐ
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              始めよう
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            無料でアカウントを作成して、Web開発の知識を深めましょう
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/signup"
              className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 overflow-hidden"
            >
              <span className="relative z-10">無料で始める</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link
              href="/articles"
              className="group relative px-12 py-6 bg-transparent text-white text-xl font-bold rounded-2xl border-2 border-white/30 hover:border-white/60 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              <span className="relative z-10">記事を読む</span>
              <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
