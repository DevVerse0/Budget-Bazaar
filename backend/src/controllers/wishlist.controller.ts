import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

export async function getWishlist(req:Request,res:Response){
  const user = (req as any).user;
  if(!user) return res.status(401).json({ error:'Unauthorized' });
  const { data, error } = await supabaseAdmin.from('wishlist').select('product_id, products(id,name,slug,sale_price,regular_price,brand,stock_quantity, product_images(image_url))').eq('user_id', user.id);
  if(error) return res.status(400).json({ error:error.message });
  res.json(data);
}

export async function toggleWishlist(req:Request,res:Response){
  const user = (req as any).user;
  if(!user) return res.status(401).json({ error:'Unauthorized' });
  if(!user.email_confirmed_at) return res.status(403).json({ error:'Please verify your email with OTP before adding to wishlist', code:'EMAIL_NOT_VERIFIED', email:user.email });
  const { productId } = req.body;
  if(!productId) return res.status(400).json({ error:'productId required' });
  const { data: existing } = await supabaseAdmin.from('wishlist').select('id').eq('user_id', user.id).eq('product_id', productId).single();
  if(existing){
    await supabaseAdmin.from('wishlist').delete().eq('id', existing.id);
    return res.json({ added:false });
  } else {
    const { error } = await supabaseAdmin.from('wishlist').insert({ user_id:user.id, product_id:productId });
    if(error) return res.status(400).json({ error:error.message });
    return res.json({ added:true });
  }
}

export async function removeWishlist(req:Request,res:Response){
  const user = (req as any).user;
  if(!user) return res.status(401).json({ error:'Unauthorized' });
  await supabaseAdmin.from('wishlist').delete().eq('user_id', user.id).eq('product_id', req.params.productId);
  res.json({ success:true });
}
