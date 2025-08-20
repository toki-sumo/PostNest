'use client'

import { useState } from 'react';
import { Article } from '@/types/model_type';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/formatDate';
import Spinner from '../ui/Spinner';

type ArticleCardProps = {
  article: Article;
};

const fallbackImage = '/flower.jpeg'; 

const ArticleCard = ({ article }: ArticleCardProps) => {
  const defaultImage = article.imageURL || `https://picsum.photos/seed/${article.id}/600/400`;
  const [imageSrc, setImageSrc] = useState(defaultImage);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);

  // デバッグ用ログ
  console.log(`ArticleCard ${article.id}:`, {
    defaultImage,
    imageSrc,
    isImageLoading,
    hasImageError,
    articleImageURL: article.imageURL
  });

  const handleImageError = () => {
    console.log('Image failed to load, using fallback:', fallbackImage);
    setImageSrc(fallbackImage);
    setHasImageError(true);
    setIsImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', imageSrc);
    setIsImageLoading(false);
    setHasImageError(false);
  };

  return (
    <article className="group bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden border border-slate-600/30 hover:border-slate-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 transform hover:scale-[1.02] h-80">
      {/* モバイル: 縦並び、デスクトップ: 横並び */}
      <div className="flex flex-col lg:flex-row h-full">
        {/* 画像セクション */}
        <div className="lg:w-2/5 w-full relative group h-full">
          <div className="w-full h-full lg:h-full relative overflow-hidden bg-slate-700 lg:rounded-l-2xl rounded-t-2xl lg:rounded-t-none">
            {/* ローディング状態 */}
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-700 z-20">
                <Spinner size={16} />
              </div>
            )}

            {/* メイン画像 */}
            <Image
              src={imageSrc}
              alt={article.title}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className={`object-cover transition-all duration-300 group-hover:scale-[1.05] z-0 ${
                isImageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              priority={false}
              unoptimized={hasImageError}
              quality={85}
            />
            
            {/* エラー時のフォールバック画像 */}
            {hasImageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-700 z-15">
                <img
                  src={fallbackImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* 画像をクリック可能にする透明なオーバーレイ（ホバー効果なし） */}
            <Link 
              href={`/articles/${article.id}`}
              className="absolute inset-0 z-1 block bg-transparent"
              aria-label={`${article.title}の詳細を見る`}
            />
          </div>
        </div>

        {/* コンテンツセクション */}
        <div className="flex flex-col justify-between p-4 lg:p-6 lg:w-3/5 w-full lg:rounded-r-2xl rounded-b-2xl lg:rounded-b-none h-full">
          <div className="space-y-1 lg:space-y-3">
            {/* タグ */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 lg:gap-2 overflow-hidden">
                {article.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 lg:px-3 lg:py-1.5 rounded-full font-medium border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200"
                  >
                    #{tag}
                  </span>
                ))}
                {article.tags.length > 3 && (
                  <span className="text-xs text-slate-400 px-2 py-1 lg:px-3 lg:py-1.5">
                    +{article.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* タイトル */}
            <Link href={`/articles/${article.id}`}>
              <h2 className="text-sm lg:text-xl xl:text-2xl font-bold text-white hover:text-blue-300 transition-colors duration-300 line-clamp-1 lg:line-clamp-2 group-hover:text-blue-200">
                {article.title}
              </h2>
            </Link>

            {/* 内容 */}
            <p className="text-slate-300 text-xs lg:text-base line-clamp-2 lg:line-clamp-3 leading-relaxed">
              {article.content.replace(/<[^>]*>/g, '')}
            </p>
          </div>

          {/* フッター情報 */}
          <div className="mt-2 lg:mt-4 pt-2 lg:pt-4 border-t border-slate-600/30 flex-shrink-0 min-h-[80px] lg:min-h-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 lg:gap-3">
              {/* 投稿者・投稿日情報 */}
              <div className="text-xs lg:text-sm text-slate-400 space-y-0.5 lg:space-y-1">
                <div className="flex items-center gap-1 lg:gap-2">
                  <span className="font-medium text-slate-300">投稿者:</span>
                  <span className="font-medium text-blue-300">{article.author.name}</span>
                </div>
                <div className="flex items-center gap-1 lg:gap-2">
                  <span className="font-medium text-slate-300">投稿日:</span>
                  <span className="text-slate-400">{formatDate(article.createdAt)}</span>
                </div>
              </div>

              {/* 続きを読むボタン */}
              <Link
                href={`/articles/${article.id}`}
                className="group/btn inline-flex items-center justify-center px-3 py-1.5 lg:px-4 lg:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs lg:text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105"
              >
                続きを読む
                <svg 
                  className="ml-1 lg:ml-2 w-3 h-3 lg:w-4 lg:h-4 group-hover/btn:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
