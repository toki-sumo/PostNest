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
  const [isGenerating, setIsGenerating] = useState(false);


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

  const handleGenerateTags = async () => {
    if (!title) return;

    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();

      const mergedTags = Array.from(new Set([...tags, ...data.tags]));
      setTags(mergedTags);
    } catch (error) {
      console.error("タグ生成エラー:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  

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

      <div className="flex items-center mb-2">
        <label className="text-sm font-medium mr-4">タグ</label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerateTags}
            disabled={isGenerating}
            className={`px-3 py-1 rounded text-sm text-white flex items-center gap-2 ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-800'
              }`}
          >
            {isGenerating ? 'タグを生成中...' : 'タグを自動生成'}

            {/* スピナー表示 */}
            {isGenerating && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>


      <TagInput value={tags} onChange={setTags} disabled={isGenerating} />

      <button onClick={handleUpdate} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 mt-4">
        Update
      </button>
    </div>
  );
}
