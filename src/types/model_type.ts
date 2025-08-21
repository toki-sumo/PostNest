// src/types/article_type.ts
export type Article = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    author: User;
    imageUrl: string;
    isPremium: boolean;
    price: number | null;
}

export type User = {
    id: string;
    name: string;
    Article: Article[];
}

export type Subscription = {
    id: string;
    userId: string;
    articleId: string;
    amount: number;
    status: SubscriptionStatus;
    stripeSessionId?: string;
    stripePaymentIntentId?: string;
    createdAt: string;
    updatedAt: string;
    article?: Article;
}

export type SubscriptionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type SubscriptionWithArticle = Subscription & {
    article: Article;
}