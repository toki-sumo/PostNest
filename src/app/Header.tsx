// src/app/Header.tsx
import Link from 'next/link'
import React from 'react'

const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full bg-slate-800 text-white z-50 shadow py-5 px-10 flex border-b justify-between items-center">
            <h1 className='text-4xl font-extrabold text-gray-100 text-shadow-lg'>
                <Link href="/">Next.js15 Blog</Link>
            </h1>
            <nav className='text-sm font-medium flex'>
                <Link
                    href="/articles/new"
                    className="bg-gray-100 hover:bg-gray-500 hover:text-gray-100 text-gray-600 font-medium py-2 px-4 rounded-md cursor-pointer transition duration-200 shadow-md"
                >
                    記事を書く
                </Link>
            </nav>
        </header>
    );
}

export default Header;