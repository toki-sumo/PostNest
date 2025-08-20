'use client';

import { useState } from 'react';
import TagInput from './TagInput';
import Spinner from '../ui/Spinner';
import { TextInput } from '../ui/TextInput';
import RichTextEditor from './RichTextEditor';

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
    <div className="min-h-screen pt-24 bg-slate-50">
      <div className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-6 text-slate-800">
            {isEdit ? '記事を編集' : '記事を新規作成'}
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">タイトル</label>
              <TextInput
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="記事のタイトルを入力してください"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">コンテンツ</label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="記事の内容を入力してください"
              />
            </div>

            <div>
              <div className="flex items-center mb-2">
                <label className="text-sm font-medium text-slate-700 mr-4">タグ</label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateTags}
                    disabled={isGenerating}
                    className={`px-3 py-1 rounded-lg text-sm text-white flex items-center gap-2 transition-colors duration-200 ${
                      isGenerating 
                        ? 'bg-slate-400 cursor-not-allowed' 
                        : 'bg-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    {isGenerating ? 'タグを生成中...' : 'タグを自動生成'}

                    {isGenerating && (<Spinner size={4} />)}
                  </button>
                </div>
              </div>
              <TagInput value={tags} onChange={setTags} disabled={isGenerating} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">画像URL</label>
              <TextInput
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
                placeholder="画像のURLを入力してください"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 ${
                  isSubmitting
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-slate-600 hover:bg-slate-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    {isEdit ? '更新中...' : '投稿中...'}
                  </>
                ) : isEdit ? '更新する' : '投稿する'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
