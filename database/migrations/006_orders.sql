-- 006 orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  mobile text not null,
  alternative_mobile text,
  division text,
  district text not null,
  area text,
  full_address text not null,
  notes text,
  subtotal numeric(10,2) not null,
  delivery_charge numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  coupon_code text,
  total numeric(10,2) not null,
  payment_method text not null default 'cod' check (payment_method in ('cod','bkash','nagad','rocket','card')),
  status text not null default 'pending' check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.orders enable row level security;
