-- 004 product_images
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  display_order int default 0,
  created_at timestamptz default now()
);
alter table public.product_images enable row level security;
