import { getDetailArticle } from "@/app/blogAPI";
import DeleteButton from "@/components/DeleteButton";
import Image from "next/image";

const Article = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;
    // const detailArticle = await getDetailArticle(id);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${(await params).id}`, {
        next: { revalidate: 10 }, // ISR
    });
    const detailArticle = await res.json();

    return (
        <div className="bg-gray-300 max-w-3xl mx-auto px-4 py-8 mt-8 mb-8 rounded-lg shadow-lg">
            <div className="mb-6">
                <Image
                    src="https://images.unsplash.com/photo-1544894079-e81a9eb1da8b"
                    alt=""
                    width={1280}
                    height={300}
                    className="w-full h-[300px] object-cover rounded-lg shadow"
                />
            </div>

            <h1 className="text-center text-3xl font-bold text-gray-700 mt-10 mb-10 leading-snug">
                {detailArticle.title}
            </h1>

            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {detailArticle.content}
            </p>
            <div className="text-right mt-3">
                <DeleteButton id={detailArticle.id} />
            </div>
        </div>
    );
};

export default Article;
