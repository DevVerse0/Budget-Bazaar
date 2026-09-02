-- 009 reviews
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  review_text text,
  status text not null default 'pending' check (status in ('pending','approved','hidden')),
  created_at timestamptz default now()
);
alter table public.reviews enable row level security;
