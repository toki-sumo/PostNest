# PostNest

投資系ブログ＋有料記事購読プラットフォーム

---

## 📖 概要

記事の作成・公開・課金購読までを一気通貫で提供。  
個人クリエイターが有料記事を安全に販売できるミニマムなプラットフォーム。

---

## ✨ 特徴

- App Router によるモダン構成
- Stripe 決済
- NextAuth 認証
- Prisma による型安全な DB
- リッチテキスト編集（TipTap）
- 強固なセキュリティ実装

---

## 🚀 主要機能

- **記事**
  - 一覧 / 詳細 / タグ検索
  - リッチテキスト表示（XSS 対策済み）
- **投稿 / 編集 / 削除**
  - 認証ユーザーによる記事 CRUD
  - プレミアム設定と価格管理
- **有料記事**
  - Stripe Checkout 連携
  - 購読済みユーザーのみ本文解禁
- **ダッシュボード**
  - 投稿管理
  - 購読履歴と統計表示
- **管理者**
  - ユーザー管理（役割変更 / 無効化）
  - 記事管理
- **認証**
  - Google / GitHub OAuth + メール・パスワード
- **エラーハンドリング**
  - グローバル not-found
  - セグメント単位の 404
  - 安定した失敗時 UX

---

## 🛠 技術スタック

- **フロント/フレームワーク**: Next.js 15 (App Router, Route Handlers), React 18, TypeScript
- **スタイル/UI**: Tailwind CSS (globals.css), カスタム UI（カード/ボタン/フォーム）
- **エディタ**: TipTap (RichTextEditor.tsx)
- **レンダリング**: isomorphic-dompurify による HTML サニタイズ（RichTextDisplay.tsx）
- **バックエンド**: Next.js API (App Router `/app/api`)
- **DB/ORM**: Prisma（PostgreSQL, prisma/migrations）
- **認証**: NextAuth（Google/GitHub/Credentials, JWT セッション）
- **決済**: Stripe（Checkout + Webhook 検証）
- **インフラ補助**: docker-compose.yml（DB 起動用）

---

## 🔒 セキュリティ実装（アピールポイント）

- CSRF 対策: 書き込み API に同一オリジン検査（Origin/Host 検証）
- レート制限: AI タグ生成 / サインアップに IP/ユーザー単位制限（簡易メモリ実装）
- 認可: 記事編集・削除は著者 or 管理者のみ（API レベルで検証）
- 機密情報の最小化: 公開 API から作者メールを除外
- XSS 対策: DOMPurify による HTML サニタイズ
- Webhook 検証: Stripe 署名（raw body）による厳格検証
- 有料コンテンツ保護: API で未購読時は本文マスク + UI 側でも購読状態を制御
- パスワードポリシー: 8 文字以上・英数混在 + サインアップ時レート制限
- NextAuth: 役割 (Admin/User/Disabled) を JWT へ伝播し、クライアントとサーバで整合

---

## 🧩 ミドルウェア（`src/middleware.ts`）

- **目的**: ページレベルでの軽量なアクセス制御とリダイレクト。未ログインユーザーの保護ページアクセス時に、クッキー検査でサインインへサーバサイドリダイレクトします。
- **動作概要**
  - 公開パスは素通し:
    - `/`, `/signin`, `/signup`, `/favicon.ico`, `/articles`
    - `/_next` 配下, `/api` 配下, `.svg` リソース
  - 公開パス以外は、以下のセッショントークンがクッキーに存在するかを検査:
    - `__Secure-authjs.session-token` / `authjs.session-token` / `next-auth.session-token`
  - 未ログイン時は `/signin?callbackUrl=アクセス元パス` にリダイレクト
- **matcher**
  - `config.matcher = ['/((?!api|_next|favicon.ico|.*\\.svg$).*)']`
  - `api` と静的リソースを避け、アプリのページ遷移のみを対象化
- **設計メモ**
  - App Router のページ保護を SSR タイミングで行うことで、クライアント側でのフリッカー（保護ページが一瞬見える）を抑制
  - 公開パスを明示して `UntrustedHost` を回避
  - NextAuth の JWT セッションクッキーを前提とした軽量チェック（詳細な認可は API 側で強制）
- **カスタマイズ方法**
  - 公開ルートの追加: `publicPaths` へ追記
  - 完全保護したい場合は `matcher` を広げる（ただし `api/_next` は除外）
  - 役割ベースの分岐はページ/レイアウトレベル、もしくは API で厳格化

## 📂 ディレクトリ構成（抜粋）

src/
├── components/
│ ├── ui/_
│ └── article/_
├── app/
│ ├── articles/_
│ ├── dashboard/_
│ ├── admin/_
│ └── api/_ # 認証 / 記事 / Stripe / 管理者 / ユーザー
├── auth.ts
├── auth.config.ts
└── prisma/
├── schema.prisma
└── migrations/\*

---

## 🔧 開発手順（ローカル）

### 前提

- Node 18+
- pnpm
- Docker（DB 用）
- Stripe / Google / GitHub のキー

Webhook（任意）

Stripe CLI を用いて署名検証を設定

動作確認

未購読時: 本文マスク

購読後: 有料記事本文が解禁

🏗 設計の工夫

App Router 準拠: サーバーコンポーネントと API Route Handlers で責務を分離

堅牢な購読フロー: Checkout 成功時は Webhook 主導で DB 確定、補助 API は認証 + ユーザー照合

ユーザー体験:

ローディング / エンプティステート / 404 整備

モバイル対応

ダークテーマ対応

---

## 🚢 デプロイ手順 / 実行環境

### 環境の段階的構築（実績）
- アプリ: ローカル ⇔ DB: Homebrew の PostgreSQL サーバ
- アプリ: ローカル ⇔ DB: Docker（`docker-compose.yml`）の PostgreSQL サーバ
- アプリ: ローカル ⇔ DB: AWS RDS（PostgreSQL）
- アプリ: AWS EC2（Ubuntu）⇔ DB: AWS RDS（PostgreSQL）

### 本番: AWS RDS（PostgreSQL）
1) RDS で PostgreSQL インスタンスを作成（VPC/サブネット/セキュリティグループ設定）
2) 接続情報を `.env` へ設定
```bash
DATABASE_URL="postgresql://<user>:<password>@<rds-endpoint>:5432/<db>?schema=public&sslmode=require"
NEXTAUTH_URL="https://<your-domain>"
NEXTAUTH_SECRET="<generated>"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
GOOGLE_ID=... GOOGLE_SECRET=...
GITHUB_ID=... GITHUB_SECRET=...
NEXT_PUBLIC_BASE_URL="https://<your-domain>"
```
3) Prisma マイグレーション適用
```bash
pnpm prisma migrate deploy
```

### 本番: AWS EC2（Ubuntu）へのデプロイ
1) EC2 構築（Ubuntu）→ セキュリティグループで 80/443 を許可（必要に応じて 22）
2) Node/pnpm 設定、リポジトリを clone
```bash
git clone https://github.com/toki-sumo/PostNest.git
cd PostNest
pnpm install
```
3) 環境変数を設定（上記 `.env`）
4) ビルドと起動
```bash
pnpm build
pnpm start
```
5) プロセスマネージャ（例: pm2）や systemd で常駐化、Nginx でリバースプロキシ（HTTPS 終端）

### Stripe Webhook（本番）
- Stripe ダッシュボードで Webhook エンドポイントを登録（`/api/stripe/webhook`）
- 署名シークレットを `STRIPE_WEBHOOK_SECRET` に設定
- 署名検証は raw body で行うため、リバースプロキシの設定でボディ改変を避ける

### 参考: ローカルと Docker
- Homebrew PostgreSQL 例
```bash
brew install postgresql@16
brew services start postgresql@16
export DATABASE_URL="postgresql://postgres:@localhost:5432/postnest?schema=public"
```
- Docker Compose 例
```bash
docker compose up -d
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postnest?schema=public"
pnpm prisma migrate dev
```

---

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
