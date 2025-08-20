'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ArticleForm from '@/components/article/ArticleForm';

export default function EditBlogPage(){
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [article, setArticle] = useState<{
    title: string;
    content: string;
    tags: string[];
    imageURL: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`);
      const data = await res.json();
      setArticle({
        title: data.title,
        content: data.content,
        tags: data.tags || [],
        imageURL: data.imageURL || '',
      });
      setLoading(false);
    };

    if (id) fetchArticle();
  }, [id]);

  const handleUpdate = async ({ title, content, tags, imageURL }: any) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/edit/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, tags, imageURL }),
    });
    console.log("update!!!!!!!!!!!!");

    router.push('/');
    router.refresh();
  };

  if (loading || !article) {
    return (
      <div className="min-h-screen pt-24 bg-slate-50">
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-12">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
                <p className="text-slate-600 text-lg">記事を読み込み中...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ArticleForm
      initialTitle={article.title}
      initialContent={article.content}
      initialTags={article.tags}
      initialImageURL={article.imageURL}
      onSubmit={handleUpdate}
      isEdit={true}
    />
  );
};

