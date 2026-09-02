-- 001 profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  mobile text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;
create index idx_profiles_role on public.profiles(role);
