-- 014 settings
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value jsonb not null,
  updated_at timestamptz default now()
);
alter table public.settings enable row level security;
insert into public.settings (setting_key, setting_value) values
  ('branding', '{"siteName":"Budget Bazar","tagline":"Best Gadgets, Best Prices"}'::jsonb),
  ('delivery', '{"insideCity":60,"outsideCity":120}'::jsonb),
  ('payment_methods', '{"cod":true,"bkash":false}'::jsonb)
on conflict (setting_key) do nothing;
