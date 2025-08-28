// src/app/articles/page.tsx
import ArticleList from "@/components/article/ArticleList";
export const revalidate = 120;
import { db } from "@/lib/db";
import BackgroundDecoration from "@/components/common/BackgroundDecoration";
import Link from "next/link";

export default async function ArticlesPage() {
  let rows: Array<{
    id: string;
    title: string;
    content: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    tags: string[] | null;
    imageUrl: string | null;
    isPremium: boolean;
    price: number | null;
    author: { id: string; name: string | null } | null;
  }> = [];
  try {
    rows = await db.article.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        tags: true,
        imageUrl: true,
        isPremium: true,
        price: true,
        author: { select: { id: true, name: true } },
      },
    });
  } catch (error) {
    console.warn("DB 接続に失敗したため、記事一覧を空でビルドします:", error);
    rows = [];
  }

  const articles = rows.map((r) => ({
    id: r.id,
    title: r.title,
    content: r.content,
    createdAt: (r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt)),
    updatedAt: (r.updatedAt instanceof Date ? r.updatedAt.toISOString() : String(r.updatedAt)),
    tags: r.tags ?? [],
    imageUrl: r.imageUrl ?? "",
    isPremium: r.isPremium,
    price: r.price ?? null,
    author: { id: r.author?.id ?? "", name: r.author?.name ?? "", Article: [] },
  }));

  return (
    <div className="min-h-screen pt-10">
      <BackgroundDecoration />

      <div className="flex flex-col lg:flex-row max-w-8xl mx-auto relative z-10">
        {/* 記事一覧（メインコンテンツ） */}
        <main className="w-full lg:w-3/4 p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* ヘッダーセクション */}
            <div className="text-center lg:text-left mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
                記事
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  一覧
                </span>
              </h1>
              <p className="text-lg md:text-xl text-[var(--text)]/85 max-w-2xl lg:max-w-none mb-4">
                最新の投資トレンドや資産運用ノウハウをお届けします
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-[var(--muted)]">
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
            <div className="backdrop-blur-sm shadow-lg rounded-2xl p-6 text-center border transition-all duration-300 bg-[var(--card)] border-[var(--border)] hover:border-[var(--card-hover-border)]">
              <img
                src="/flower.jpeg"
                alt="Profile"
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover shadow-lg ring-4 ring-slate-600/30"
              />
              <h3 className="font-bold text-[var(--text)] text-lg mb-2">管理者：toki</h3>
              <p className="text-[var(--primary)] text-sm mb-3 font-medium">資産形成ブロガー</p>
              <p className="text-[var(--text)]/85 text-sm text-left leading-relaxed mb-4">
                長期・分散・積立を軸に、NISAやiDeCoの活用法、家計最適化の実例を発信しています。
              </p>
              <div className="flex justify-center gap-4">
                <a 
                  href="#" 
                  aria-label="Twitter" 
                  className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors duration-200 text-sm font-medium hover:scale-110 transform"
                >
                  X
                </a>
                <a 
                  href="#" 
                  aria-label="GitHub" 
                  className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-200 text-sm font-medium hover:scale-110 transform"
                >
                  GH
                </a>
              </div>
            </div>

            {/* 人気記事 */}
            <div className="backdrop-blur-sm shadow-lg rounded-2xl p-6 border transition-all duration-300 bg-[var(--card)] border-[var(--border)] hover:border-[var(--card-hover-border)]">
              <h3 className="font-bold text-[var(--text)] mb-4 text-lg flex items-center">
                <svg className="w-5 h-5 text-[var(--primary)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                人気記事
              </h3>
              <ul className="text-sm text-[var(--text)]/85 space-y-3">
                <li>
                  <Link href="/articles/1" className="hover:text-[var(--primary)] hover:underline transition-all duration-200 block py-2 px-3 rounded-lg hover:bg-[var(--card)]">
                    NISAを最大限活用する5つのポイント
                  </Link>
                </li>
                <li>
                  <Link href="/articles/2" className="hover:text-[var(--primary)] hover:underline transition-all duration-200 block py-2 px-3 rounded-lg hover:bg-[var(--card)]">
                    インデックス投資のはじめ方と続け方
                  </Link>
                </li>
              </ul>
            </div>

            {/* タグ */}
            <div className="backdrop-blur-sm shadow-lg rounded-2xl p-6 border transition-all duration-300 bg-[var(--card)] border-[var(--border)] hover:border-[var(--card-hover-border)]">
              <h3 className="font-bold text-[var(--text)] mb-4 text-lg flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                タグ
              </h3>
              <div className="flex flex-wrap gap-2">
                <Link href="/tags/nisa" className="text-sm text-[var(--text)]/85 hover:text-[var(--primary)] transition-all duration-200 px-3 py-2 hover:bg-[var(--card)] rounded-lg border border-[var(--border)] hover:border-[var(--card-hover-border)]">#NISA</Link>
                <Link href="/tags/ideco" className="text-sm text-[var(--text)]/85 hover:text-[var(--accent)] transition-all duration-200 px-3 py-2 hover:bg-[var(--card)] rounded-lg border border-[var(--border)] hover:border-[var(--card-hover-border)]">#iDeCo</Link>
                <Link href="/tags/mutual-fund" className="text-sm text-[var(--text)]/85 hover:text-green-500 transition-all duration-200 px-3 py-2 hover:bg-[var(--card)] rounded-lg border border-[var(--border)] hover:border-[var(--card-hover-border)]">#投資信託</Link>
                <Link href="/tags/index" className="text-sm text-[var(--text)]/85 hover:text-yellow-500 transition-all duration-200 px-3 py-2 hover:bg-[var(--card)] rounded-lg border border-[var(--border)] hover:border-[var(--card-hover-border)]">#インデックス投資</Link>
                <Link href="/tags/tax" className="text-sm text-[var(--text)]/85 hover:text-[var(--primary)] transition-all duration-200 px-3 py-2 hover:bg-[var(--card)] rounded-lg border border-[var(--border)] hover:border-[var(--card-hover-border)]">#節税</Link>
                <Link href="/tags/budget" className="text-sm text-[var(--text)]/85 hover:text-cyan-500 transition-all duration-200 px-3 py-2 hover:bg-[var(--card)] rounded-lg border border-[var(--border)] hover:border-[var(--card-hover-border)]">#家計管理</Link>
              </div>
            </div>

            {/* 統計情報 */}
            <div className="backdrop-blur-sm shadow-lg rounded-2xl p-6 border transition-all duration-300 bg-[var(--card)] border-[var(--border)] hover:border-[var(--card-hover-border)]">
              <h3 className="font-bold text-[var(--text)] mb-4 text-lg flex items-center">
                <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                統計
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text)]/85">総記事数</span>
                  <span className="text-[var(--primary)] font-semibold">{articles.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text)]/85">カテゴリ</span>
                  <span className="text-[var(--accent)] font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text)]/85">月間PV</span>
                  <span className="text-green-500 font-semibold">2.5K</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
