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

## 🎛 UX の工夫（ユーザー視点）

- 未購読時は本文を明確にマスクし、すぐ横に購入導線（価格・説明・ボタン）を配置
- ダッシュボードはカードレイアウトで「投稿一覧」「購読履歴」「統計」を一目で把握
- モバイルでも操作しやすいようにナビゲーションを最適化（ハンバーガー内にテーマ切替）

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

## 🧾 使用言語まとめ

- TypeScript/TSX: Next.js(App Router), React コンポーネント, API Route Handlers, 認証/ユーティリティ
- SQL/DDL(Prisma): `schema.prisma` によるモデル定義と `migrations` によるスキーマ差分の適用（PostgreSQL）
- CSS(Tailwind): ユーティリティクラス中心のスタイリング（`globals.css` / 各コンポーネント）
- YAML: `docker-compose.yml` による開発用 DB の起動
- JSON: `package.json` ほか設定・データ
- Shell/CLI: Stripe CLI, pm2, Git/Node/pnpm の運用コマンド

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

ローカル実行の例:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postnest?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret"
GOOGLE_ID=... GOOGLE_SECRET=...
GITHUB_ID=...  GITHUB_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...(任意)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
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

### 6.（任意）Stripe Webhook（ローカル）

Stripe CLI を利用してイベント転送と署名検証を設定します。

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
# 表示された Signing secret を STRIPE_WEBHOOK_SECRET に設定
```

### 動作確認ポイント

- 未購読ユーザーは有料記事の本文がマスクされる
- 購読完了後（Checkout 成功）に本文が解禁される
- 記事の作成/編集/削除はログイン済みの著者（または管理者）のみ可能

---

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

## 👤 役割と権限

| 機能                    | Admin | User                | DISABLED |
| ----------------------- | ----- | ------------------- | -------- |
| 記事閲覧（無料）        | ○     | ○                   | ×        |
| 記事閲覧（有料/購読済） | ○     | ○                   | ×        |
| 記事作成/編集/削除      | ○     | ○（自分の投稿のみ） | ×        |
| 管理画面アクセス        | ○     | ×                   | ×        |
| ユーザー権限変更        | ○     | ×                   | ×        |

---

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
- 決済/購読
  - `POST /api/checkout`（認証、Checkout セッション作成）
  - `POST /api/stripe/webhook`（署名検証）
  - `POST /api/subscriptions/confirm`（認証＋ユーザー一致検証）
- 管理
  - `GET /api/admin/users`（Admin）
  - `PATCH /api/admin/users/[id]`（Admin）

---

## 🔁 Webhook と購読反映の流れ

- Checkout セッション作成時に `metadata` として `{ userId, articleId }` を付与（`/api/checkout`）
- Stripe は `checkout.session.completed` を `/api/stripe/webhook` に通知
  - 署名は raw body を用いて検証（`STRIPE_WEBHOOK_SECRET`）
- 通知受信後、Prisma の Subscription モデルに購読を反映（`upsert`）
  - 複合一意キー `userId_articleId` で冪等化（再通知・重複を無視）
  - `amount`, `status`, `stripeSessionId`, `stripePaymentIntentId` を保存（監査/重複判定に活用）

参考実装: `src/app/api/stripe/webhook/route.ts`

---

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
  }
  Article {
    string id PK
    string authorId FK
    boolean isPremium
    int price
  }
  Subscription {
    string id PK
    string userId FK
    string articleId FK
    string status
    int amount
  }
```

---

## 🗄️ DB バックアップ / リストア（例）

```bash
# Backup（環境に合わせて接続情報を指定）
pg_dump --format=c --no-acl --no-owner "$DATABASE_URL" > backup.dump

# Restore（先に空DBを用意し、同一スキーマで）
pg_restore --clean --no-acl --no-owner -d "$DATABASE_URL" backup.dump
```

---

## 💳 Stripe テスト情報（例）

- テストカード: `4242 4242 4242 4242` / 01/33 / 123 / 任意名
- Webhook: 署名シークレットを `STRIPE_WEBHOOK_SECRET` に設定し、raw body を破壊しないプロキシ設定にする
- 失敗検証: 購入キャンセル、署名不一致、未購読時の本文マスクを確認

---

## 🧰 トラブルシューティング

- Prisma の接続/マイグレーション
  - `DATABASE_URL` を再確認、`pnpm prisma migrate deploy|dev` を実行
- Webhook 署名失敗
  - 署名シークレット誤り/ボディ改変（圧縮/再エンコード）を確認
- CSRF の 403
  - `Origin/Host` が一致しているか。フロントと API のホスト/プロトコルを揃える
- 3000 番ポートが外から見えない
  - 本番は 80/443 経由（Nginx）。検証時の 3000 開放は一時的に

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

---

## 📈 監視 / ログ

- pm2: `pm2 status`, `pm2 logs postnest --lines 100`
- 監視推奨メトリクス
  - 5xx エラーレート、Webhook 失敗数、Checkout 失敗数
  - DB 接続数、レスポンスタイム（p95）
- バックアップ: `pg_dump` を cron（日次）で取得し世代管理
- ログローテーション: pm2 logs を CloudWatch/S3 へ集約 or `logrotate` でローテーション

---

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

## 🌐 Nginx リバースプロキシ（例）

### HTTP → HTTPS リダイレクト
```nginx
server {
  listen 80;
  server_name your-domain.example;
  return 301 https://$host$request_uri;
}
```

### HTTPS + Node(3000) へのプロキシ
```nginx
server {
  listen 443 ssl http2;
  server_name your-domain.example;

  ssl_certificate     /etc/letsencrypt/live/your-domain/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/your-domain/privkey.pem;

  # アップロード/Webhook 向けに適度なサイズ
  client_max_body_size 10m;

  # 共通ヘッダ
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
  }

  # Stripe Webhook（raw body を改変しない。デフォルトでボディ変換は行われない）
  location /api/stripe/webhook {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
  }
}
```

> 注意: gzip などボディを再エンコードする設定を入れないでください（Webhook 署名検証に失敗します）。

---

## 🔐 Secrets 管理（例）

### GitHub Actions での Secrets
- `Settings > Secrets and variables > Actions` に `EC2_HOST`, `EC2_SSH_KEY`, `STRIPE_SECRET_KEY` などを登録
- デプロイ時は上記を参照

### AWS SSM Parameter Store / Secrets Manager の利用
- アプリ実行時に `.env` を生成する例（Parameter Store）:
```bash
aws ssm get-parameter \
  --name "/postnest/prod/DATABASE_URL" \
  --with-decryption \
  --query Parameter.Value \
  --output text >> .env
```

- systemd での環境読み込み例:
```ini
[Service]
EnvironmentFile=/home/ubuntu/PostNest/.env
ExecStart=/usr/bin/pm2 start pnpm --name postnest -- start
Restart=always
```

- Node 起動前に `export $(grep -v '^#' .env | xargs)` で環境変数を注入可能（セキュリティに注意）

---

## 🖼 スクリーンショット / デモ（任意）

- トップページ / 記事詳細（未購読/購読済み）
- 管理画面 / ダッシュボード
- 決済フロー（Checkout → 完了）

### 画像プレースホルダ（後で差し替え）

> 画像は `public/screenshots/` に配置してください（例: `public/screenshots/01-home-desktop.png`）。

#### 主要画面（静止画）

![01 トップページ（デスクトップ）](/screenshots/01-home-desktop.png)
![02 記事一覧（有料表示あり）](/screenshots/02-articles-list-desktop.png)
![03 記事詳細（無料記事）](/screenshots/03-article-free-desktop.png)
![04 記事詳細（有料・ロック状態）](/screenshots/04-article-locked-desktop.png)
![05 記事詳細（購読済み解禁）](/screenshots/05-article-unlocked-desktop.png)
![06 記事作成フォーム](/screenshots/06-article-new-desktop.png)
![07 記事編集フォーム](/screenshots/07-article-edit-desktop.png)
![08 ダッシュボード（投稿一覧）](/screenshots/08-dashboard-articles-desktop.png)
![09 ダッシュボード（購読履歴・統計）](/screenshots/09-dashboard-subscriptions-desktop.png)
![10 管理者トップ](/screenshots/10-admin-home-desktop.png)
![11 管理：ユーザー管理](/screenshots/11-admin-users-desktop.png)
![12 管理：記事管理](/screenshots/12-admin-articles-desktop.png)
![13 サインイン](/screenshots/13-auth-signin-desktop.png)
![14 404 ページ](/screenshots/14-not-found-desktop.png)
![15 モバイルメニュー（テーマ切替）](/screenshots/15-mobile-menu-theme-toggle-mobile.png)

#### テーマ比較（任意）

![トップ（ライト）](/screenshots/01-home-desktop-light.png)
![トップ（ダーク）](/screenshots/01-home-desktop-dark.png)

#### GIF / MP4（動作）

![G1 テーマ切替（モバイル）](/screenshots/g1-theme-toggle-mobile.gif)

<video src="/screenshots/g2-checkout-flow.mp4" controls width="800">Checkout フロー</video>

![G3 記事作成フロー](/screenshots/g3-create-article.gif)
