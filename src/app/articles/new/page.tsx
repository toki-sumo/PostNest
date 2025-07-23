"use client";
import { createArticle } from '@/app/blogAPI';
import { useRouter } from 'next/navigation';
import React from 'react'

const CreateBlogPage = () => {
    const router = useRouter();
    const [id, setId] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        // await createArticle(id, title, content);

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, title, content }),
        });

        setLoading(false);
        router.push("/"); // Redirect to the home page after submission
        router.refresh(); // Refresh the page to show the new article
    };

    return (
        <div className='min-h-screen py-8 px-4 md:px-12'>
            <h2 className='text-2xl font-bold mb-4'>ブログ新規作成</h2>
            <form className='bg-slate-200 p-6 rounded shadow-lg' onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label className='text-gray-700 text-sm font-bold mb-2'>URL
                        <input
                            type="text"
                            className='bg-white shadow border rounded w-full py-2 px-3 leading-tight text-gray-700 focus:outline-none'
                            onChange={(e) => setId(e.target.value)}
                        />
                    </label>
                </div>
                <div className='mb-4'>
                    <label className='text-gray-700 text-sm font-bold mb-2'>タイトル
                        <input type="text" className='bg-white shadow border rounded w-full py-2 px-3 leading-tight text-gray-700 focus:outline-none'
                            onChange={(e) => setTitle(e.target.value)}

                        />
                    </label>
                </div>
                <div className='mb-4'>
                    <label className='text-gray-700 text-sm font-bold mb-2'>本文
                        <textarea className='bg-white shadow border rounded w-full py-2 px-3 leading-tight text-gray-700 focus:outline-none'
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </label>
                </div>

                <button
                    type='submit'
                    className={`flex items-center justify-center gap-2 py-2 px-4 border rounded-md text-white transition
    ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gray-600 hover:bg-gray-800"}`}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>
                            投稿中...
                        </>
                    ) : (
                        "投稿"
                    )}
                </button>

            </form>

        </div>
    )
}

export default CreateBlogPage