'use client';

import { useRouter } from 'next/navigation';
import ArticleForm from '@/components/article/ArticleForm';

export default function CreateBlogPage() {
    const router = useRouter();

    const handleCreate = async ({ title, content, tags, imageURL, isPremium, price }: any) => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, tags, imageURL, isPremium, price }),
        });

        router.push('/articles');
        // router.refresh();
    };

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

            <div className="relative z-10">
                <ArticleForm onSubmit={handleCreate} isEdit={false} />
            </div>
        </div>
    );
}
