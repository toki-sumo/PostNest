import Link from 'next/link'
import React from 'react'

const Header = () => {
    return (
        <header className='py-5 px-10 flex border-b justify-between items-center'>
            <div>
                <h1 className='text-3xl font-xtrabold shadow-lg text-gray-100'>
                    <Link href="/">Next.js15 Blog</Link>
                </h1>
            </div>
            <nav className='text-sm font-medium flex'>
                <Link href="/articles/new" className='bg-gray-500 px-3 py-3 rounded-md'>記事を書く</Link>
            </nav>
        </header>
    );
}

export default Header