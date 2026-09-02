-- 013 notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'info',
  is_read boolean default false,
  created_at timestamptz default now()
);
alter table public.notifications enable row level security;
