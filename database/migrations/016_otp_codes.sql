-- 016 otp_codes for email verification via code (not link)
create table if not exists public.otp_codes (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code text not null,
  type text not null default 'signup' check (type in ('signup','reset')),
  expires_at timestamptz not null,
  used boolean default false,
  created_at timestamptz default now()
);
create index idx_otp_email_code on public.otp_codes(email, code);
alter table public.otp_codes enable row level security;
create policy "Allow service OTP" on public.otp_codes for all using (true) with check (true);
