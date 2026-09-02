import 'dotenv/config';
export const env = {
  port: parseInt(process.env.PORT || '5000',10),
  nodeEnv: process.env.NODE_ENV || 'development',
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};
if(!env.supabaseUrl) console.warn('Missing SUPABASE_URL');
