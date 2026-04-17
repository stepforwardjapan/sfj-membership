-- 会員（挑戦サポーター）テーブル
create table if not exists members (
  id uuid primary key default gen_random_uuid(),

  -- 基本情報
  email text not null unique,
  name text,
  name_kana text,
  organization text,
  phone text,
  display_name text,

  -- Stripe連携
  stripe_customer_id text unique,
  stripe_subscription_id text unique,

  -- ステータス
  status text not null default 'active' check (status in ('active', 'past_due', 'cancelled', 'incomplete')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at timestamptz,

  -- 運営用
  notes text,
  invited_by text,

  -- メタ
  registered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists members_email_idx on members(email);
create index if not exists members_status_idx on members(status);
create index if not exists members_stripe_customer_idx on members(stripe_customer_id);

-- updated_at自動更新
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_members_updated_at on members;
create trigger update_members_updated_at
  before update on members
  for each row
  execute function update_updated_at_column();

-- Stripe Webhookイベントログ（冪等性確保＆デバッグ用）
create table if not exists stripe_events (
  id text primary key,
  type text not null,
  payload jsonb not null,
  processed_at timestamptz not null default now()
);

create index if not exists stripe_events_type_idx on stripe_events(type);

-- RLS（Row Level Security）
alter table members enable row level security;
alter table stripe_events enable row level security;

-- 認証済みユーザー（理事）のみ全件閲覧可能
-- ※ 認証ユーザー = Supabase Authでログイン済み
create policy "Authenticated users can read members"
  on members for select
  to authenticated
  using (true);

create policy "Authenticated users can update members"
  on members for update
  to authenticated
  using (true);

-- service_roleキー経由（Webhook等）のフルアクセスは自動的に許可される
