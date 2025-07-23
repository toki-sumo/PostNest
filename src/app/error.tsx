"use client"

import React from 'react'

const Error = ({reset}: {reset:() => void})  => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
            <h3 className="text-2xl font-bold mb-4">エラーが発生しました</h3>
            <p className="mb-6 text-center text-sm text-gray-600">
                通信中に問題が発生しました。<br />しばらくしてからもう一度お試しください。
            </p>
            <button
                onClick={() => reset()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow transition"
            >
                もう一度試す
            </button>
        </div>
    )
}

export default Error