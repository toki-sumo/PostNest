import React from 'react'

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 背景の装飾要素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* 浮遊する幾何学的図形 */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* グリッドパターン */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">PostNest</h2>
          <p className="text-slate-300">読み込み中...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;