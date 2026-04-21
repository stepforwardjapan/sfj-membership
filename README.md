# SFJ Membership

一般社団法人ステップフォワードジャパン（SFJ）の会員（挑戦サポーター）管理システム。

## 概要

- **目的**: Square 支払いリンクで決済された会員情報をDB化し、管理画面で一元管理する
- **フェーズ**: MVP（管理画面のみ）
- **将来拡張**: LP・サポーター本人用マイページ・自動メール送信・更新リマインド

## アーキテクチャ

```
[Square 支払いリンク] ──Webhook(payment.created)──→ [Next.js API] ──→ [Supabase: members]
                                                                              ↓
                                                                     [管理画面 /admin]
```

支払いは **単発決済の年次再発行モデル**。
- `last_paid_at` = 最終決済日
- `expires_at` = 最終決済日 + 1年
- `status` = active（期限内）/ expired（期限切れ）/ cancelled

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フレームワーク | Next.js 16 (App Router, TypeScript) |
| UI | Tailwind CSS v4 |
| DB / 認証 | Supabase |
| 決済 | Square 支払いリンク + Webhook |
| ホスティング | Vercel（SFJ アカウント） |

## セットアップ

### 1. 依存パッケージのインストール

```bash
pnpm install
```

### 2. 環境変数の設定

```bash
cp .env.local.example .env.local
```

必要な値:
- **Supabase**: プロジェクト作成後、Settings > API から取得
- **Square**: Developer Dashboard > Applications > 該当アプリ > Credentials から取得

### 3. Supabaseマイグレーション実行

Supabaseダッシュボードの SQL Editor で以下を順に実行:
1. `supabase/migrations/001_create_members.sql`（旧Stripe版・実行済みなら飛ばしてOK）
2. `supabase/migrations/002_switch_to_square.sql`（Square用に作り直し）

### 4. 既存Square顧客の取り込み

```bash
pnpm import:square
```

### 5. Square Webhook の設定（Vercelデプロイ後）

Square Developer Dashboard > Webhook subscriptions:

- **URL**: `https://<your-domain>.vercel.app/api/square/webhook`
- **Events**:
  - `payment.created`
  - `payment.updated`

作成後、Signature Key を `SQUARE_WEBHOOK_SIGNATURE_KEY` に設定。
URL を `SQUARE_WEBHOOK_URL` にも設定（署名検証用）。

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
│   └── import-square-customers.ts # 既存Square顧客の一括取り込み
├── src/
│   ├── app/
│   │   ├── page.tsx               # トップ
│   │   ├── admin/
│   │   │   ├── page.tsx           # 会員一覧
│   │   │   ├── login/page.tsx     # ログイン（マジックリンク）
│   │   │   ├── logout/route.ts
│   │   │   └── members/[id]/page.tsx  # 会員詳細
│   │   └── api/square/webhook/route.ts # Square Webhook受信
│   ├── lib/
│   │   ├── supabase-server.ts     # Server Component用クライアント
│   │   ├── supabase-admin.ts      # service_roleクライアント（Webhook用）
│   │   ├── square.ts              # Squareクライアント・署名検証
│   │   └── types.ts
│   └── middleware.ts              # /admin配下の認証ガード
└── supabase/
    └── migrations/
        ├── 001_create_members.sql        # 初期版（Stripe前提・廃止）
        └── 002_switch_to_square.sql      # Square版
```

## デプロイ

Vercelに接続して以下を設定:
- 環境変数（`.env.local` と同じ）
- Production Branch: `main`

## ライセンス

Private
