-- 003 products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  brand text,
  category_id uuid references public.categories(id) on delete set null,
  short_description text,
  description text,
  regular_price numeric(10,2) not null check (regular_price >= 0),
  sale_price numeric(10,2) check (sale_price >= 0),
  stock_quantity int not null default 0 check (stock_quantity >= 0),
  low_stock_threshold int default 5,
  sku text unique,
  status text not null default 'active' check (status in ('active','hidden','out_of_stock')),
  featured boolean default false,
  trending boolean default false,
  is_new_arrival boolean default false,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.products enable row level security;
