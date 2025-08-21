// src/app/articles/page.tsx
import ArticleList from "@/components/article/ArticleList";

export default async function ArticlesPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
    cache: "no-store",
  });
  const articles = await res.json();

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 背景の装飾要素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* 浮遊する幾何学的図形 */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* グリッドパターン */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="flex flex-col lg:flex-row max-w-8xl mx-auto relative z-10">
        {/* 記事一覧（メインコンテンツ） */}
        <main className="w-full lg:w-3/4 p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* ヘッダーセクション */}
            <div className="text-center lg:text-left mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                記事
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  一覧
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl lg:max-w-none mb-4">
                最新のWeb開発情報と実践的なTipsをお届けします
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-slate-400">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>星マークの記事は有料記事です</span>
              </div>
            </div>
            
            <ArticleList articles={articles} />
          </div>
        </main>

        {/* サイドバー（デスクトップのみ表示） */}
        <aside className="hidden lg:block lg:w-1/4 p-4 lg:p-8 lg:pl-16">
          <div className="sticky top-24 max-w-md mx-auto lg:mx-0 space-y-6">
            {/* プロフィールカード */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm shadow-lg rounded-2xl p-6 text-center border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300">
              <img
                src="/flower.jpeg"
                alt="Profile"
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover shadow-lg ring-4 ring-slate-600/30"
              />
              <h3 className="font-bold text-white text-lg mb-2">管理者：toki</h3>
              <p className="text-blue-300 text-sm mb-3 font-medium">Web開発エンジニア / ブロガー</p>
              <p className="text-slate-300 text-sm text-left leading-relaxed mb-4">
                普段は会社員をしており、休日にWeb開発の勉強をしています。趣味はボルダリング、散歩、読書です。
              </p>
              <div className="flex justify-center gap-4">
                <a 
                  href="#" 
                  aria-label="Twitter" 
                  className="text-slate-400 hover:text-blue-400 transition-colors duration-200 text-sm font-medium hover:scale-110 transform"
                >
                  X
                </a>
                <a 
                  href="#" 
                  aria-label="GitHub" 
                  className="text-slate-400 hover:text-purple-400 transition-colors duration-200 text-sm font-medium hover:scale-110 transform"
                >
                  GH
                </a>
              </div>
            </div>

            {/* 人気記事 */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300">
              <h3 className="font-bold text-white mb-4 text-lg flex items-center">
                <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                人気記事
              </h3>
              <ul className="text-sm text-slate-300 space-y-3">
                <li>
                  <a 
                    href="/articles/1" 
                    className="hover:text-blue-300 hover:underline transition-all duration-200 block py-2 px-3 rounded-lg hover:bg-slate-700/30"
                  >
                    Reactのパフォーマンス最適化
                  </a>
                </li>
                <li>
                  <a 
                    href="/articles/2" 
                    className="hover:text-blue-300 hover:underline transition-all duration-200 block py-2 px-3 rounded-lg hover:bg-slate-700/30"
                  >
                    Next.jsの新機能まとめ
                  </a>
                </li>
              </ul>
            </div>

            {/* タグ */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300">
              <h3 className="font-bold text-white mb-4 text-lg flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                タグ
              </h3>
              <div className="flex flex-wrap gap-2">
                <a 
                  href="/tags/react" 
                  className="text-sm text-slate-300 hover:text-blue-300 transition-all duration-200 px-3 py-2 hover:bg-slate-700/50 rounded-lg border border-slate-600/30 hover:border-blue-500/50"
                >
                  #React
                </a>
                <a 
                  href="/tags/nextjs" 
                  className="text-sm text-slate-300 hover:text-purple-300 transition-all duration-200 px-3 py-2 hover:bg-slate-700/50 rounded-lg border border-slate-600/30 hover:border-purple-500/50"
                >
                  #Next.js
                </a>
                <a 
                  href="/tags/css" 
                  className="text-sm text-slate-300 hover:text-green-300 transition-all duration-200 px-3 py-2 hover:bg-slate-700/50 rounded-lg border border-slate-600/30 hover:border-green-500/50"
                >
                  #CSS
                </a>
                <a 
                  href="/tags/javascript" 
                  className="text-sm text-slate-300 hover:text-yellow-300 transition-all duration-200 px-3 py-2 hover:bg-slate-700/50 rounded-lg border border-slate-600/30 hover:border-yellow-500/50"
                >
                  #JavaScript
                </a>
                <a 
                  href="/tags/typescript" 
                  className="text-sm text-slate-300 hover:text-blue-400 transition-all duration-200 px-3 py-2 hover:bg-slate-700/50 rounded-lg border border-slate-600/30 hover:border-blue-400/50"
                >
                  #TypeScript
                </a>
                <a 
                  href="/tags/tailwind" 
                  className="text-sm text-slate-300 hover:text-cyan-300 transition-all duration-200 px-3 py-2 hover:bg-slate-700/50 rounded-lg border border-slate-600/30 hover:border-cyan-300/50"
                >
                  #Tailwind
                </a>
              </div>
            </div>

            {/* 統計情報 */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300">
              <h3 className="font-bold text-white mb-4 text-lg flex items-center">
                <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                統計
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">総記事数</span>
                  <span className="text-blue-400 font-semibold">{articles.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">カテゴリ</span>
                  <span className="text-purple-400 font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">月間PV</span>
                  <span className="text-green-400 font-semibold">2.5K</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
