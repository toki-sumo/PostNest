'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Article } from '@/types/model_type';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/formatDate';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';

type ArticleCardProps = {
  article: Article;
};

const fallbackImage = '/flower.jpeg'; 

const ArticleCard = ({ article }: ArticleCardProps) => {
  const router = useRouter();
  const defaultImage = article.imageUrl || `https://picsum.photos/seed/${article.id}/600/400`;
  const [imageSrc, setImageSrc] = useState(defaultImage);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);

  const handleImageError = () => {
    setImageSrc(fallbackImage);
    setHasImageError(true);
    setIsImageLoading(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setHasImageError(false);
  };

  return (
    <article
      className="group backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden border hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] h-80 bg-[var(--card)] border-[var(--border)] hover:border-[var(--card-hover-border)] relative cursor-pointer"
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/articles/${article.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.push(`/articles/${article.id}`);
        }
      }}
    >
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
          </div>
        </div>

        {/* コンテンツセクション */}
        <div className="flex flex-col justify-between p-4 lg:p-6 lg:w-3/5 w-full lg:rounded-r-2xl rounded-b-2xl lg:rounded-b-none h-full">
         {/* 有料バッジ */}
            {article.isPremium && (
              <div className="absolute top-4 right-4 z-30">
                <Badge variant="primary" size="sm" leadingIcon={(
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                )}>
                  <span className="hidden sm:inline">有料</span>
                </Badge>
              </div>
            )}
          <div className="space-y-1 lg:space-y-3">
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 lg:gap-2 overflow-hidden">
                {article.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="neutral" size="sm">#{tag}</Badge>
                ))}
                {article.tags.length > 3 && (
                  <span className="text-xs text-[var(--muted)] px-2 py-1 lg:px-3 lg:py-1.5">
                    +{article.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            <Link href={`/articles/${article.id}`}>
              <h2 className="text-sm lg:text-xl xl:text-2xl font-bold text-[var(--text)] hover:text-[var(--primary)] transition-colors duration-300 line-clamp-1 lg:line-clamp-2">
                {article.title}
              </h2>
            </Link>

            <p className="text-[var(--text)]/80 text-xs lg:text-base line-clamp-2 lg:line-clamp-3 leading-relaxed">
              {article.content.replace(/<[^>]*>/g, '')}
            </p>
          </div>

          <div className="mt-2 lg:mt-4 pt-2 lg:pt-4 border-t flex-shrink-0 min-h-[80px] lg:min-h-0 border-[var(--border)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 lg:gap-3">
              <div className="text-xs lg:text-sm text-[var(--muted)] space-y-0.5 lg:space-y-1">
                <div className="flex items-center gap-1 lg:gap-2 flex-nowrap min-w-0">
                  <span className="font-medium text-[var(--text)]/80 shrink-0">投稿者:</span>
                  <Link
                    href={`/users/${article.author.id}`}
                    className="font-medium text-[var(--primary)] hover:underline flex-1 truncate min-w-0"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    {article.author.name}
                  </Link>
                </div>
                <div className="flex items-center gap-1 lg:gap-2">
                  <span className="font-medium text-[var(--text)]/80">投稿日:</span>
                  <span className="text-[var(--muted)]">{formatDate(article.createdAt)}</span>
                </div>
              </div>

              <Link
                href={`/articles/${article.id}`}
                className="group/btn inline-flex items-center justify-center px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 bg-[var(--primary)] text-[var(--primary-contrast)]"
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
