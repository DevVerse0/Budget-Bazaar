-- 011 campaigns
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'flash_sale',
  banner_url text,
  start_date timestamptz not null,
  end_date timestamptz not null,
  discount_rules jsonb default '{}',
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz default now()
);
create table if not exists public.campaign_products (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  campaign_price numeric(10,2),
  unique(campaign_id, product_id)
);
alter table public.campaigns enable row level security;
