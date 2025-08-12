// src/app/page.tsx
import ArticleList from "@/components/article/ArticleList";

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
    cache: "no-store",
  });
  const articles = await res.json();

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* 記事一覧（左側） */}
      <section className="w-full md:w-3/4 p-4">
        <ArticleList articles={articles} />
      </section>

      {/* サイドバー（右側） */}
      <aside className="w-full md:w-1/4 p-4 space-y-6">
        <div className="bg-slate-100 shadow-md rounded p-4 text-center">
          <img
            src="/flower.jpeg"
            alt="Profile"
            className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
          />
          <h3 className="font-bold text-gray-700">管理者：toki</h3>
          <p className="text-gray-600 text-sm">Web開発エンジニア / ブロガー</p>
          <p className="text-gray-600 text-sm text-left">普段は会社員をしており、休日にWeb開発の勉強をしています。趣味はボルダリング、散歩、読書です。</p>
          <div className="flex justify-center mt-2 gap-3">
            <a href="#" aria-label="Twitter" className="text-blue-500">X</a>
            <a href="#" aria-label="GitHub" className="text-gray-800">GH</a>
          </div>
        </div>

        <div className="bg-slate-100 shadow-md rounded p-4">
          <h3 className="font-bold text-gray-700 mb-2">人気記事</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li><a href="/articles/1" className="hover:underline">Reactのパフォーマンス最適化</a></li>
            <li><a href="/articles/2" className="hover:underline">Next.jsの新機能まとめ</a></li>
          </ul>
        </div>

        <div className="bg-slate-100 shadow-md rounded p-4">
          <h3 className="font-bold text-gray-700 mb-2">タグ</h3>
          <div className="flex flex-wrap gap-2">
            <a href="/tags/react" className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">#React</a>
            <a href="/tags/nextjs" className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">#Next.js</a>
            <a href="/tags/css" className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">#CSS</a>
          </div>
        </div>
      </aside>

    </div>
  );
}
