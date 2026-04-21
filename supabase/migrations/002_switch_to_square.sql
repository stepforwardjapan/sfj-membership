-- Stripe→Square 切替のため、テーブルを再作成
-- (既存データが0件のため、DROP→CREATEで対応)

drop table if exists stripe_events cascade;
drop table if exists members cascade;

-- ─────────────────────────────────────────────
-- 会員（挑戦サポーター）テーブル
-- ─────────────────────────────────────────────
create table members (
  id uuid primary key default gen_random_uuid(),

  -- 基本情報
  email text not null unique,
  name text,
  name_kana text,
  organization text,
  phone text,
  display_name text,

  -- Square連携
  square_customer_id text unique,
  last_square_payment_id text,

  -- ステータス（単発決済 + 期限管理）
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  registered_at timestamptz not null default now(),  -- 初回入会日
  last_paid_at timestamptz,                          -- 最終決済日
  expires_at timestamptz,                            -- 有効期限（last_paid_at + 1年）

  -- 運営用
  notes text,
  invited_by text,

  -- メタ
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index members_email_idx on members(email);
create index members_status_idx on members(status);
create index members_square_customer_idx on members(square_customer_id);
create index members_expires_at_idx on members(expires_at);

-- updated_at自動更新
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_members_updated_at
  before update on members
  for each row
  execute function update_updated_at_column();

-- ─────────────────────────────────────────────
-- Square Webhook イベントログ（冪等性確保＆デバッグ用）
-- ─────────────────────────────────────────────
create table square_events (
  id text primary key,           -- Square event_id
  type text not null,            -- payment.created など
  payload jsonb not null,
  processed_at timestamptz not null default now()
);

create index square_events_type_idx on square_events(type);

-- ─────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────
alter table members enable row level security;
alter table square_events enable row level security;

create policy "Authenticated users can read members"
  on members for select
  to authenticated
  using (true);

create policy "Authenticated users can update members"
  on members for update
  to authenticated
  using (true);
