'use client';

import { useState } from 'react';
import TagInput from './TagInput';

type ArticleFormProps = {
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  initialImageURL?: string;
  onSubmit: (data: {
    title: string;
    content: string;
    tags: string[];
    imageURL: string;
  }) => Promise<void>;
  isEdit?: boolean;
};

export default function ArticleForm({
  initialTitle = '',
  initialContent = '',
  initialTags = [],
  initialImageURL = '',
  onSubmit,
  isEdit = false,
}: ArticleFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [imageURL, setImageURL] = useState(initialImageURL);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    } catch (err) {
      console.error('タグ生成エラー:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({ title, content, tags, imageURL });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? '記事を編集' : 'ブログ新規作成'}
      </h1>

      <label className="block mb-2">タイトル</label>
      <input
        className="p-2 w-full mb-4 rounded bg-slate-100"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className="block mb-2">コンテンツ</label>
      <textarea
        className="p-2 w-full mb-4 rounded bg-slate-100 h-40"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

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

      <label className="block mt-4 mb-2">Image URL</label>
      <input
        className="p-2 w-full mb-4 rounded bg-slate-100"
        value={imageURL}
        onChange={(e) => setImageURL(e.target.value)}
        placeholder="画像URLを入力"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded text-white ${isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gray-600 hover:bg-gray-800'
          }`}
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
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
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            {isEdit ? '更新中...' : '投稿中...'}
          </>
        ) : isEdit ? '更新' : '投稿'}
      </button>
    </form>
  );
}
