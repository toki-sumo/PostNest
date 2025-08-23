# Architecture

## システム構成図

```mermaid
flowchart LR
  subgraph Client[Browser]
    UI[Next.js UI]
  end

  subgraph App[Next.js App (App Router)]
    API[/Route Handlers/]
    PRISMA[Prisma]
  end

  DB[(PostgreSQL / AWS RDS)]
  STRIPE[Stripe Checkout]
  WEBHOOK[/Stripe Webhook/]

  UI --> API
  API --> PRISMA --> DB
  UI --> STRIPE
  STRIPE --> WEBHOOK --> API
```

## Webhook シーケンス（Checkout → DB 反映）

```mermaid
sequenceDiagram
  participant U as User
  participant FE as Next.js (UI)
  participant API as API (/api/checkout)
  participant S as Stripe
  participant WH as Webhook (/api/stripe/webhook)
  participant DB as PostgreSQL (RDS)

  U->>FE: 購読ボタン押下（記事ID）
  FE->>API: Checkout セッション作成（metadata: {userId, articleId})
  API->>S: セッション発行
  S-->>FE: セッションURL
  FE->>S: Checkout 決済
  S-->>WH: checkout.session.completed
  WH->>WH: 署名検証 (raw body)
  WH->>DB: Subscription upsert (userId, articleId, amount, status, stripeSessionId)
  WH-->>FE: 200 OK（フロントは再取得で解禁を反映）
```
