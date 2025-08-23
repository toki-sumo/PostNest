PostNest（投資系ブログ＋有料記事購読プラットフォーム）
概要: 記事の作成・公開・課金購読までを一気通貫で提供。個人クリエイターが有料記事を安全に販売できるミニマムなプラットフォーム。
特徴: App Router でのモダン構成、Stripe 決済、NextAuth 認証、Prisma による型安全なDB、リッチテキスト編集（TipTap）、強固なセキュリティ実装。
主要機能
記事: 一覧/詳細/検索タグ、リッチテキスト表示（XSS対策済み）
投稿/編集/削除: 認証ユーザーが記事をCRUD、プレミアム設定と価格管理
有料記事: Stripe Checkout 連携、購読済みユーザーのみ本文解禁
ダッシュボード: 自分の投稿管理、購読履歴と統計
管理者: ユーザー管理（役割変更/無効化）、記事管理
認証: Google/GitHub OAuth＋メール/パスワード（NextAuth）
404/エラーハンドリング: グローバル not-found とセグメント 404、安定した失敗時UX
技術スタック
フロント/フレームワーク: Next.js 15（App Router, Route Handlers）, React 18, TypeScript
スタイル/UI: Tailwind（globals.css）, カスタムUI（カード/ボタン/フォーム）
エディタ: TipTap（RichTextEditor.tsx）
レンダリング: isomorphic-dompurify によるHTMLサニタイズ（RichTextDisplay.tsx）
バックエンド: Next.js API（App Routerの/app/api配下）
DB/ORM: Prisma（PostgreSQLを想定、prisma/migrations）
認証: NextAuth（Google/GitHub/Credentials, JWTセッション）
決済: Stripe（Checkout＋Webhook検証）
インフラ補助: docker-compose.yml（DB起動用）
セキュリティ実装（アピールポイント）
CSRF対策: 書き込みAPIに同一オリジン検査（Origin/Host 検証）
レート制限: AIタグ生成/サインアップにIP/ユーザー単位の制限（簡易メモリ実装）
認可: 記事編集・削除は著者or管理者のみ（APIレベルで検証）
機密情報の最小化: 公開APIから作者メールを除外
XSS対策: DOMPurifyでHTMLをサニタイズして表示
Webhook検証: Stripe署名（raw body）で厳格検証
有料コンテンツ保護: APIは未購読時に本文マスク＋UI側でも購読状態に応じて制御
パスワードポリシー: 8文字以上・英数混在、サインアップにレート制限
NextAuth: 役割（Admin/user/DISABLED）をJWTへ伝播、クライアントとサーバで整合
ディレクトリ（抜粋）
UI: src/components/ui/*, src/components/article/*
API: src/app/api/*（記事/認証/Stripe/管理者/ユーザー）
ページ: src/app/articles/*, src/app/dashboard/*, src/app/admin/*
認証: src/auth.ts, src/auth.config.ts
DB: prisma/schema.prisma, prisma/migrations/*
開発手順（ローカル）
前提: Node 18+, pnpm, Docker（DB用）, Stripe/Google/GitHubのキー
環境変数: DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, GOOGLE_ID/SECRET, GITHUB_ID/SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_BASE_URL
起動:
DB起動: docker compose up -d
依存関係: pnpm install
Prisma: pnpm prisma migrate deploy（必要に応じ generate）
開発: pnpm dev
Webhook（任意）: Stripe CLI で署名検証を設定
404/購読動作確認: 未購読時に本文マスク、有料記事購入後は解禁
設計の工夫
App Router準拠: サーバーコンポーネントとAPI Route Handlersで責務分離
堅牢な購読フロー: Checkout成功時はWebhook主導でDB確定、補助の確認APIは認証＋ユーザー照合
ユーザー体験: ローディング/エンプティステート/404の整備、モバイル・ダークテーマ対応
今後の発展
本番向けレート制限はKV/Redisへ移行
入力スキーマをZodで全APIに適用
SSG/キャッシュ最適化、検索/タグページの拡充
このプロジェクトは、モダンなNext.js構成の上で「安全な有料コンテンツ配信」を小さく確実に形にしたものです。フロント/バック/セキュリティ/決済の一通りを自走で設計・実装・改善できることを示します。




This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
