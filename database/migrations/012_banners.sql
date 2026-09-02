-- 012 banners
create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text not null,
  button_text text,
  button_link text,
  display_order int default 0,
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz default now()
);
alter table public.banners enable row level security;
