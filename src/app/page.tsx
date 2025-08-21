// src/app/page.tsx
import Link from "next/link";
// ArticleListは使用しない（最新3件カードはこのファイル内で描画）
// import BackgroundDecoration from "@/components/common/BackgroundDecoration";

export default async function Home() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const res = await fetch(`${baseUrl}/api/articles`, {
    cache: "no-store",
  });
  const allArticles: Array<{ id: string; title: string; content: string; createdAt: string }>
    = await res.json();
  const latestArticles = allArticles.slice(0, 3); // 最新3件

  return (
    <div className="min-h-screen overflow-hidden">
      {/* 背景の装飾要素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* 浮遊する幾何学的図形 */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[color:var(--muted)]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-[color:var(--muted)]/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-[color:var(--muted)]/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* グリッドパターン */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* ヒーローセクション */}
      <section className="relative pt-32 pb-20 px-4 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center relative z-10">
            {/* メインタイトル */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 text-[var(--text)]">
                資産形成の
                <span className="block text-[var(--primary)]">
                  未来
                </span>
                をデザイン
              </h1>
            </div>

            {/* サブタイトル */}
            <p className="text-xl md:text-2xl lg:text-3xl text-[var(--text)]/85 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
              投資戦略や家計最適化から税制活用まで、<br className="hidden lg:block" />
              <span className="text-[var(--primary)] font-medium">資産形成のための知識プラットフォーム</span>
            </p>

            {/* CTAボタン */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                href="/articles"
                className="group relative px-10 py-5 text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden bg-[var(--primary)] text-[var(--primary-contrast)]"
              >
                <span className="relative z-10">記事を探す</span>
              </Link>
              
              <Link
                href="/signup"
                className="group relative px-10 py-5 text-xl font-bold rounded-2xl border transition-all duration-300 transform hover:scale-105 backdrop-blur-sm bg-[var(--card)] text-[var(--text)] border-[var(--border)] hover:border-[var(--card-hover-border)]"
              >
                <span className="relative z-10">無料で始める</span>
              </Link>
            </div>

            {/* 統計情報 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-2 transition-colors duration-300">
                  100+
                </div>
                <div className="text-[var(--muted)] text-lg">資産形成記事</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2 transition-colors duration-300">
                  24/7
                </div>
                <div className="text-[var(--muted)] text-lg">市場ウォッチ</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2 transition-colors duration-300">
                  1000+
                </div>
                <div className="text-[var(--muted)] text-lg">読者</div>
              </div>
            </div>
          </div>
        </div>

        {/* スクロールインジケーター */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[var(--border)] rounded-full flex justify-center">
            <div className="w-1 h-3 bg-[color:var(--muted)] rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* 最新記事セクション */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
              最新の
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                記事
              </span>
            </h2>
            <p className="text-xl text-[var(--text)]/85 max-w-2xl mx-auto">
              最新の投資トレンドや実践的な資産運用ノウハウをお届けします
            </p>
          </div>
          
          {latestArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {latestArticles.map((article: { id: string; title: string; content: string; createdAt: string }, index: number) => (
                <div 
                  key={article.id} 
                  className="group relative backdrop-blur-sm rounded-2xl border overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-2xl bg-[var(--card)] border-[var(--border)] hover:border-[var(--card-hover-border)]"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* カードの背景効果 */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative p-8">
                    <h3 className="text-2xl font-bold text-[var(--text)] mb-4 line-clamp-2 group-hover:text-[var(--primary)] transition-colors duration-300">
                      {article.title}
                    </h3>
                    <p className="text-[var(--text)]/85 mb-6 line-clamp-3 leading-relaxed">
                      {article.content.replace(/<[^>]*>/g, '')}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--muted)]">
                        {new Date(article.createdAt).toLocaleDateString('ja-JP')}
                      </span>
                      <Link
                        href={`/articles/${article.id}`}
                        className="text-[var(--primary)] hover:opacity-80 font-semibold group-hover:translate-x-1 transition-all duration-300"
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
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-[color:var(--muted)]/10">
                <svg className="w-12 h-12 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-[var(--muted)] text-xl">まだ記事がありません</p>
            </div>
          )}
          
          <div className="text-center">
            <Link
              href="/articles"
              className="group inline-flex items-center px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm bg-[var(--primary)] text-[var(--primary-contrast)] hover:opacity-90"
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
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
              なぜ
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                PostNest
              </span>
              で資産形成なのか
            </h2>
            <p className="text-xl text-[var(--text)]/85 max-w-3xl mx-auto">
              個人投資家に寄り添った次世代の学習・実践プラットフォーム
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="relative w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border transition-all duration-300 bg-[var(--card)] border-[var(--border)] group-hover:border-[var(--card-hover-border)]">
                <svg className="w-12 h-12 text-[var(--primary)] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text)] mb-4">実践的な運用戦略</h3>
              <p className="text-[var(--text)]/85 text-lg leading-relaxed">
                積立・分散・リバランスなど、結果に直結する手法を解説
              </p>
            </div>
            
            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="relative w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border transition-all duration-300 bg-[var(--card)] border-[var(--border)] group-hover:border-[var(--card-hover-border)]">
                <svg className="w-12 h-12 text-green-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text)] mb-4">マーケット分析</h3>
              <p className="text-[var(--text)]/85 text-lg leading-relaxed">
                株式・債券・コモディティの動向やリスク要因をわかりやすく
              </p>
            </div>
            
            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="relative w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border transition-all duration-300 bg-[var(--card)] border-[var(--border)] group-hover:border-[var(--card-hover-border)]">
                <svg className="w-12 h-12 text-purple-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text)] mb-4">税制・制度活用</h3>
              <p className="text-[var(--text)]/85 text-lg leading-relaxed">
                NISA・iDeCo・確定申告などの制度を賢く使うコツ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="relative py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
            今すぐ
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              始めよう
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-[var(--text)]/85 mb-12 max-w-3xl mx-auto leading-relaxed">
            無料でアカウントを作成して、資産形成の知識を深めましょう
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/signup"
              className="group relative px-12 py-6 text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden bg-[var(--primary)] text-[var(--primary-contrast)]"
            >
              <span className="relative z-10">無料で始める</span>
            </Link>
            
            <Link
              href="/articles"
              className="group relative px-12 py-6 text-xl font-bold rounded-2xl border transition-all duration-300 transform hover:scale-105 backdrop-blur-sm bg-[var(--card)] text-[var(--text)] border-[var(--border)] hover:border-[var(--card-hover-border)]"
            >
              <span className="relative z-10">記事を読む</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
