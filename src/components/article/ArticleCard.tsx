import { Article } from '@/types/model_type';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/formatDate';

type ArticleCardProps = {
  article: Article;
};

const ArticleCard = ({ article }: ArticleCardProps) => {
  const imageURL = article.imageURL || `https://picsum.photos/seed/${article.id}/600/400`;

  return (
    <article className="flex flex-col md:flex-row bg-slate-100 shadow-md rounded-lg overflow-hidden mb-6">
      <Link href={`/articles/${article.id}`} className="md:w-1/3 w-full">
        <img
          src={imageURL }
          alt={article.title}
          className="w-48 h-full object-cover rounded"
        />
      </Link>

      <div className="flex flex-col justify-between p-4 md:w-2/3 w-full">
        <div>
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <Link href={`/articles/${article.id}`}>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 hover:text-gray-700 mb-1">
              {article.title}
            </h2>
          </Link>

          <p className="text-gray-800 text-sm md:text-base mt-2 line-clamp-3">
            {article.content}
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 text-sm text-gray-600">
          <div>
            投稿者: <span className="font-medium">{article.author.name}</span><br />
            投稿日: {formatDate(article.createdAt)}
          </div>

          <Link
            href={`/articles/${article.id}`}
            className="mt-2 md:mt-0 text-pink-700 hover:text-black font-semibold"
          >
            続きを読む →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
