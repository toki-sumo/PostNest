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

    router.push('/articles');
    router.refresh();
  };

  if (loading || !article) {
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

        <div className="max-w-4xl mx-auto p-6 relative z-10">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600/30 p-12">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-slate-300 text-lg">記事を読み込み中...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <ArticleForm
          initialTitle={article.title}
          initialContent={article.content}
          initialTags={article.tags}
          initialImageURL={article.imageURL}
          onSubmit={handleUpdate}
          isEdit={true}
        />
      </div>
    </div>
  );
};

