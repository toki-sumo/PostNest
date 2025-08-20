// src/app/articles/loading.tsx
export default function Loading() {
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
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl lg:max-w-none">
                最新のWeb開発情報と実践的なTipsをお届けします
              </p>
            </div>
            
            {/* ローディング状態の記事カード */}
            <div className="space-y-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm shadow-lg rounded-2xl border border-slate-600/30 p-6 animate-pulse"
                >
                  <div className="space-y-4">
                    {/* タイトルのスケルトン */}
                    <div className="h-8 bg-slate-700/50 rounded-lg w-3/4"></div>
                    
                    {/* 内容のスケルトン */}
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-700/50 rounded w-full"></div>
                      <div className="h-4 bg-slate-700/50 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-700/50 rounded w-4/6"></div>
                    </div>
                    
                    {/* メタ情報のスケルトン */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-600/30">
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-700/50 rounded w-32"></div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-slate-700/50 rounded-full w-16"></div>
                          <div className="h-6 bg-slate-700/50 rounded-full w-20"></div>
                        </div>
                      </div>
                      <div className="h-10 bg-slate-700/50 rounded-lg w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* サイドバー（デスクトップのみ表示） */}
        <aside className="hidden lg:block lg:w-1/4 p-4 lg:p-8 lg:pl-16">
          <div className="sticky top-24 max-w-md mx-auto lg:mx-0 space-y-6">
            {/* プロフィールカードのスケルトン */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm shadow-lg rounded-2xl p-6 text-center border border-slate-600/30">
              <div className="w-20 h-20 bg-slate-700/50 rounded-full mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-slate-700/50 rounded w-32 mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-slate-700/50 rounded w-40 mx-auto mb-3 animate-pulse"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-slate-700/50 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-slate-700/50 rounded w-5/6 animate-pulse"></div>
              </div>
              <div className="flex justify-center gap-4">
                <div className="h-4 bg-slate-700/50 rounded w-8 animate-pulse"></div>
                <div className="h-4 bg-slate-700/50 rounded w-8 animate-pulse"></div>
              </div>
            </div>

            {/* 人気記事のスケルトン */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-slate-600/30">
              <div className="h-6 bg-slate-700/50 rounded w-24 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-4 bg-slate-700/50 rounded w-full animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* タグのスケルトン */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-slate-600/30">
              <div className="h-6 bg-slate-700/50 rounded w-16 mb-4 animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-6 bg-slate-700/50 rounded-full w-16 animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* 統計情報のスケルトン */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-slate-600/30">
              <div className="h-6 bg-slate-700/50 rounded w-20 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="h-4 bg-slate-700/50 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-slate-700/50 rounded w-12 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
