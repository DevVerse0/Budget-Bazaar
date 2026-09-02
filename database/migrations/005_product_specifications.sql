-- 005 spec definitions + values
create table if not exists public.specification_definitions (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  field_type text not null default 'text' check (field_type in ('text','number','select','boolean')),
  options text[] default null,
  filterable boolean default true,
  display_order int default 0,
  created_at timestamptz default now()
);
create table if not exists public.product_specifications (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  specification_definition_id uuid not null references public.specification_definitions(id) on delete cascade,
  value text not null,
  created_at timestamptz default now(),
  unique(product_id, specification_definition_id)
);
alter table public.specification_definitions enable row level security;
alter table public.product_specifications enable row level security;
