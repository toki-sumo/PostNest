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
    return <p className="p-4">読み込み中...</p>;
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

