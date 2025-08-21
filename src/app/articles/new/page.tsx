'use client';

import { useRouter } from 'next/navigation';
import ArticleForm from '@/components/article/ArticleForm';
import BackgroundDecoration from '@/components/common/BackgroundDecoration';

export default function CreateBlogPage() {
    const router = useRouter();

    const handleCreate = async ({ title, content, tags, imageUrl, isPremium, price }: any) => {
        await fetch('/api/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, tags, imageUrl, isPremium, price }),
        });

        router.push('/articles');
    };

    return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <BackgroundDecoration />
            <div className="relative z-10">
                <ArticleForm onSubmit={handleCreate} isEdit={false} />
            </div>
        </div>
    );
}
