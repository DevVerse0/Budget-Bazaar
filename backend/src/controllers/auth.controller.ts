import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { sendResetLink } from '../services/email.service.js';
export async function me(req:Request,res:Response){
  const user = (req as any).user;
  const profile = (req as any).profile;
  if(!user) return res.status(401).json({ error:'Unauthorized' });
  res.json({ user, profile });
}
export async function forgotPassword(req:Request,res:Response){
  const { email } = req.body;
  if(!email) return res.status(400).json({ error:'Email required' });
  // generate Supabase recovery link via admin
  try{
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({ type:'recovery', email, options:{ redirectTo: `${process.env.FRONTEND_URL}/reset-password` } });
    if(error) throw error;
    const link = (data as any).properties?.action_link || 'Check Supabase email';
    // also send via Gmail SMTP directly
    try{ await sendResetLink(email, link); } catch(e){ console.warn('SMTP send fail, but link generated', e); }
    res.json({ success:true, message:'Reset link sent if email exists', link }); // link returned for dev check
  }catch(err:any){
    console.error(err); res.status(400).json({ error: err.message });
  }
}
