-- 010 coupons
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percentage','fixed')),
  discount_value numeric(10,2) not null,
  minimum_order numeric(10,2) default 0,
  maximum_discount numeric(10,2),
  start_date timestamptz,
  expiry_date timestamptz,
  usage_limit int,
  used_count int default 0,
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz default now()
);
alter table public.coupons enable row level security;
