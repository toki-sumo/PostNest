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
  initialIsPremium?: boolean;
  initialPrice?: number;
  onSubmit: (data: {
    title: string;
    content: string;
    tags: string[];
    imageURL: string;
    isPremium: boolean;
    price: number | null;
  }) => Promise<void>;
  isEdit?: boolean;
};

export default function ArticleForm({
  initialTitle = '',
  initialContent = '',
  initialTags = [],
  initialImageURL = '',
  initialIsPremium = false,
  initialPrice = 0,
  onSubmit,
  isEdit = false,
}: ArticleFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [imageURL, setImageURL] = useState(initialImageURL);
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
      imageURL, 
      isPremium, 
      price: isPremium ? price : null 
    });
    setIsSubmitting(false);
  };

  const handlePremiumToggle = (checked: boolean) => {
    setIsPremium(checked);
    if (!checked) {
      setPrice(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600/30 p-8">
        {/* ヘッダーセクション */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            {isEdit ? '記事を編集' : '記事を新規作成'}
          </h1>
          <p className="text-lg text-slate-300">
            {isEdit ? '既存の記事を編集しましょう' : '新しい記事を作成しましょう'}
          </p>
        </div>

        <div className="space-y-6">
          {/* タイトル入力 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center">
              <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              タイトル
            </label>
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="記事のタイトルを入力してください"
              className="w-full px-4 py-3 border border-slate-600/30 rounded-xl shadow-sm bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            />
          </div>

          {/* 有料記事設定 */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPremium"
                  checked={isPremium}
                  onChange={(e) => handlePremiumToggle(e.target.checked)}
                  className="w-5 h-5 text-yellow-500 bg-slate-700/50 border-slate-600/30 rounded focus:ring-yellow-500 focus:ring-2"
                />
                <label htmlFor="isPremium" className="text-lg font-semibold text-yellow-400 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  有料記事にする
                </label>
              </div>
              
              {isPremium && (
                <div className="space-y-3 pl-8">
                  <p className="text-slate-300 text-sm">
                    有料記事に設定すると、読者は記事の内容を読むために購読が必要になります。
                  </p>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
                      <svg className="w-4 h-4 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      価格（円）
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">¥</span>
                      <input
                        type="number"
                        min="0"
                        max="99999"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-3 border border-slate-600/30 rounded-xl shadow-sm bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                        placeholder="100"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      0円以上、99,999円以下で設定してください
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* コンテンツ入力 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              コンテンツ
            </label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="記事の内容を入力してください"
            />
          </div>

          {/* タグ入力 */}
          <div>
            <div className="flex items-center mb-3">
              <label className="text-sm font-medium text-slate-300 mr-4 flex items-center">
                <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                タグ
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateTags}
                  disabled={isGenerating}
                  className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105"
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

            <TagInput
              value={tags}
              onChange={setTags}
              disabled={isGenerating}
            />
          </div>

          {/* 画像URL入力 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center">
              <svg className="w-5 h-5 text-pink-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              画像URL（オプション）
            </label>
            <TextInput
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              placeholder="画像のURLを入力してください"
              className="w-full px-4 py-3 border border-slate-600/30 rounded-xl shadow-sm bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            />
          </div>

          {/* 送信ボタン */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting || !title || !content || (isPremium && price <= 0)}
              className="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105"
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
