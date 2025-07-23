import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";
import Image from "next/image";

const Article = async ({ params }: { params: Promise<{ id: string }> }) => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${(await params).id}`, {
        next: { revalidate: 10 }, // ISR
    });
    const detailArticle = await res.json();

    return (
        <div className="bg-gray-300 max-w-3xl mx-auto px-4 py-4 mt-8 mb-8 rounded-lg shadow-lg text-gray-700">
            <div className="mb-6">
                <Image
                    src="https://images.unsplash.com/photo-1544894079-e81a9eb1da8b"
                    alt=""
                    width={1280}
                    height={300}
                    className="w-full h-[300px] object-cover rounded-lg shadow"
                />
            </div>
            <div className="mt-6 mb-6">

                <h1 className="text-center text-3xl font-bold   leading-snug">
                    {detailArticle.title}
                </h1>
                <p className="text-right text-sm text-gray-500 mb-4">
                    {new Date(detailArticle.createdAt).toLocaleString('ja-JP', {
                        weekday: 'short',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
            </div>

            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {detailArticle.content}
            </p>
            <div className="flex justify-end space-x-2 mt-3">
                <EditButton id={detailArticle.id} />
                <DeleteButton id={detailArticle.id} />
            </div>

        </div>
    );
};

export default Article;
