import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { sendOtpCode } from '../services/email.service.js';
function genCode(){ return Math.floor(100000 + Math.random()*900000).toString(); }

export async function requestOtp(req:Request,res:Response){
  const { email, type='signup' } = req.body;
  if(!email) return res.status(400).json({ error:'Email required' });
  // Try Supabase Auth OTP (works on Railway - uses Supabase SMTP, not Railway SMTP) - beautiful template via Supabase Dashboard
  try{
    const { error: otpErr } = await supabaseAdmin.auth.signInWithOtp({ email, options:{ shouldCreateUser: false } });
    if(!otpErr){
      console.log('OTP sent via Supabase Auth to', email);
      return res.json({ success:true, message:'Code sent via Supabase (check Gmail beautiful template if upgraded)', preview: 'supabase-otp' });
    }
    console.warn('Supabase signInWithOtp fail, fallback to custom', otpErr.message);
  }catch(e:any){ console.warn('Supabase OTP error', e?.message); }
  // Fallback to custom code + custom email (Resend/SendGrid/SMTP)
  const code = genCode();
  const expires = new Date(Date.now()+10*60*1000).toISOString();
  // delete old
  await supabaseAdmin.from('otp_codes').delete().eq('email', email).eq('type', type);
  const { error } = await supabaseAdmin.from('otp_codes').insert({ email, code, type, expires_at: expires });
  if(error) return res.status(400).json({ error: error.message });
  try{ await sendOtpCode(email, code); }catch(e:any){ console.error('custom mail fail', e?.message||e); }
  res.json({ success:true, message:'Code sent via Budget Bazar Service', preview: code });
}
export async function verifyOtp(req:Request,res:Response){
  const { email, code, type='signup' } = req.body;
  // Try Supabase Auth verify first (for signInWithOtp)
  try{
    const { data, error } = await supabaseAdmin.auth.verifyOtp({ email, token: code, type:'email' });
    if(!error && data.user){
      // confirm via admin as well
      try{ await supabaseAdmin.auth.admin.updateUserById(data.user.id, { email_confirm:true }); }catch{}
      return res.json({ success:true, via:'supabase' });
    }
  }catch(e:any){ console.warn('Supabase verify fail, fallback custom', e?.message); }
  // Fallback to custom otp_codes
  const { data, error } = await supabaseAdmin.from('otp_codes').select('*').eq('email', email).eq('code', code).eq('type', type).eq('used', false).single();
  if(error || !data) return res.status(400).json({ error:'Invalid code' });
  if(new Date(data.expires_at) < new Date()) return res.status(400).json({ error:'Code expired' });
  await supabaseAdmin.from('otp_codes').update({ used:true }).eq('id', data.id);
  // if signup, confirm user email via admin
  try{
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const u = (users as any).users?.find((x:any)=>x.email===email);
    if(u) await supabaseAdmin.auth.admin.updateUserById(u.id, { email_confirm:true });
  }catch{}
  res.json({ success:true, via:'custom' });
}
