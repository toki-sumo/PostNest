# デプロイガイド（概要）

本詳細は README の概要を補完します。具体的な OS/バージョンに応じて適宜読み替えてください。

## 本番アーキテクチャ

- Web/App: AWS EC2（Node/Next.js, pm2 常駐）
- DB: AWS RDS for PostgreSQL
- 決済: Stripe（Checkout + Webhook）
- 逆プロキシ: Nginx（80/443, HTTPS 終端）

> 図: `docs/infra.png`（EC2 ↔ RDS ↔ Stripe）

## セットアップ要点

1. EC2 構築とセキュリティグループ
   - 80/443 公開、22 は管理者の IP のみ
2. Node/pnpm 導入、リポジトリ取得
3. `.env` 設定（NEXTAUTH_URL は https）
4. `pnpm build && pnpm start`（pm2 で常駐化）
5. Nginx の 80/443 設定（Let’s Encrypt もしくは自己署名）
6. Stripe Webhook を `/api/stripe/webhook` に登録

## 運用

- マイグレーション: `pnpm prisma migrate deploy`
- ログ: `pm2 logs`, CloudWatch/S3 集約
- バックアップ: RDS スナップショット + `pg_dump` 世代管理

> 具体手順は本ファイルと README の両方を参照してください。
