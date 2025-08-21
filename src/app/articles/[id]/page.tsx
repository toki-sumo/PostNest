import DeleteButton from "@/components/ui/DeleteButton";
import EditButton from "@/components/ui/EditButton";
import Image from "next/image";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils/formatDate";
import RichTextDisplay from "@/components/article/RichTextDisplay";
import PurchaseButton from "@/components/article/PurchaseButton";
import { db } from "@/lib/db";
import CheckoutSuccessHandler from "@/components/article/CheckoutSuccessHandler";
import BackgroundDecoration from "@/components/common/BackgroundDecoration";

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();

    const { id } = await params;

    // API経由だと有料ガードでcontentが空になるため、サーバー側ではDBから直接取得
    const detailArticle = await db.article.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            tags: true,
            imageUrl: true,
            isPremium: true,
            price: true,
            authorId: true,
        },
    });

    if (!detailArticle) return notFound();

    const isAuthor = session?.user?.id === detailArticle.authorId;
    const imageURL = detailArticle.imageUrl || `https://picsum.photos/seed/${id}/600/400`;

    // 購読状態を確認（ログインしている場合のみ）
    let isSubscribed = false;
    if (session?.user && detailArticle.isPremium) {
        try {
            const subscription = await db.subscription.findUnique({
                where: {
                    userId_articleId: {
                        userId: session.user.id,
                        articleId: id,
                    }
                },
                select: { status: true }
            });
            isSubscribed = subscription?.status === 'completed';
        } catch (error: any) {
            console.error('購読状態の確認に失敗:', error?.message || error);
        }
    }

    return (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <CheckoutSuccessHandler />
            <BackgroundDecoration />

            <main className="w-full max-w-4xl mx-auto pt-20 pb-8 relative z-10">
                {/* ヘッダーセクション */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                        {detailArticle.title}
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-slate-300">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">{formatDate(detailArticle.createdAt.toISOString())}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-sm">
                                by {session?.user.name ?? "ユーザ名が取得できませんでした"}
                                {isAuthor && "（あなた）"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 有料記事表示 */}
                {detailArticle.isPremium && !isSubscribed && (
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 text-center">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                <h2 className="text-2xl font-bold text-yellow-400">有料記事</h2>
                            </div>
                            <p className="text-yellow-200 mb-4">
                                この記事の内容を読むには購読が必要です
                            </p>
                            <div className="text-4xl font-bold text-yellow-400 mb-6">
                                {`¥${(detailArticle.price ?? 0).toLocaleString()}`}
                            </div>
                            <PurchaseButton articleId={detailArticle.id} />
                        </div>
                    </div>
                )}

                {/* 購読済み表示 */}
                {detailArticle.isPremium && isSubscribed && (
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-2xl p-6 text-center">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <h2 className="text-2xl font-bold text-green-400">購読済み</h2>
                            </div>
                            <p className="text-green-200">
                                この記事は購読済みです。記事の内容をお読みいただけます。
                            </p>
                        </div>
                    </div>
                )}

                {/* メインコンテンツ */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl border border-slate-600/30 shadow-2xl shadow-blue-500/10 overflow-hidden">
                    {/* 画像セクション */}
                    <div className="relative">
                        <Image
                            src={imageURL}
                            alt={detailArticle.title}
                            width={1280}
                            height={400}
                            className="w-full h-[400px] object-cover"
                        />
                        {/* 画像オーバーレイ */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent"></div>
                    </div>

                    {/* タグと編集ボタン */}
                    <div className="flex flex-col sm:flex-row justify-between items-start p-6 border-b border-slate-600/30">
                        {detailArticle.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
                                {detailArticle.tags.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="bg-slate-700/50 text-slate-300 px-3 py-1.5 rounded-full text-sm font-medium border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {isAuthor && (
                            <div className="flex space-x-3">
                                <EditButton id={detailArticle.id} />
                                <DeleteButton id={detailArticle.id} />
                            </div>
                        )}
                    </div>

                    {/* 記事本文 */}
                    <div className="p-6">
                        {!detailArticle.isPremium || isSubscribed ? (
                            <RichTextDisplay 
                                content={detailArticle.content} 
                                className="text-slate-300" 
                            />
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-yellow-400 mb-4">記事の内容は購読後に表示されます</h3>
                                <p className="text-slate-300 mb-6">
                                    上記の購読ボタンから記事を購読すると、内容をお読みいただけます。
                                </p>
                                <div className="text-2xl font-bold text-yellow-400">
                                    {`¥${(detailArticle.price ?? 0).toLocaleString()}`}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 関連記事セクション（将来の拡張用） */}
                <div className="mt-12 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                        関連記事
                    </h2>
                    <p className="text-slate-400 mb-8">
                        この記事に関連する他の記事もチェックしてみましょう
                    </p>
                    <div className="bg-gradient-to-r from-slate-800/30 to-slate-700/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/20">
                        <p className="text-slate-400 text-sm">
                            関連記事の表示機能は現在開発中です
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
