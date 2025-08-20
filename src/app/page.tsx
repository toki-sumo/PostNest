// src/app/page.tsx
import Link from "next/link";
import ArticleList from "@/components/article/ArticleList";

export default async function HomePage() {
  // 最新記事を3件取得
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
    cache: "no-store",
  });
  const allArticles = await res.json();
  const latestArticles = allArticles.slice(0, 3); // 最新3件

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* ヒーローセクション */}
      <section className="text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
            Web開発の知識を
            <span className="text-slate-600 block">共有・発見</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
            最新のWeb技術から実践的なTipsまで、<br className="hidden md:block" />
            開発者のための記事を毎日更新
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/articles"
              className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              記事を探す
            </Link>
            <Link
              href="/signup"
              className="bg-white hover:bg-slate-50 text-slate-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl border-2 border-slate-600"
            >
              無料で始める
            </Link>
          </div>
        </div>
      </section>

      {/* 最新記事セクション */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              最新の記事
            </h2>
            <p className="text-lg text-slate-600">
              最新のWeb開発情報をお届けします
            </p>
          </div>
          
          {latestArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {latestArticles.map((article: any) => (
                <div key={article.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-slate-200 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-800 mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-slate-600 mb-4 line-clamp-3">
                      {article.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        {new Date(article.createdAt).toLocaleDateString('ja-JP')}
                      </span>
                      <Link
                        href={`/articles/${article.id}`}
                        className="text-slate-600 hover:text-slate-800 font-medium"
                      >
                        続きを読む →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">まだ記事がありません</p>
            </div>
          )}
          
          <div className="text-center">
            <Link
              href="/articles"
              className="inline-flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-colors duration-200"
            >
              すべての記事を見る
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              なぜPostNestなのか
            </h2>
            <p className="text-lg text-slate-600">
              開発者に寄り添ったプラットフォーム
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">実践的な内容</h3>
              <p className="text-slate-600">
                実際の開発で使える知識とTipsを提供
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">最新技術</h3>
              <p className="text-slate-600">
                常に最新のWeb技術情報をキャッチアップ
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">コミュニティ</h3>
              <p className="text-slate-600">
                開発者同士の知識共有と交流
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-16 px-4 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            今すぐ始めよう
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            無料でアカウントを作成して、Web開発の知識を深めましょう
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
            >
              無料で始める
            </Link>
            <Link
              href="/articles"
              className="bg-transparent hover:bg-slate-800 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 border-2 border-white"
            >
              記事を読む
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
