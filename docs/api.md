# API ドキュメント（抜粋）

## Articles

- POST /api/articles（認証）

  - Body
    ```json
    {
      "title": "サンプル記事",
      "content": "<p>本文</p>",
      "price": 500,
      "tags": ["macro", "equity"]
    }
    ```
  - Response 201
    ```json
    { "id": "art_123", "title": "サンプル記事" }
    ```

- GET /api/articles（公開）
- GET /api/articles/[id]（公開。ただしプレミアム本文は未購読時に返さない）

## Auth

- POST /api/auth/signup
- POST /api/auth/[...nextauth]

## Webhook

- POST /api/stripe/webhook（署名検証, raw body）

> 詳細はソースの Route Handlers と本ファイルを随時参照してください。
