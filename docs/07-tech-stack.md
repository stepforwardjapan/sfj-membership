# 07. 技術選定・基盤

## 全体構成（候補）
```
[LP / 公式サイト]   : Next.js (App Router) / Vercel
[会員マイページ]     : Next.js / Supabase Auth
[管理画面]           : Next.js（同一アプリ内の /admin パス）
[DB]                : Supabase (PostgreSQL)
[決済]              : Stripe（現行: Payment Link → 移行先: Checkout + Billing + Webhooks）
[メール]            : Resend（候補）
[ホスティング]       : Vercel
[ドメイン]           : step-forward-japan.jp（既存）
```

## 判断ポイント
| 項目 | 状況 |
|---|---|
| 運営人数（開発者数） | 0名（理事5名は非エンジニア。Claude等のAI開発前提） |
| 想定会員数 | 初期50〜100名、中期300名程度 |
| 内製 vs SaaS | できるだけSaaS活用（Stripe / Supabase）で運用負荷を最小化 |
| ランニングコスト | 月額1〜2万円以内が望ましい |

## 既に使っている社内基盤
| サービス | 用途 | アカウント |
|---|---|---|
| Google Workspace | メール・ドライブ | info@step-forward-japan.jp |
| Notion | アカウント情報管理 | info@アカウント |
| Slack（無料） | 内部連絡 | ファイル消失問題あり |
| Facebook | コミュニティ運営 | グループ |
| Peatix | イベント集客 | |
| Spotify for Creators | Podcast配信 | |
| CAMPFIRE | クラファン（完了） | |
| **Stripe** | **サポーター決済（Payment Link運用中）** | **Webhook未連携、手動管理** |

## コスト見積もり（月額）
| サービス | プラン | 月額（税別） |
|---|---|---|
| Vercel | Pro | $20 |
| Supabase | Pro | $25 |
| Stripe | 従量課金のみ | 3.6%/決済 |
| Resend | Free → Pro | $0〜$20 |
| ドメイン | 既存 | 0 |
| **合計** | | **約$45〜65/月（≒7,000〜10,000円）** |

## 環境
| 環境 | 用途 | 備考 |
|---|---|---|
| 本番 | step-forward-japan.jp | Vercel Production |
| プレビュー | PRごとに自動生成 | Vercel Preview |
| ローカル | 開発 | supabase local dev |

## CI/CD
- GitHub → Vercel自動デプロイ
- main ブランチ = 本番
- PR作成 = プレビュー環境自動生成

## 監視・ログ
| 項目 | ツール |
|---|---|
| エラー監視 | Sentry（Free tier） |
| デプロイログ | Vercel Logs |
| DB監視 | Supabase Dashboard |
| 決済イベント | Stripe Dashboard + Webhookログ |
| 外形監視 | TODO（UptimeRobot等） |

## セキュリティ
| 項目 | 対策 |
|---|---|
| 環境変数 | Vercel Environment Variables |
| DB権限 | Supabase RLS（Row Level Security） |
| 管理画面アクセス | Supabase Auth + ロールベース制御 |
| 管理画面のIP制限 | TODO: Vercel Edge Middleware or Supabase RLS |
| MFA | TODO: 理事アカウントにMFA導入検討 |
| 決済データ | Stripe側で管理（PCI DSS準拠）、自前DBにカード情報を保持しない |

## 公式サイトとの関係
- 現行サイト（step-forward-japan.jp）: 2026年4月15日にリニューアル済み
- ナビゲーション: SFJについて / 活動内容 / 活動報告 / ニュース / お問い合わせ / 応援する
- 「応援する」ボタン → 現在はGoogle Formsへ遷移 → これを新ツールの登録フォームに差し替える
- サイト内に会員制度のページは **まだない**（新規作成が必要）
