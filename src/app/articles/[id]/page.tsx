import DeleteButton from "@/components/ui/DeleteButton";
import EditButton from "@/components/ui/EditButton";
import Image from "next/image";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils/formatDate";

export default async function ArticleDetailPage({ params, }: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/articles/${(await params).id}`,
        {
            next: { revalidate: 10 }, // ISR
        }
    );

    if (!res.ok) return notFound();

    const detailArticle = await res.json();

    const isAuthor = session?.user?.id === detailArticle.authorId;
    const imageURL = detailArticle.imageURL || `https://picsum.photos/seed/${(await params).id}/600/400`;

    return (
        <main className="bg-gray-200 w-full max-w-3xl mx-auto mt-4 mb-4 rounded-lg shadow-lg text-gray-700">
            <div>
                <Image
                    src={imageURL}
                    alt=""
                    width={1280}
                    height={300}
                    className="w-full h-[300px] object-cover rounded-lg shadow"
                />
            </div>

            <div className="px-4 py-4">
                <div className="mt-6 mb-6">
                    <h1 className="text-center text-3xl font-bold leading-snug">
                        {detailArticle.title}
                    </h1>
                    <p className="text-right text-sm text-gray-500 mb-4">
                        {formatDate(detailArticle.createdAt)}
                    </p>
                </div>

                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {detailArticle.content}
                </div>

                {detailArticle.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 my-3">
                        {detailArticle.tags.map((tag: string) => (
                            <span
                                key={tag}
                                className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {isAuthor && (
                    <footer className="flex justify-end space-x-2 mt-3">
                        <EditButton id={detailArticle.id} />
                        <DeleteButton id={detailArticle.id} />
                    </footer>
                )}
            </div>
        </main>
    );
}
