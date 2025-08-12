"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./Button";

type EditButtonProps = {
    id: string;
    loading?: boolean;
};

const EditButton = ({ id, loading = false }: EditButtonProps) => {
    const router = useRouter();

    const handleEditClick = () => {
        router.push(`/articles/${id}/edit`);
    };

    return (
        <Button
            onClick={handleEditClick}
            loading={loading}
            type="button"
        >
            EDIT
        </Button>
    );
};

export default EditButton;
