'use client';

import { useRouter } from 'next/navigation';
import ArticleForm from '@/components/article/ArticleForm';
import BackgroundDecoration from '@/components/common/BackgroundDecoration';

export default function CreateBlogPage() {
    const router = useRouter();

    const handleCreate = async ({ title, content, tags, imageUrl, isPremium, price }: { title: string; content: string; tags: string[]; imageUrl: string; isPremium: boolean; price: number }) => {
        await fetch('/api/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, tags, imageUrl, isPremium, price }),
        });

        router.push('/articles');
    };

    return (
        <div className="min-h-screen pt-20">
            <BackgroundDecoration />
            <div className="relative z-10">
                <ArticleForm
                  onSubmit={async (data) => {
                    await handleCreate({
                      title: data.title,
                      content: data.content,
                      tags: data.tags,
                      imageUrl: data.imageUrl,
                      isPremium: data.isPremium,
                      price: data.price ?? 0,
                    })
                  }}
                  isEdit={false}
                />
            </div>
        </div>
    );
}
