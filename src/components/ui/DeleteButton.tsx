// src/components/ui/DeleteButton.tsx
"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./Button";

type DeleteButtonProps = {
    id: string;
};

const DeleteButton = ({ id }: DeleteButtonProps) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDeleteConfirmed = async () => {
        setLoading(true);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`, {
                method: "DELETE",
            });
            setShowModal(false);
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("削除失敗:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                // className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => setShowModal(true)}
            >
                DELETE
            </Button>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-700 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-600/30 w-96 text-center">
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">記事の削除</h3>
                            <p className="text-slate-300">本当にこの記事を削除しますか？</p>
                            <p className="text-slate-400 text-sm mt-2">この操作は取り消すことができません。</p>
                        </div>
                        <div className="flex justify-center gap-4">
                            <Button
                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-red-500/30 hover:border-red-400/50"
                                onClick={handleDeleteConfirmed}
                                loading={loading}
                                disabled={loading}
                            >
                                削除する
                            </Button>
                            <Button
                                className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-slate-500/30 hover:border-slate-400/50"
                                onClick={() => setShowModal(false)}
                                disabled={loading}
                            >
                                キャンセル
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteButton;
