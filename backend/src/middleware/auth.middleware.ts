import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
export async function authMiddleware(req:Request,_res:Response,next:NextFunction){
  const header = req.headers.authorization;
  if(header?.startsWith('Bearer ')){
    const token = header.slice(7);
    const { data } = await supabaseAdmin.auth.getUser(token);
    (req as any).user = data.user || null;
    if(data.user){
      const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', data.user.id).single();
      (req as any).profile = profile;
    }
  }
  next();
}
