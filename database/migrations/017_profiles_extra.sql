-- 017 profiles extra columns + RLS for account page
alter table public.profiles add column if not exists district text;
alter table public.profiles add column if not exists upazila text;
alter table public.profiles add column if not exists full_address text;
alter table public.profiles add column if not exists avatar_url text;

-- RLS policies for self access (if not exists)
do $$ begin
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='profiles self read') then
    create policy "profiles self read" on public.profiles for select using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='profiles self update') then
    create policy "profiles self update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='profiles self insert') then
    create policy "profiles self insert" on public.profiles for insert with check (auth.uid() = id);
  end if;
end $$;

-- Storage bucket for avatars
insert into storage.buckets (id, name, public) values ('avatars','avatars',true) on conflict (id) do nothing;
-- storage policies for avatars (public read, authenticated write)
do $$ begin
  if not exists (select 1 from pg_policies where tablename='objects' and policyname='avatars public read') then
    create policy "avatars public read" on storage.objects for select using (bucket_id='avatars');
  end if;
  if not exists (select 1 from pg_policies where tablename='objects' and policyname='avatars upload') then
    create policy "avatars upload" on storage.objects for insert with check (bucket_id='avatars' and auth.role()='authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename='objects' and policyname='avatars update') then
    create policy "avatars update" on storage.objects for update using (bucket_id='avatars' and auth.role()='authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename='objects' and policyname='avatars delete') then
    create policy "avatars delete" on storage.objects for delete using (bucket_id='avatars' and auth.role()='authenticated');
  end if;
end $$;
