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
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-gray-200 p-6 rounded shadow-lg w-80 text-center">
                        <p className="mb-4 text-gray-800">本当に削除しますか？</p>
                        <div className="flex justify-center gap-4">
                            <Button
                                className="bg-red-500 hover:bg-red-700 text-white"
                                onClick={handleDeleteConfirmed}
                                loading={loading}
                                disabled={loading}
                            >
                                削除する
                            </Button>
                            <Button
                                className="bg-gray-500 hover:bg-gray-700 text-white"
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
