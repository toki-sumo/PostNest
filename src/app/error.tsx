"use client"

import React from 'react'

const Error = ({reset}: {reset:() => void})  => {
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

            <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">エラーが発生しました</h3>
                    <p className="mb-8 text-center text-slate-300 leading-relaxed">
                        通信中に問題が発生しました。<br />
                        しばらくしてからもう一度お試しください。
                    </p>
                    <div className="space-y-4">
                        <button
                            onClick={() => reset()}
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105"
                        >
                            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            もう一度試す
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-slate-500/25 transform hover:scale-105"
                        >
                            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            ホームに戻る
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Error