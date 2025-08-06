import { Article } from '../../types/model_type';
import ArticleCard from './ArticleCard';

type Props = {
  articles: Article[];
};

const ArticleList = ({ articles }: Props) => {
  return (
    <div className="flex flex-col space-y-6 w-full">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default ArticleList;
