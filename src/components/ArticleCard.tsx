import { Article } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

type ArticleCardProps = {
    article: Article;
};

const ArticleCard = ({ article }: ArticleCardProps) => {
    return (
        <article className='shadow my-4 flex flex-col' key={article.id}>
            <Link href={`articles/${article.id}/`} className='hover:opacity-75'>
                <Image src="https://images.unsplash.com/photo-1544894079-e81a9eb1da8b" alt="" width={1280} height={300} className='h-[300px] object-cover' />
            </Link>
            <div className='bg-white flex flex-col justify-start p-6'>
                <Link href="#" className='text-blue-700 pb-4 font-bold'>
                    Technology
                </Link>
                <Link href={`articles/${article.id}`}
                    className='text-slate-900 text-3xl font-bold hover:text-gray-700'>
                    {article.title}
                </Link>
                <p className='text-sm pb-3 text-slate-900 mt-1 ml-3'>
                    Published on {new Date(article.createdAt).toLocaleString('ja-JP', {
                        weekday: 'short', // ← 火曜など
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
                <Link href={`articles/${article.id}`} className='text-slate-900 line-clamp-3'>
                    {article.content}
                </Link>
                <Link href={`articles/${article.id}`} className='text-pink-800 hover:text-black mt-3'>
                    続きを読む
                </Link>
            </div>
        </article>
    )
}

export default ArticleCard