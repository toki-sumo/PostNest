import React from 'react'
import Link from 'next/link'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-gray-100 text-center px-4 m-8">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-6">ページが見つかりませんでした。</p>
      <Link href="/">
        <span className="inline-block px-6 py-3 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition">
          トップページに戻る
        </span>
      </Link>
    </div>
  )
}

export default NotFound;
