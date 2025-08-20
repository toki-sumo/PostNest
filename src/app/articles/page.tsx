// src/app/articles/page.tsx
import ArticleList from "@/components/article/ArticleList";

export default async function ArticlesPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
    cache: "no-store",
  });
  const articles = await res.json();

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* 記事一覧（メインコンテンツ） */}
      <main className="w-full lg:w-3/4 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center lg:text-left">
            記事一覧
          </h1>
          <ArticleList articles={articles} />
        </div>
      </main>

      {/* サイドバー（デスクトップのみ表示） */}
      <aside className="hidden lg:block lg:w-1/4 p-4 lg:p-6">
        <div className="max-w-sm mx-auto lg:mx-0 space-y-6">
          {/* プロフィールカード */}
          <div className="bg-white shadow-md rounded-lg p-4 lg:p-6 text-center border border-gray-200">
            <img
              src="/flower.jpeg"
              alt="Profile"
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-full mx-auto mb-3 lg:mb-4 object-cover shadow-sm"
            />
            <h3 className="font-bold text-gray-700 text-sm lg:text-base">管理者：toki</h3>
            <p className="text-gray-600 text-xs lg:text-sm mb-2">Web開発エンジニア / ブロガー</p>
            <p className="text-gray-600 text-xs lg:text-sm text-left leading-relaxed">
              普段は会社員をしており、休日にWeb開発の勉強をしています。趣味はボルダリング、散歩、読書です。
            </p>
            <div className="flex justify-center mt-3 gap-4">
              <a 
                href="#" 
                aria-label="Twitter" 
                className="text-blue-500 hover:text-blue-700 transition-colors duration-200 text-sm lg:text-base"
              >
                X
              </a>
              <a 
                href="#" 
                aria-label="GitHub" 
                className="text-gray-800 hover:text-gray-600 transition-colors duration-200 text-sm lg:text-base"
              >
                GH
              </a>
            </div>
          </div>

          {/* 人気記事 */}
          <div className="bg-white shadow-md rounded-lg p-4 lg:p-6 border border-gray-200">
            <h3 className="font-bold text-gray-700 mb-3 lg:mb-4 text-sm lg:text-base">人気記事</h3>
            <ul className="text-xs lg:text-sm text-gray-700 space-y-2">
              <li>
                <a 
                  href="/articles/1" 
                  className="hover:text-blue-600 hover:underline transition-colors duration-200 block py-1"
                >
                  Reactのパフォーマンス最適化
                </a>
              </li>
              <li>
                <a 
                  href="/articles/2" 
                  className="hover:text-blue-600 hover:underline transition-colors duration-200 block py-1"
                >
                  Next.jsの新機能まとめ
                </a>
              </li>
            </ul>
          </div>

          {/* タグ */}
          <div className="bg-white shadow-md rounded-lg p-4 lg:p-6 border border-gray-200">
            <h3 className="font-bold text-gray-700 mb-3 lg:mb-4 text-sm lg:text-base">タグ</h3>
            <div className="flex flex-wrap gap-2">
              <a 
                href="/tags/react" 
                className="text-xs lg:text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 px-2 lg:px-3 py-1 lg:py-2 hover:bg-blue-50 rounded-md"
              >
                #React
              </a>
              <a 
                href="/tags/nextjs" 
                className="text-xs lg:text-sm text-gray-600 hover:text-green-600 transition-colors duration-200 px-2 lg:px-3 py-1 lg:py-2 hover:bg-green-50 rounded-md"
              >
                #Next.js
              </a>
              <a 
                href="/tags/css" 
                className="text-xs lg:text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200 px-2 lg:px-3 py-1 lg:py-2 hover:bg-purple-50 rounded-md"
              >
                #CSS
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* スマホ用のプロフィールとタグセクション（ページの一番下に表示） */}
      <div className="lg:hidden w-full p-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* プロフィールカード */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center border border-gray-200">
            <img
              src="/flower.jpeg"
              alt="Profile"
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover shadow-sm"
            />
            <h3 className="font-bold text-gray-700 text-lg mb-2">管理者：toki</h3>
            <p className="text-gray-600 text-sm mb-3">Web開発エンジニア / ブロガー</p>
            <p className="text-gray-600 text-sm text-left leading-relaxed mb-4">
              普段は会社員をしており、休日にWeb開発の勉強をしています。趣味はボルダリング、散歩、読書です。
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="#" 
                aria-label="Twitter" 
                className="text-blue-500 hover:text-blue-700 transition-colors duration-200 text-base"
              >
                X
              </a>
              <a 
                href="#" 
                aria-label="GitHub" 
                className="text-gray-800 hover:text-gray-600 transition-colors duration-200 text-base"
              >
                GH
              </a>
            </div>
          </div>

          {/* タグセクション */}
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-gray-700 mb-4 text-center text-lg">タグ</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <a 
                href="/tags/react" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 px-3 py-2 hover:bg-blue-50 rounded-md"
              >
                #React
              </a>
              <a 
                href="/tags/nextjs" 
                className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200 px-3 py-2 hover:bg-green-50 rounded-md"
              >
                #Next.js
              </a>
              <a 
                href="/tags/css" 
                className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200 px-3 py-2 hover:bg-purple-50 rounded-md"
              >
                #CSS
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
