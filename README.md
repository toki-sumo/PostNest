# PostNest (投資系ブログ＋有料記事購読プラットフォーム) — [WIP]

- 公開中サイト（25/9 現在）
  https://ec2-57-181-61-159.ap-northeast-1.compute.amazonaws.com/
- 現在も機能追加・修正中のため、一部エラーが発生する可能性があります。
- 自己署名証明書を使用しているため警告が出ますが、閲覧には問題ありません。
- 自由にアカウント作成や記事投稿を行っていただけます。個人情報の入力は行わないでください。

- [📖 概要](#overview)
- [✨ 特徴](#features)
  - [🚀 主要機能](#main-features)
  - [🎛 UX の工夫](#ux)
- [🧱 技術・構成](#tech-arch)
  - [🛠 技術スタック](#stack)
  - [🧾 使用言語まとめ](#langs)
  - [🏗️ Architecture（Overview）](#arch-summary)
  - [📂 ディレクトリ構成](#dirs)
- [🧑‍💻 開発・デプロイ](#dev-deploy)
  - [🔧 開発手順（ローカル）](#dev)
  - [🚢 デプロイ手順 / 実行環境](#deploy)
    - [🌐 Nginx リバースプロキシ](#nginx)
    - [🔐 Secrets Management](#secrets)
- [🔒 セキュリティ](#security)
  - [🧩 ミドルウェア](#middleware)
  - [🔗 API エンドポイント概要](#api)
  - [🔁 Webhook と購読反映](#webhook)
  - [🧭 ER 図](#er)
- [🖼 画像アップロード（S3）](#s3-upload)
- [☁️ AWS サービス（運用基盤）](#aws-services)
- [🧪 テストとパフォーマンス](#test-perf)
  - [🧪 テスト戦略](#testing)
  - [🚀 Performance / Optimization](#perf)
- [🛠 運用](#ops-ops)
  - [📈 監視 / ログ](#ops)
  - [🗄️ バックアップ / リストア](#backup)
- [🖼 スクリーンショット / デモ](#screens)

---

<a id="overview"></a>

## 📖 概要

記事の作成・公開・課金購読までを一気通貫で提供。  
個人クリエイターが有料記事を安全に販売できるミニマムなプラットフォーム。

> まず UI を確認したい場合は「[スクリーンショット / デモ](#screens)」をご覧ください。

---

<a id="features"></a>

## ✨ 特徴（開発者向け）

- Next.js App Router ベースのフルスタック構成
- Stripe Checkout 決済
- NextAuth 認証
- Prisma による型安全な ORM（データベース操作）
- TipTap による拡張可能なリッチテキストエディタ
- CSRF, XSS, JWT 認可まで網羅したセキュリティ制御

---

<a id="main-features"></a>

## 🚀 主要機能（利用者向け）

- 記事の作成と販売: ユーザーは TipTap で記事を作成し、価格・タグを設定して Stripe Checkout で販売できる
- 有料本文の保護: 要約のみ閲覧可能。本文は購読完了ユーザーのみがアクセス可能。
- ダッシュボード運用: 投稿一覧・購読履歴・売上指標をダッシュボードで把握できる
- 管理業務: 管理者はユーザーの役割変更/無効化、記事の公開状態を管理できる
- 認証/認可: Google/GitHub OAuth とメール・パスワード認証、JWT でロールを伝播して権限を制御

---

<a id="ux"></a>

## 🎛 UX の工夫（利用者向け）

- 未購読時は本文を明確にマスクし、すぐ横に購入導線（価格・説明・ボタン）を配置
- ダッシュボードはカードレイアウトで「投稿一覧」「購読履歴」「統計」を一目で把握
- モバイルでも操作しやすいようにナビゲーションを最適化（ハンバーガー内にテーマ切替）

---

<a id="stack"></a>

## 🛠 技術スタック

- **フロントエンド**: Next.js 15（App Router, Route Handlers）, React 18, TypeScript, Tailwind CSS
- **UI**: カスタムコンポーネント（カード / ボタン / フォーム）
- **エディタ**: TipTap（リッチテキスト編集）
- **レンダリング / サニタイズ**: isomorphic-dompurify
- **バックエンド / API**: Next.js Route Handlers（/app/api）
- **ランタイム**: Node.js 18+（Next.js は Node.js 上で稼働）
- **DB / ORM**: PostgreSQL + Prisma（migrations / schema.prisma）
- **認証**: NextAuth（Google / GitHub / Credentials, JWT セッション）
- **決済**: Stripe（Checkout + Webhook）
- **インフラ**: AWS EC2 / RDS, Docker Compose（ローカル）

---

<a id="langs"></a>

## 🧾 使用言語まとめ

- 使用言語（簡潔版）
  - TypeScript/TSX
  - HTML（JSX/TSX に内包）
  - CSS（Tailwind CSS）
  - SQL（Prisma DDL）
  - JSON
  - YAML
  - Shell（CLI）
  - Markdown

| 種別             | 主な用途                                                                                             | 代表ファイル / ディレクトリ |
| ---------------- | ---------------------------------------------------------------------------------------------------- | --------------------------- |
| TypeScript / TSX | Next.js(App Router) ページ/レイアウト、API Route Handlers、React コンポーネント、認証/ユーティリティ | `src/app/**`<br>`src/app/api/**`<br>`src/components/**`<br>`src/auth.ts` / `src/auth.config.ts`<br>`src/lib/**` |
| SQL / Prisma DDL | データモデル定義とマイグレーション | `prisma/schema.prisma`, `prisma/migrations/*` |
| CSS (Tailwind) | グローバルスタイルとユーティリティクラス | `src/app/globals.css`, 各 TSX 内のクラス指定 |
| JSON | 依存関係・設定 | `package.json`, `tsconfig.json`, `eslint.config.mjs`, `playwright.config.ts` |
| YAML | ローカル開発での DB 起動 | `docker-compose.yml` |
| Shell / CLI | 運用コマンド・ツール | README/Docs 記載の `pnpm`, `pm2`, Stripe CLI 等 |
| Markdown | ドキュメント | `README.md`, `docs/*.md` |

---

<a id="arch-summary"></a>

## 🏗️ Architecture（Overview）

```mermaid
flowchart TD
  Client[ブラウザ] --> Next[Next.js App Router]
  Next --> API[API Route Handlers]
  API --> Auth[NextAuth]
  API --> Prisma[Prisma Client]
  Prisma --> DB[(PostgreSQL - RDS)]
  API --> Stripe[Stripe API]
  Stripe --> Webhook["Webhook Handler (/api/stripe/webhook)"]
  Webhook --> Prisma
  Client -.-> S3["S3 (avatar upload)"]
  CW[(CloudWatch Logs)] --- API
```

```mermaid
sequenceDiagram
  participant U as User
  participant FE as Next.js (Client)
  participant API as API (Route Handlers)
  participant ST as Stripe
  participant WH as Webhook Handler
  participant DB as PostgreSQL

  U->>FE: 購入ボタン
  FE->>API: POST /api/checkout
  API->>ST: Checkout Session 作成
  ST-->>FE: セッションURL
  FE->>ST: 遷移して決済
  ST-->>WH: checkout.session.completed
  WH->>DB: upsert Subscription
  FE->>API: 記事取得
  API->>DB: 購読確認
  DB-->>API: OK
  API-->>FE: 本文返却
```

> 詳細解説は `docs/architecture.md` も参照してください。

---

<a id="security"></a>

## 🔒 セキュリティ（脅威 → 対策）

| 脅威                                      | 対策                                    | 主要実装箇所                                |
| ----------------------------------------- | --------------------------------------- | ------------------------------------------- |
| CSRF（書き込み API の不正呼び出し）       | 同一オリジン検査（Origin/Host 検証）    | `app/api/**` 各 Route Handlers              |
| XSS（リッチテキスト経由のスクリプト混入） | DOMPurify による HTML サニタイズ        | `components/article/RichTextDisplay.tsx`    |
| 不正閲覧（未購読で有料本文取得）          | API レイヤで本文を返さない＋ UI マスク  | `app/api/articles/[id]` / `ArticleCard`     |
| 認可漏れ（権限外の操作）                  | JWT にロールを埋め込み、API 側で検証    | `src/auth.config.ts` callbacks / 各 API     |
| Webhook なりすまし                        | Stripe 署名（raw body）検証             | `app/api/stripe/webhook/route.ts`           |
| パスワード総当たり                        | ポリシー＋レート制限（IP/ユーザー単位） | `app/api/auth/signup/route.ts`, `lib/utils` |

### ミドルウェア（`src/middleware.ts`）

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

```text
src/
├── app/
│   ├── articles/
│   │   ├── [id]/
│   │   ├── new/
│   │   └── page.tsx
│   ├── api/
│   │   ├── articles/
│   │   ├── stripe/webhook/
│   │   └── ...
│   ├── admin/
│   ├── dashboard/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── article/
│   ├── ui/
│   ├── dashboard/
│   └── theme/
├── auth.ts
├── auth.config.ts
├── lib/
│   ├── db.ts
│   ├── prisma.ts
│   ├── stripe.ts
│   └── utils/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── docs/
│   └── architecture.md
├── public/
│   └── screenshots/
└── ...
```

---

<a id="dev"></a>

## 🔧 開発手順（ローカル）

### 前提

- Node 18+
- pnpm
- PostgreSQL（Homebrew または Docker）
- Stripe / Google / GitHub のキー

### 1. リポジトリ取得と依存関係

```bash
git clone https://github.com/toki-sumo/PostNest.git
cd PostNest
pnpm install
```

### 2. DB の用意（どちらかを選択）

- Homebrew（macOS）

```bash
brew install postgresql@16
brew services start postgresql@16
```

- Docker Compose

```bash
docker compose up -d
```

### 3. 環境変数の設定（.env）

ローカル実行の最小例（必要最低限）:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postnest?schema=public"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
# S3（画像アップロードを使う場合）
S3_REGION="ap-northeast-1"
S3_BUCKET_NAME="your-s3-bucket"
# 以下はローカル/明示指定したい場合のみ。EC2 ロール使用時は未設定でOK
S3_ACCESS_KEY_ID="AKIA..."
S3_SECRET_ACCESS_KEY="..."
# 公開 URL のベース
NEXT_PUBLIC_S3_PUBLIC_BASE_URL="https://your-s3-bucket.s3.ap-northeast-1.amazonaws.com"
```

### 4. Prisma セットアップ

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

### 5. 開発サーバ起動

```bash
pnpm dev
# http://localhost:3000 にアクセス
```

> 正常確認: ブラウザでサインイン → 記事投稿ができればセットアップ成功です。

### 6. Stripe Webhook（ローカル）

Stripe CLI を利用してイベント転送と署名検証を設定します。

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
# 表示された Signing secret を .env の STRIPE_WEBHOOK_SECRET に設定
```

### 動作確認ポイント

- 未購読ユーザーは有料記事の本文がマスクされる
- Checkout 成功後に本文が閲覧可能になる
- 記事の作成/編集/削除はログイン済みの著者（または管理者）のみ可能

---

<a id="deploy"></a>

## 🚢 デプロイ手順 / 実行環境

### 環境の段階的構築（実績）

- アプリ: ローカル ⇔ DB: Homebrew の PostgreSQL サーバ
- アプリ: ローカル ⇔ DB: Docker（`docker-compose.yml`）の PostgreSQL サーバ
- アプリ: ローカル ⇔ DB: AWS RDS（PostgreSQL）
- アプリ: AWS EC2（Ubuntu）⇔ DB: AWS RDS（PostgreSQL）

### 本番: AWS RDS（PostgreSQL）

1. RDS で PostgreSQL インスタンスを作成（VPC/サブネット/セキュリティグループ設定）
2. 接続情報を `.env` へ設定

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

3. Prisma マイグレーション適用

```bash
pnpm prisma migrate deploy
```

### 本番運用ベストプラクティス

- HTTPS 化: Let’s Encrypt + Nginx（HTTP→HTTPS リダイレクト、TLSv1.2 以上）
- マイグレーション: 本番は `migrate deploy` のみ（`migrate dev` は禁止）
- バックアップ: RDS の自動スナップショット + `pg_dump` 世代管理
- ログ: pm2 logs を CloudWatch / S3 へ集約、ローテーションを設定

### 本番: AWS EC2（Ubuntu）へのデプロイ

1. EC2 構築（Ubuntu）→ セキュリティグループで 80/443 を許可（必要に応じて 22）
2. Node/pnpm 設定、リポジトリを clone

```bash
git clone https://github.com/toki-sumo/PostNest.git
cd PostNest
pnpm install
```

3. 環境変数を設定（上記 `.env`）
4. ビルドと起動

```bash
pnpm build
pnpm start
```

5. プロセスマネージャ（例: pm2）や systemd で常駐化、Nginx でリバースプロキシ（HTTPS 終端）

#### EC2 への接続（SSH）

1. AWS コンソールでキーペア（.pem）を作成・ダウンロード（漏えい厳禁）
2. ローカルで鍵の権限を適切に設定

```bash
chmod 400 keyname.pem
```

3. SSH で接続（Ubuntu AMI の既定ユーザーは `ubuntu`）

```bash
ssh -i keyname.pem ubuntu@<EC2_PUBLIC_IP>
```

- Elastic IP を割り当てている場合は `<EC2_PUBLIC_IP>` に Elastic IP を指定
- Amazon Linux では `ec2-user` が既定

4. セキュリティグループの SSH(22) は自分のグローバル IP のみ許可（`X.X.X.X/32`）

任意（接続を簡略化）: `.ssh/config` に設定

```sshconfig
Host postnest-ec2
  HostName <EC2_PUBLIC_IP>
  User ubuntu
  IdentityFile ~/path/to/keyname.pem
```

以降は `ssh postnest-ec2` で接続可能。

#### pm2 による常駐化（推奨）

1. pm2 をインストール

```bash
npm i -g pm2
```

2. アプリを常駐起動（例）

```bash
# Next.js を production 起動（pnpm を使う場合）
pm2 start pnpm --name postnest -- start

# npm を使う場合
pm2 start npm --name postnest -- start

# もしくは Node の実行ファイルを直接（standalone 構成等）
# pm2 start .next/standalone/server.js --name postnest
```

3. 停止/再起動/状態/ログ

```bash
pm2 stop postnest
pm2 restart postnest
pm2 status
pm2 logs postnest --lines 100
```

4. サーバ再起動後の自動起動

```bash
pm2 save
pm2 startup systemd
# 表示されるコマンドを sudo で実行して登録します
```

### Stripe Webhook（本番）

- Stripe ダッシュボードで Webhook エンドポイントを登録（`/api/stripe/webhook`）
- 署名シークレットを `STRIPE_WEBHOOK_SECRET` に設定
- 署名検証は raw body で行うため、リバースプロキシの設定でボディ改変を避ける

### セキュリティグループ設定（RDS / EC2）

- **ローカル ⇔ RDS（PostgreSQL）**
  - RDS（インバウンド）: TCP 5432 を「自宅/職場などのグローバル IP アドレス」からのみ許可（`X.X.X.X/32`）
  - 注意: `0.0.0.0/0` で 5432 を開放しない（インターネット全体に公開となるため）

- **EC2 ⇔ RDS（PostgreSQL）**
  - EC2 に Elastic IP を割り当てる
  - RDS（インバウンド）: TCP 5432 を EC2 の Elastic IP のみから許可（`E.E.E.E/32`）
    - もしくは、RDS のインバウンドに「EC2 のセキュリティグループ」を参照設定（推奨）

- **EC2（アプリ公開用）**
  - HTTP: TCP 80 を `0.0.0.0/0`（公開）
  - HTTPS: TCP 443 を `0.0.0.0/0`（公開）
  - SSH: TCP 22 を 管理者のグローバル IP のみ（`X.X.X.X/32`）
  - カスタム TCP（開発/検証用）: TCP 3000 を一時的に許可
    - できれば「自分の IP のみ」（`X.X.X.X/32`）。やむを得ず公開する場合は `0.0.0.0/0` とし、検証後は必ず閉じる

> 本番では 3000 番ポートは閉じ、Nginx 等のリバースプロキシ経由（80/443）でアプリを公開する運用を推奨します。

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

<a id="roles"></a>

## 👤 役割と権限

| 機能                    | Admin | User                | DISABLED |
| ----------------------- | ----- | ------------------- | -------- |
| 記事閲覧（無料）        | ○     | ○                   | ×        |
| 記事閲覧（有料/購読済） | ○     | ○                   | ×        |
| 記事作成/編集/削除      | ○     | ○（自分の投稿のみ） | ×        |
| 管理画面アクセス        | ○     | ×                   | ×        |
| ユーザー権限変更        | ○     | ×                   | ×        |

---

<a id="api"></a>

## 🔗 API エンドポイント概要（抜粋）

- 記事
  - `GET /api/articles`（公開一覧）
  - `GET /api/articles/[id]`（公開詳細。プレミアムは本文マスク）
  - `POST /api/articles`（認証＋同一オリジン）
  - `PUT /api/articles/edit/[id]`（著者のみ＋同一オリジン）
  - `DELETE /api/articles/[id]`（著者/管理者＋同一オリジン）
- 認証/ユーザー
  - `POST /api/auth/signup`（パスワードポリシー＋レート制限）
  - `PUT /api/user`（プロフィール更新：認証＋同一オリジン）
  - `POST /api/user/avatar`（認証。S3 Presigned POST を払い出し）
- 決済/購読
  - `POST /api/checkout`（認証、Checkout セッション作成）
  - `POST /api/stripe/webhook`（署名検証）
  - `POST /api/subscriptions/confirm`（認証＋ユーザー一致検証）
- 管理
  - `GET /api/admin/users`（Admin）
  - `PATCH /api/admin/users/[id]`（Admin）

---

<a id="webhook"></a>

## 🔁 Webhook と購読反映の流れ

- Checkout セッション作成時に `metadata` として `{ userId, articleId }` を付与（`/api/checkout`）
- Stripe は `checkout.session.completed` を `/api/stripe/webhook` に通知
  - 署名は raw body を用いて検証（`STRIPE_WEBHOOK_SECRET`）
- 通知受信後、Prisma の Subscription モデルに購読を反映（`upsert`）
  - 複合一意キー `userId_articleId` で冪等化（再通知・重複を無視）
  - `amount`, `status`, `stripeSessionId`, `stripePaymentIntentId` を保存（監査/重複判定に活用）

参考実装: `src/app/api/stripe/webhook/route.ts`

---

<a id="s3-upload"></a>

## 🖼 画像アップロード（S3）

本アプリではプロフィール画像を **S3 Presigned POST** で直接 S3 にアップロードします。

- 実装箇所
  - サーバ: `src/lib/s3.ts`（S3 クライアントと Presigned POST 生成）
  - API: `src/app/api/user/avatar/route.ts`（認証後に presigned を払い出し）
  - UI: `src/app/dashboard/profile/page.tsx`（フォームから S3 に直接 POST）

### フロー（概要）

1. クライアントが `POST /api/user/avatar` に `contentType`（例: `image/jpeg`）を送信
2. サーバは `createPresignedPost` で条件付きの Presigned フォームを生成し返却
   - ファイルサイズ上限（5MB）
   - Content-Type を固定
   - アップロード先キー例: `avatars/original/<userId>/<timestamp>`
3. クライアントは返却された `url` と `fields` を用いて、S3 に直接 `multipart/form-data` で POST
4. 成功後、`publicUrl` をプロフィール画像 URL として保存（`PUT /api/user`）

### 環境変数（再掲）

`.env` に S3 関連を設定します（EC2 ロールで動かす場合は `ACCESS_KEY/SECRET` は省略可）。

```bash
S3_REGION="ap-northeast-1"
S3_BUCKET_NAME="your-s3-bucket"
S3_ACCESS_KEY_ID="AKIA..."            # 任意（明示する場合）
S3_SECRET_ACCESS_KEY="..."             # 任意（明示する場合）
NEXT_PUBLIC_S3_PUBLIC_BASE_URL="https://your-s3-bucket.s3.ap-northeast-1.amazonaws.com"
```

<!-- 将来の Lambda 自動生成についての記述は削除（未実装のため） -->

### セキュリティ注意点

- Presigned POST は短寿命（デフォルト 60 秒）。条件（Content-Type/サイズ）で濫用を抑制
- API は認証必須（`auth()` で `session.user.id` を検証）
- 公開 URL は読み取り専用にし、書き込みは Presigned 経由のみに限定

### テスト（観点）

- 単体: `createAvatarPresignedPost` がサイズ/Content-Type 条件を含むか
- 結合: `POST /api/user/avatar` が未認証で 401、画像以外で 400 を返すか
- E2E: UI からの選択 → presigned 取得 → S3 POST → URL 保存までが正常に流れるか

---

<a id="aws-services"></a>

## ☁️ AWS サービス（運用基盤）

本プロジェクトで想定/利用している AWS サービスのうち、README で明示しておくと運用・セキュリティ観点で伝わりやすい項目をまとめます。

### IAM（最小権限）

- EC2 インスタンスロール（アプリ）
  - 目的: S3 Presigned POST の生成に必要な最低権限
  - 権限例（バケットとプレフィックスを限定）:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AppWriteToOriginalAvatarsOnly",
      "Effect": "Allow",
      "Action": ["s3:PutObject"],
      "Resource": "arn:aws:s3:::<BUCKET_NAME>/avatars/original/*"
    }
  ]
}
```

<!-- 未実装の Lambda ロール例は削除 -->

### CloudWatch（ログ/監視）

- ログ集約: pm2 のアプリログを CloudWatch Logs に集約（保持期間を設定）
- 監視/アラーム例:
  - API の 5xx（Nginx/ALB/アプリのいずれか）増加
  - EC2 CPU/メモリ/ディスク使用率の閾値超過
  - Stripe Webhook 失敗回数の増加（アプリメトリクス/ログベースメトリクス）
  <!-- 未実装の Lambda 監視は削除 -->

> これらは `docs/deploy.md` の運用項目とも関連します。最小権限/見える化を前提に本番環境を設計してください。

### API/JSON 実例（抜粋）

記事作成（認証必須）:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT>" \
  -d '{
    "title": "サンプル記事",
    "content": "<p>本文</p>",
    "price": 500,
    "tags": ["macro", "equity"]
  }' \
  https://<host>/api/articles
```

> その他のエンドポイント詳細は `docs/api.md` を参照してください。

---

<a id="er"></a>

## 🧭 データモデル（ER 図 概要）

モデル名は Prisma の `Subscription` に統一しています。

```mermaid
erDiagram
  User ||--o{ Article : "writes"
  User ||--o{ Subscription : "purchases"
  Article ||--o{ Subscription : "is purchased"

  User {
    string id PK
    string email
    string role
    datetime createdAt
    datetime updatedAt
  }
  Article {
    string id PK
    string authorId FK
    boolean isPremium
    int price
    datetime createdAt
    datetime updatedAt
  }
  Subscription {
    string id PK
    string userId FK
    string articleId FK
    string status
    int amount
    string stripeSessionId
    string stripePaymentIntentId
    datetime createdAt
  }
```

---

<a id="backup"></a>

## 🗄️ DB バックアップ / リストア（例）

```bash
# Backup（環境に合わせて接続情報を指定）
pg_dump --format=c --no-acl --no-owner "$DATABASE_URL" > backup.dump

# Restore（先に空DBを用意し、同一スキーマで）
pg_restore --clean --no-acl --no-owner -d "$DATABASE_URL" backup.dump
```

---

<a id="stripe-test"></a>

## 💳 Stripe テスト情報（例）

- テストカード: `4242 4242 4242 4242` / 01/33 / 123 / 任意名
- Webhook: 署名シークレットを `STRIPE_WEBHOOK_SECRET` に設定し、raw body を破壊しないプロキシ設定にする
- 失敗検証: 購入キャンセル、署名不一致、未購読時の本文マスクを確認

---

<a id="troubleshoot"></a>

## 🧰 トラブルシューティング

- Prisma の接続/マイグレーション
  - `DATABASE_URL` を再確認、`pnpm prisma migrate deploy|dev` を実行
  - DB が起動しているか確認（Docker/Local）。`psql` で疎通チェック
- Webhook 署名失敗
  - 署名シークレット誤り/ボディ改変（圧縮/再エンコード）を確認
  - Stripe ダッシュボードのイベントを再送して動作確認
- CSRF の 403
  - `Origin/Host` が一致しているか。フロントと API のホスト/プロトコルを揃える
- 3000 番ポートが外から見えない
  - 本番は 80/443 経由（Nginx）。検証時の 3000 開放は一時的に
- 画像や静的アセットが出ない
  - `public/` のパスと参照パス（`/screenshots/...`）を再確認

---

## 🗄️ Prisma Model 定義抜粋

```prisma
model Subscription {
  id                  String   @id @default(cuid())
  userId              String
  articleId           String
  amount              Int
  status              String   // e.g. "completed", "pending"
  stripeSessionId     String   @unique
  stripePaymentIntent String?
  createdAt           DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id])
  article Article @relation(fields: [articleId], references: [id])

  @@unique([userId, articleId])
}
```

---

<a id="ops"></a>

## 📈 監視 / ログ

- pm2: `pm2 status`, `pm2 logs postnest --lines 100`
- CloudWatch Logs に pm2 ログを集約 or S3 で世代管理
<!-- 未実装のヘルスチェック/エラートラッキング記述は削除 -->

---

<a id="cicd"></a>

## 🔄 CI/CD（GitHub Actions 例）

### CI（PR / main）

- pnpm セットアップ → 依存関係インストール
- Lint / 型チェック / ビルド（必要ならユニットテスト）
- 成果物のキャッシュ（node_modules/pnpm）

```yaml
name: CI
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm -s lint || true # ルールに合わせて調整
      - run: pnpm -s typecheck || true
      - run: pnpm -s build
```

### CD（デプロイ方針）

- RDS マイグレーション: `pnpm prisma migrate deploy` をメンテナンス環境で実行
- EC2 へは SSH で pull → install → build → pm2 restart

```yaml
# 例: appleboy/ssh-action を用いた簡易デプロイ
- name: Deploy to EC2
  uses: appleboy/ssh-action@v1.0.3
  with:
    host: ${{ secrets.EC2_HOST }}
    username: ubuntu
    key: ${{ secrets.EC2_SSH_KEY }}
    script: |
      set -e
      cd ~/PostNest
      git pull origin main
      pnpm install --frozen-lockfile
      pnpm build
      pm2 restart postnest || pm2 start pnpm --name postnest -- start
```

---

<a id="nginx"></a>

## 🌐 Nginx 設定（EC2）

```nginx
# HTTPS（443、自署証明書）
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name ec2-57-181-61-159.ap-northeast-1.compute.amazonaws.com;

    ssl_certificate     /etc/ssl/certs/postnest-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/postnest-selfsigned.key;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host              $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host  $host;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP         $remote_addr;

        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";
    }
}
```

### ドメイン無しでの HTTPS（自己署名証明書）

検証用途として、EC2 の公開 DNS に対して自己署名証明書で 443 を有効化しています（ブラウザには警告が表示されます）。

1. 自己署名証明書の作成（SAN に EC2 公開 DNS を指定）

```bash
EC2_HOST=ec2-57-181-61-159.ap-northeast-1.compute.amazonaws.com
sudo install -d -m 700 /etc/ssl/private
sudo install -d -m 755 /etc/ssl/certs

sudo openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
  -keyout /etc/ssl/private/postnest-selfsigned.key \
  -out /etc/ssl/certs/postnest-selfsigned.crt \
  -subj "/CN=$EC2_HOST" \
  -addext "subjectAltName=DNS:$EC2_HOST"

sudo chown root:root /etc/ssl/private/postnest-selfsigned.key /etc/ssl/certs/postnest-selfsigned.crt
sudo chmod 600 /etc/ssl/private/postnest-selfsigned.key
sudo chmod 644 /etc/ssl/certs/postnest-selfsigned.crt
```

2. Nginx は上記の 443 ブロックを使用（ファイル配置は環境に合わせて）

3. 構文チェックと反映

```bash
sudo nginx -t && sudo systemctl reload nginx
```

4. 動作確認（自己署名のため `-k` で検証回避）

```bash
curl -k https://ec2-57-181-61-159.ap-northeast-1.compute.amazonaws.com/
```

---

<a id="screens"></a>

## 🖼 スクリーンショット / デモ（準備中）

- トップページ / 記事詳細（未購読/購読済み）
- 管理画面 / ダッシュボード
- 決済フロー（Checkout → 完了）

#### 主要画面（静止画）

![01 トップページ（デスクトップ）](/screenshots/homepage.png)
![02 記事一覧（有料表示あり）](/screenshots/articlelist.png)

<!-- ![03 記事詳細（無料記事）](/screenshots/03-article-free-desktop.png) -->

![04 記事詳細（有料・ロック状態）](/screenshots/premium.png)
![05 記事詳細（購読済み解禁）](/screenshots/stripe2.png)
![06 記事作成フォーム](/screenshots/newarticle.png)

<!-- ![07 記事編集フォーム](/screenshots/07-article-edit-desktop.png) -->

![08 ダッシュボード（投稿一覧）](/screenshots/dashboard.png)

<!-- ![09 ダッシュボード（購読履歴・統計）](/screenshots/09-dashboard-subscriptions-desktop.png) -->

![10 管理者トップ](/screenshots/admin.png)

<!-- ![11 管理：ユーザー管理](/screenshots/11-admin-users-desktop.png) -->

![12 管理：記事管理](/screenshots/12-admin-articles-desktop.png)
![13 サインイン](/screenshots/signin.png)

<!-- ![14 404 ページ](/screenshots/14-not-found-desktop.png) -->
<!-- ![15 モバイルメニュー（テーマ切替）](/screenshots/15-mobile-menu-theme-toggle-mobile.png) -->

#### テーマ比較

![トップ（ライト）](/screenshots/homepage.png)
![トップ（ダーク）](/screenshots/dark.png)

#### GIF / MP4（動作）

<!-- ![G1 テーマ切替（モバイル）](/screenshots/g1-theme-toggle-mobile.gif) -->

<video src="/screenshots/g2-checkout-flow.mp4" controls width="800">Checkout フロー</video>

<!-- ![G3 記事作成フロー](/screenshots/g3-create-article.gif) -->

---

<!-- 旧: 簡易図は全体像に統合 -->

## 🗄️ DB バックアップ / リストア（整理）

### 開発向け（簡易バックアップ）

```bash
# Backup（環境に合わせて接続情報を指定）
pg_dump --format=c --no-acl --no-owner "$DATABASE_URL" > backup.dump

# Restore（先に空DBを用意し、同一スキーマで）
pg_restore --clean --no-acl --no-owner -d "$DATABASE_URL" backup.dump
```

### 本番向け（運用）

- RDS の自動スナップショット（リテンション設定）を有効化
- 重要メンテ直前に手動スナップショットを取得
- 追加で `pg_dump` を cron で日次取得し、バケットへ世代管理

> デプロイ方針の「本番運用ベストプラクティス」からも本節を参照するよう追記済みです。

---

## 🚀 Performance / Optimization（強化）

- App Router サーバーコンポーネントでデータ取得を集約 → 不要なクライアントフェッチ削減
- Prisma `select` で必要最小限のフィールド取得
- 静的配信/キャッシュ
  - SSG（Static Site Generation）で記事一覧等をキャッシュ

---

## 🧪 テスト戦略（観点）

- Stripe Webhook
  - 正常系（checkout.session.completed）
  - 署名不一致（400 応答）
  - 二重通知（`upsert` で重複作成を防止）
  - キャンセル/未決済（DB 反映しない）
- 認証/認可
  - 無効ユーザー（DISABLED）の拒否
  - 権限外操作（他者記事の編集/削除）
- セキュリティ
  - CSRF（Origin/Host 不一致の 403）
  - XSS（DOMPurify サニタイズで危険タグ除去）

### 実装ツール（例）

- ユニット: Jest + ts-jest（関数・API ハンドラのロジック）
- E2E: Playwright（ログイン → 記事作成 →Checkout→ 解禁）
- Contract: JSON Schema による API 応答検証

> 実例は `__tests__/` にサンプルを配置予定（`checkout.e2e.example.ts` など）。

---

## 📈 監視 / ログ（仕上げ）

- pm2: `pm2 status`, `pm2 logs postnest --lines 100`
- CloudWatch Logs に pm2 ログを集約 or S3 で世代管理
- ヘルスチェック: `/api/health` を設置し DB 接続も確認（将来）
- エラートラッキング: Sentry 等の導入を検討（将来）
