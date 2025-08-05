// src/app/articles/[id]/edit/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Article } from '@/types/article_type';
import TagInput from '@/components/article/TagInput';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };
  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/api/auth/signin');
      return;
    }

    const fetchArticle = async () => {
      const res = await fetch(`/api/articles/${(await params).id}`);
      const data = await res.json();
      setArticle(data);
      setTitle(data.title);
      setContent(data.content);
      setTags(data.tags);
      setLoading(false);
    };

    fetchArticle();
  }, [session, status, router]);

  const handleUpdate = async () => {
    const res = await fetch(`/api/articles/edit/${(await params).id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, tags }),
    });

    if (res.ok) {
      router.push(`/articles/${(await params).id}`);
      router.refresh();
    } else {
      alert('Update failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Article</h1>
      タイトル
      <input
        className="p-2 mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-slate-100"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      コンテンツ
      <textarea
        className="p-2 mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-slate-100 h-40 mb-2"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      タグ
      {/* <TagInput tags={tags} setTags={setTags} /> */}
      <TagInput initialTags={tags} onTagsChange={handleTagsChange} />

      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Update
      </button>
    </div>
  );
}
