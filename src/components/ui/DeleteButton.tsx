// src/components/ui/DeleteButton.tsx
"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const DeleteButton = ({ id }: { id: string }) => {
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const handleDeleteConfirmed = async () => {
        setShowModal(false);
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`, {
            method: 'DELETE',
        });

        router.push("/");
        router.refresh();
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="bg-gray-100 hover:bg-gray-500 hover:text-gray-100 text-gray-600 font-medium py-2 px-4 rounded-md cursor-pointer transition duration-200 shadow-md"
            >
                DELETE
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-gray-100 p-6 rounded shadow-lg w-80 text-center">
                        <p className="mb-4 text-gray-800">本当に削除しますか？</p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                                onClick={handleDeleteConfirmed}
                            >
                                削除する
                            </button>
                            <button
                                className="bg-gray-600 hover:bg-gray-800 text-gray-100 px-4 py-2 rounded cursor-pointer"
                                onClick={() => setShowModal(false)}
                            >
                                キャンセル
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteButton;
