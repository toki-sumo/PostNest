'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import ArticleForm from '@/components/article/ArticleForm';
import BackgroundDecoration from '@/components/common/BackgroundDecoration';

export default function EditBlogPage(){
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [article, setArticle] = useState<{
    title: string;
    content: string;
    tags: string[];
    imageUrl: string;
    isPremium: boolean;
    price: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${id}`);
        if (res.status === 404) {
          router.replace(`/articles/${id}`);
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await res.json();
        if (!data?.id) {
          router.replace(`/articles/${id}`);
          return;
        }
        setArticle({
          title: data.title,
          content: data.content,
          tags: data.tags || [],
          imageUrl: data.imageUrl || '',
          isPremium: data.isPremium || false,
          price: data.price || 0,
        });
      } catch (e) {
        router.replace(`/articles/${id}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArticle();
  }, [id]);

  const handleUpdate = async ({ title, content, tags, imageUrl, isPremium, price }: { title: string; content: string; tags: string[]; imageUrl: string; isPremium: boolean; price: number }) => {
    await fetch(`/api/articles/edit/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, tags, imageUrl, isPremium, price }),
    });

    router.push('/articles');
    router.refresh();
  };

  if (loading || !article) {
    return (
      <div className="min-h-screen pt-20">
        <BackgroundDecoration />
        <div className="max-w-4xl mx-auto p-6 relative z-10">
          <div className="backdrop-blur-sm rounded-2xl shadow-2xl border p-12 bg-[var(--card)] border-[var(--border)]">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
                <p className="text-[var(--text)]/85 text-lg">記事を読み込み中...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <BackgroundDecoration />
      <div className="relative z-10">
        <ArticleForm
          initialTitle={article.title}
          initialContent={article.content}
          initialTags={article.tags}
          initialImageUrl={article.imageUrl}
          initialIsPremium={article.isPremium}
          initialPrice={article.price}
          onSubmit={async (data) => {
            await handleUpdate({
              title: data.title,
              content: data.content,
              tags: data.tags,
              imageUrl: data.imageUrl,
              isPremium: data.isPremium,
              price: data.price ?? 0,
            })
          }}
          isEdit={true}
        />
      </div>
    </div>
  );
};

