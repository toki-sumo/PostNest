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
      className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-md cursor-pointer transition duration-200"
      onClick={handleEditClick}
    >
      編集
    </button>
  );
};

export default EditButton;
