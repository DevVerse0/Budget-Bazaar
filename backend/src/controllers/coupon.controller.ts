import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

export async function validateCoupon(req:Request,res:Response){
  const { code, subtotal } = req.body;
  if(!code) return res.status(400).json({ error:'Coupon code required' });
  const { data: coupon, error } = await supabaseAdmin.from('coupons').select('*').eq('code', code).eq('status','active').single();
  if(error || !coupon) return res.status(400).json({ valid:false, error:'Invalid or inactive coupon' });
  const now = new Date();
  if(coupon.expiry_date && new Date(coupon.expiry_date) < now) return res.status(400).json({ valid:false, error:'Coupon expired' });
  if(coupon.start_date && new Date(coupon.start_date) > now) return res.status(400).json({ valid:false, error:'Coupon not yet active' });
  if(coupon.usage_limit && Number(coupon.used_count) >= Number(coupon.usage_limit)) return res.status(400).json({ valid:false, error:'Coupon usage limit reached' });
  const sub = Number(subtotal||0);
  if(sub < Number(coupon.minimum_order||0)) return res.status(400).json({ valid:false, error:`Minimum order ৳${coupon.minimum_order} required` });
  let discount = 0;
  if(coupon.discount_type==='percentage') discount = Math.min(sub*Number(coupon.discount_value)/100, Number(coupon.maximum_discount||Infinity));
  else discount = Number(coupon.discount_value);
  discount = Math.min(discount, sub);
  res.json({ valid:true, discount, coupon });
}
