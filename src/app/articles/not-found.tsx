import React from 'react'
import Link from 'next/link'

const NotFound = () => {
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

      <div className="flex flex-col items-center justify-center min-h-screen relative z-10 text-center px-4">
        <div className="max-w-md mx-auto">
          <div className="w-32 h-32 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <h1 className="text-6xl font-bold text-red-400">404</h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">ページが見つかりませんでした</h2>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            お探しのページは存在しないか、移動または削除された可能性があります。
          </p>
          <Link href="/">
            <span className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105">
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              トップページに戻る
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound;
