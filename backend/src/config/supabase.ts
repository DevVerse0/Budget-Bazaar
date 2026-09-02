import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';
export const supabaseAnon = createClient(env.supabaseUrl, env.supabaseAnonKey);
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);
