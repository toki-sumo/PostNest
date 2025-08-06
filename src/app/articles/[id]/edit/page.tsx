'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import TagInput from '@/components/article/TagInput';
import { Article } from '@/types/model_type';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { id } = use(params);

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/api/auth/signin');
      return;
    }

    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${id}`);
        const data = await res.json();
        setArticle(data);
        setTitle(data.title);
        setContent(data.content);
        setTags(data.tags);
      } catch (err) {
        console.error("記事取得エラー:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [status, session, id, router]);

  const handleUpdate = async () => {
    const res = await fetch(`/api/articles/edit/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, tags }),
    });

    if (res.ok) {
      router.push(`/articles/${id}`);
      router.refresh();
    } else {
      alert('Update failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Article</h1>

      <label className="block mb-2">タイトル</label>
      <input className="p-2 w-full mb-4 rounded bg-slate-100" value={title} onChange={e => setTitle(e.target.value)} />

      <label className="block mb-2">コンテンツ</label>
      <textarea className="p-2 w-full mb-4 rounded bg-slate-100 h-40" value={content} onChange={e => setContent(e.target.value)} />

      <label className="block mb-2">タグ</label>
      <TagInput initialTags={tags} onTagsChange={setTags} />

      <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4">
        Update
      </button>
    </div>
  );
}
