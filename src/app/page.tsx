// src/app/page.tsx
import ArticleList from "@/components/ArticleList";
import {auth} from "../auth"

export default async function Home() {
  const session = await auth();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog`, {
    cache: "no-store",
  });
  const articles = await res.json();

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* 記事一覧（左側） */}
      <section className="w-full md:w-3/4 p-4">
        <ArticleList articles={articles} />
      </section>

      {/* サイドバー（右側） */}
      <aside className="w-full md:w-1/4 p-4">
        <div className="bg-white shadow-md rounded p-4 mb-6">
          <h3 className="font-bold text-gray-700 mb-2">About Me</h3>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            varius enim in eros elementum tristique.
          </p>
        </div>
        <div className="bg-white shadow-md rounded p-4 mb-6">
          <h3 className="font-bold text-gray-700 mb-2">Category</h3>
          <ul className="text-gray-600 mt-2 space-y-1">
            <li><a href="#">Technology</a></li>
            <li><a href="#">Automotive</a></li>
            <li><a href="#">Finance</a></li>
            <li><a href="#">Sports</a></li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
