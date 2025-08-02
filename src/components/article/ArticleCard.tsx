import { Article } from '../../../types/article_type';
import Image from 'next/image';
import Link from 'next/link';

type ArticleCardProps = {
  article: Article;
};

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <article className="flex flex-col md:flex-row bg-white shadow-md rounded overflow-hidden mb-6">
      <Link href={`articles/${article.id}`} className="md:w-1/3 w-full">
        <Image
          src="https://images.unsplash.com/photo-1544894079-e81a9eb1da8b"
          alt="Article header image"
          width={400}
          height={250}
          className="w-full h-full object-cover"
        />
      </Link>

      <div className="flex flex-col justify-between p-4 md:w-2/3 w-full">
        <div>
          <Link href="#" className="text-blue-700 font-semibold text-sm">
            Technology
          </Link>
          <Link href={`articles/${article.id}`} className="block text-2xl font-bold text-gray-900 hover:text-gray-700 mt-1">
            {article.title}
          </Link>
          <p className="text-gray-600 text-sm mt-1">
            {new Date(article.createdAt).toLocaleString('ja-JP', {
              weekday: 'short',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className="text-gray-800 mt-2 line-clamp-3">
            {article.content}
          </p>
        </div>

        <div className="mt-4">
          <Link href={`articles/${article.id}`} className="text-pink-700 hover:text-black font-semibold">
            続きを読む →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
