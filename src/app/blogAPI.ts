import { Article } from "../types/model_type";
import { notFound } from "next/navigation";

export const getAllArticles = async (): Promise<Article[]> => {
    const res = await fetch("http://localhost:3001/posts", { cache: "no-store" }); //SSR

    if (!res.ok) {
        throw new Error("エラーが発生しました。");
    }

    const articles: Article[] = await res.json();
    return articles;
}

export const getDetailArticle = async (id: string): Promise<Article> => {
    const res = await fetch(`http://localhost:3001/posts/${id}`,
        {
            next: { revalidate: 60 }, //ISR
        });
    if (res.status === 404) {
        notFound();
    }

    if (!res.ok) {
        throw new Error("エラーが発生しました。");
    }

    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    const article: Article = await res.json();
    return article;
};

export const createArticle = async (id: string, title: string, content: string): Promise<Article> => {

    const currentDateTime = new Date().toISOString();
    const res = await fetch(`http://localhost:3001/posts`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id, title, content, createdAt: currentDateTime,
            }),
        });

    if (!res.ok) {
        throw new Error("エラーが発生しました。");
    }

    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    const newArticle: Article = await res.json();
    return newArticle;
};

export const deleteArticle = async (id: string,): Promise<Article> => {

    const res = await fetch(`http://localhost:3001/posts/${id}`,
        {
            method: "DELETE",
        });

    if (!res.ok) {
        throw new Error("エラーが発生しました。");
    }

    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    const deleteArticle: Article = await res.json();
    return deleteArticle;
};