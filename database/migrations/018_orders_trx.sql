-- 018 orders trx_id for bkash/nagad
alter table public.orders add column if not exists trx_id text;
