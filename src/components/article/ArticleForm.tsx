'use client';

import { useState } from 'react';
import TagInput from './TagInput';
import Spinner from '../ui/Spinner';
import { Input } from '../ui/Input';
import RichTextEditor from './RichTextEditor';

type ArticleFormProps = {
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  initialImageUrl?: string;
  initialIsPremium?: boolean;
  initialPrice?: number;
  onSubmit: (data: {
    title: string;
    content: string;
    tags: string[];
    imageUrl: string;
    isPremium: boolean;
    price: number | null;
  }) => Promise<void>;
  isEdit?: boolean;
};

export default function ArticleForm({
  initialTitle = '',
  initialContent = '',
  initialTags = [],
  initialImageUrl = '',
  initialIsPremium = false,
  initialPrice = 0,
  onSubmit,
  isEdit = false,
}: ArticleFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [isPremium, setIsPremium] = useState(initialIsPremium);
  const [price, setPrice] = useState(initialPrice);
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
    await onSubmit({
      title,
      content,
      tags,
      imageUrl,
      isPremium,
      price: isPremium ? price : null,
    });
    setIsSubmitting(false);
  };

  const handlePremiumToggle = (checked: boolean) => {
    setIsPremium(checked);
    if (!checked) setPrice(0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="backdrop-blur-sm rounded-2xl shadow-2xl border p-8 bg-[var(--card)] border-[var(--border)]">
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-[var(--text)] mb-4">
            {isEdit ? '記事を編集' : '記事を新規作成'}
          </h1>
          <p className="text-lg text-[var(--text)]/85">
            {isEdit ? '既存の記事を編集しましょう' : '新しい記事を作成しましょう'}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-3 flex items-center">
              <svg className="w-5 h-5 text-[var(--primary)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              タイトル
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="記事のタイトルを入力してください"
              className="w-full px-4 py-3 rounded-xl shadow-sm transition-all duration-300"
            />
          </div>

          <div className="rounded-xl p-6 border border-[var(--border)] bg-[var(--card)]">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPremium"
                  checked={isPremium}
                  onChange={(e) => handlePremiumToggle(e.target.checked)}
                  className="w-5 h-5 text-[var(--primary)] bg-[var(--card)] border-[var(--border)] rounded focus:ring-[var(--primary)] focus:ring-2"
                />
                <label htmlFor="isPremium" className="text-lg font-semibold text-[var(--text)] flex items-center">
                  <svg className="w-6 h-6 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  有料記事にする
                </label>
              </div>
              {isPremium && (
                <div className="space-y-3 pl-8">
                  <p className="text-[var(--text)]/85 text-sm">
                    有料記事に設定すると、読者は記事の内容を読むために購読が必要になります。
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2 flex items-center">
                      <svg className="w-4 h-4 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      価格（円）
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]">¥</span>
                      <input
                        type="number"
                        min="50"
                        max="99999"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-3 border rounded-xl shadow-sm transition-all duration-300 bg-[var(--card)] text-[var(--text)] border-[var(--border)] placeholder-[color:var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                        placeholder="100"
                      />
                    </div>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      50円以上、99,999円以下で設定してください
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-3 flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              コンテンツ
            </label>
            <RichTextEditor content={content} onChange={setContent} placeholder="ここに記事の内容を入力してください。H1、H2、H3ボタンで見出しを設定できます。" />
          </div>

          <div>
            <div className="flex items-center mb-3">
              <label className="text-sm font-medium text-[var(--text)] mr-4 flex items-center">
                <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                タグ
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateTags}
                  disabled={isGenerating}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 bg-[var(--primary)] text-[var(--primary-contrast)]"
                >
                  {isGenerating ? (
                    <>
                      <Spinner size={3} />
                      <span className="ml-2">生成中...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AI生成
                    </>
                  )}
                </button>
              </div>
            </div>
            <TagInput value={tags} onChange={setTags} disabled={isGenerating} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-3 flex items-center">
              <svg className="w-5 h-5 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 2 0 002 2z" />
              </svg>
              画像URL（オプション）
            </label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="画像のURLを入力してください"
              className="w-full px-4 py-3 rounded-xl shadow-sm transition-all duration-300"
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting || !title || !content || (isPremium && price < 50)}
              className="w-full inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 bg-[var(--primary)] text-[var(--primary-contrast)]"
            >
              {isSubmitting ? (
                <>
                  <Spinner size={5} />
                  <span className="ml-3">送信中...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {isEdit ? '更新する' : '記事を投稿'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
