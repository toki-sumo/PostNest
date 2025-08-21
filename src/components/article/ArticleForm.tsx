'use client';

import { useState } from 'react';
import { Input } from '../ui/Input';
import TitleField from './form/TitleField';
import PriceField from './form/PriceField';
import TagField from './form/TagField';
import ContentField from './form/ContentField';
import SubmitBar from './form/SubmitBar';

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
          <TitleField value={title} onChange={setTitle} />

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
                  <PriceField value={price} onChange={setPrice} />
                </div>
              )}
            </div>
          </div>

          <ContentField value={content} onChange={setContent} />

          <TagField value={tags} onChange={setTags} isGenerating={isGenerating} onGenerate={handleGenerateTags} />

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

          <SubmitBar isSubmitting={isSubmitting} disabled={!title || !content || (isPremium && price < 50)} isEdit={isEdit} />
        </div>
      </form>
    </div>
  );
}
