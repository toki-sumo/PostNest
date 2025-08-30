import DeleteButton from "@/components/ui/DeleteButton";
import EditButton from "@/components/ui/EditButton";
import Image from "next/image";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils/formatDate";
import Link from "next/link";
import RichTextDisplay from "@/components/article/RichTextDisplay";
import PurchaseButton from "@/components/article/PurchaseButton";
import { db } from "@/lib/db";
import CheckoutSuccessHandler from "@/components/article/CheckoutSuccessHandler";
import BackgroundDecoration from "@/components/common/BackgroundDecoration";

export const runtime = 'nodejs'

// Next.js v15の型に合わせ params は Promise として受け取り、実行時に解決
export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    let session: Session | null = null
    try {
        session = (await auth()) as Session | null
    } catch (e) {
        console.error('auth() failed on article detail:', e)
        session = null
    }

    // params が Promise かオブジェクトか実行環境で揺れるため吸収
    const { id } = await params

    // API経由だと有料ガードでcontentが空になるため、サーバー側ではDBから直接取得
    let detailArticle: {
        id: string; title: string; content: string; createdAt: Date; updatedAt: Date; tags: string[];
        imageUrl: string | null; isPremium: boolean; price: number | null; authorId: string;
        author: { id: string; name: string | null } | null;
    } | null = null
    try {
        detailArticle = await db.article.findUnique({
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
                author: { select: { id: true, name: true } },
            },
        });
    } catch (e) {
        console.error('記事取得に失敗:', e)
    }

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
        } catch (error: unknown) {
            const message = (error as Error)?.message ?? String(error);
            console.error('購読状態の確認に失敗:', message);
        }
    }

    return (
        <div className="min-h-screen">
            <CheckoutSuccessHandler />
            <BackgroundDecoration />

            <main className="w-full max-w-4xl mx-auto pt-24 md:pt-28 pb-8 relative z-10">
                {/* ヘッダーセクション */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-4 leading-tight">
                        {detailArticle.title}
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[var(--text)]/85">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">{formatDate(detailArticle.createdAt.toISOString())}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-sm">
                                by {detailArticle.author?.name ? (
                                  <Link href={`/users/${detailArticle.author.id}`} className="text-[var(--primary)] hover:underline">
                                    {detailArticle.author.name}
                                  </Link>
                                ) : "投稿者"}
                                {isAuthor && "（あなた）"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 有料記事表示 */}
                {detailArticle.isPremium && !isSubscribed && (
                    <div className="mb-8">
                        <div className="rounded-2xl p-6 text-center border bg-yellow-50 border-yellow-200">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                <h2 className="text-2xl font-bold text-yellow-600">有料記事</h2>
                            </div>
                            <p className="text-yellow-700 mb-4">
                                この記事の内容を読むには購読が必要です
                            </p>
                            <div className="text-4xl font-bold text-yellow-600 mb-6">
                                {`¥${(detailArticle.price ?? 0).toLocaleString()}`}
                            </div>
                            <PurchaseButton articleId={detailArticle.id} />
                        </div>
                    </div>
                )}

                {/* 購読済み表示 */}
                {detailArticle.isPremium && isSubscribed && (
                    <div className="mb-8">
                        <div className="rounded-2xl p-6 text-center border bg-emerald-50 border-emerald-200">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <h2 className="text-2xl font-bold text-emerald-700">購読済み</h2>
                            </div>
                            <p className="text-emerald-700">
                                この記事は購読済みです。記事の内容をお読みいただけます。
                            </p>
                        </div>
                    </div>
                )}

                {/* メインコンテンツ */}
                <div className="backdrop-blur-sm rounded-2xl border shadow-2xl shadow-blue-500/10 overflow-hidden bg-[var(--card)] border-[var(--border)]">
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    </div>

                    {/* タグと編集ボタン */}
                    <div className="flex flex-col sm:flex-row justify-between items-start p-6 border-b border-[var(--border)]">
                        {detailArticle.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
                                {detailArticle.tags.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 bg-[var(--card)] text-[var(--text)] border-[var(--border)] hover:border-[var(--card-hover-border)]"
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
                                className="text-[var(--text)]"
                            />
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-yellow-50">
                                    <svg className="w-12 h-12 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-yellow-700 mb-4">記事の内容は購読後に表示されます</h3>
                                <p className="text-[var(--text)]/85 mb-6">
                                    上記の購読ボタンから記事を購読すると、内容をお読みいただけます。
                                </p>
                                <div className="text-2xl font-bold text-yellow-700">
                                    {`¥${(detailArticle.price ?? 0).toLocaleString()}`}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 関連記事セクション（将来の拡張用） */}
                <div className="mt-12 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--text)] mb-6">
                        関連記事
                    </h2>
                    <p className="text-[var(--muted)] mb-8">
                        この記事に関連する他の記事もチェックしてみましょう
                    </p>
                    <div className="backdrop-blur-sm rounded-2xl p-8 border bg-[var(--card)] border-[var(--border)]">
                        <p className="text-[var(--muted)] text-sm">
                            関連記事の表示機能は現在開発中です
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
