// src/components/EditButton.tsx
"use client";
import { useRouter } from "next/navigation";
import React from "react";

const EditButton = ({ id }: { id: string }) => {
    const router = useRouter();

    const handleEditClick = () => {
        router.push(`/articles/${id}/edit`);
    };

    return (
        <button
            className="bg-gray-100 hover:bg-gray-500 hover:text-gray-100 text-gray-600 font-medium py-2 px-4 rounded-md cursor-pointer transition duration-200 shadow-md"
            onClick={handleEditClick}
        >
            EDIT
        </button>
    );
};

export default EditButton;
