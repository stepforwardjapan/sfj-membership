# SFJ Membership

一般社団法人ステップフォワードジャパン（SFJ）の会員（挑戦サポーター）管理システム。

## 概要

- **目的**: Stripe Payment Linkで決済された会員情報をDB化し、管理画面で一元管理する
- **フェーズ**: MVP（管理画面のみ）
- **将来拡張**: LP・サポーター本人用マイページ・自動メール送信

## アーキテクチャ

```
[Stripe Payment Link] ──Webhook──→ [Next.js API] ──→ [Supabase: members]
                                                              ↓
                                                     [管理画面 /admin]
```

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フレームワーク | Next.js 16 (App Router, TypeScript) |
| UI | Tailwind CSS v4 |
| DB / 認証 | Supabase |
| 決済 | Stripe Payment Link + Webhook |
| ホスティング | Vercel（NIBASHO アカウント） |

## セットアップ

### 1. 依存パッケージのインストール

```bash
pnpm install
```

### 2. 環境変数の設定

`.env.local.example` を `.env.local` にコピーして値を埋める。

```bash
cp .env.local.example .env.local
```

必要な値:
- **Supabase**: プロジェクト作成後、Settings > API から取得
- **Stripe**: Dashboard > Developers > API keys / Webhook signing secret

### 3. Supabaseマイグレーション実行

Supabaseダッシュボードの SQL Editor で `supabase/migrations/001_create_members.sql` の内容を実行。

### 4. Stripe Webhookの設定

Stripe Dashboard > Developers > Webhooks > Add endpoint:

- URL: `https://your-domain.vercel.app/api/stripe/webhook`
- イベント:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

作成後、Signing secret を `STRIPE_WEBHOOK_SECRET` に設定。

### 5. 既存Stripe顧客の取り込み（初回のみ）

```bash
pnpm import:stripe
```

### 6. 管理画面の理事ユーザー招待

Supabase Dashboard > Authentication > Users から理事5名のメールアドレスを招待。
ユーザーは届いたマジックリンクからログイン。

### 7. ローカル起動

```bash
pnpm dev
```

→ http://localhost:3000

## ディレクトリ構成

```
sfj-membership/
├── docs/                          # 設計ドキュメント（要件・仕様）
├── scripts/
│   └── import-stripe-customers.ts # 既存Stripe顧客の一括取り込み
├── src/
│   ├── app/
│   │   ├── page.tsx               # トップ
│   │   ├── admin/
│   │   │   ├── page.tsx           # 会員一覧
│   │   │   ├── login/page.tsx     # ログイン（マジックリンク）
│   │   │   ├── logout/route.ts
│   │   │   └── members/[id]/page.tsx  # 会員詳細
│   │   └── api/stripe/webhook/route.ts # Stripe Webhook受信
│   ├── lib/
│   │   ├── supabase-server.ts     # Server Component用クライアント
│   │   ├── supabase-admin.ts      # service_roleクライアント（Webhook用）
│   │   ├── stripe.ts              # Stripeクライアント
│   │   └── types.ts
│   └── middleware.ts              # /admin配下の認証ガード
└── supabase/
    └── migrations/
        └── 001_create_members.sql
```

## デプロイ

Vercelに接続して以下を設定:
- 環境変数（`.env.local` と同じ）
- Production Branch: `main`

## ライセンス

Private
