'use client';

import { useRouter } from 'next/navigation';
import ArticleForm from '@/components/article/ArticleForm';

export default function CreateBlogPage() {
    const router = useRouter();

    const handleCreate = async ({ title, content, tags, imageURL }: any) => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, tags, imageURL }),
        });

        router.push('/');
        // router.refresh();
    };

    return <ArticleForm onSubmit={handleCreate} isEdit={false} />;
}
