// src/app/articles/[id]/edit/page.tsx
import EditForm from "@/components/ui/EditForm";

const EditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${(await params).id}`, {
    cache: "no-store",
  });
  const article = await res.json();

  return <EditForm id={(await params).id} title={article.title} content={article.content} />;
};

export default EditPage;
