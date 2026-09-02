import { createClient } from '@supabase/supabase-js';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !anon) console.warn('Missing NEXT_PUBLIC_SUPABASE_URL / ANON_KEY - check frontend/.env.local');
export const supabase = createClient(url || 'https://placeholder.supabase.co', anon || 'placeholder');
