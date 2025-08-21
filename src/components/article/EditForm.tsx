// components/article/EditForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  title: string;
  content: string;
};

const EditForm = ({ id, title: initialTitle, content: initialContent }: Props) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // NOTE: このコンポーネントは未使用の可能性があります。使用時はAPIエンドポイントを最新に合わせてください。
    // 旧: `${process.env.NEXT_PUBLIC_API_URL}/api/blog/edit/${id}` → 新: `/api/articles/edit/${id}`
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/edit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      alert("更新に失敗しました");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className="text-xl font-bold mb-4">記事を編集</h2>
      <input
        className="w-full mb-3 p-2 border"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full mb-3 p-2 border h-40"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        保存
      </button>
    </form>
  );
};

export default EditForm;
