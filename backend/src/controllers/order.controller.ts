import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { generateOrderNumber } from '../utils/orderNumber.js';

export async function createOrder(req:Request,res:Response){
  const user = (req as any).user;
  // Require login before order - fix guest checkout
  if(!user) return res.status(401).json({ error:'Please login to place order. Login required.', code:'LOGIN_REQUIRED' });
  // Block shopping until OTP verified
  if(!user.email_confirmed_at){
    return res.status(403).json({ error:'Please verify your email with OTP before shopping. Check your email for verification code.', code:'EMAIL_NOT_VERIFIED', email:user.email });
  }
  const body = (req as any).validated || req.body;
  // Validate stock & price server-side
  let subtotal = 0;
  const itemsSnapshot:any[] = [];
  for(const it of body.items){
    const { data: prod, error } = await supabaseAdmin.from('products').select('id,name,sale_price,regular_price,stock_quantity').eq('id', it.productId).single();
    if(error || !prod) return res.status(400).json({ error: `Product not found ${it.productId}` });
    if(prod.stock_quantity < it.quantity) return res.status(400).json({ error: `${prod.name} out of stock` });
    const unit = prod.sale_price ?? prod.regular_price;
    subtotal += Number(unit) * it.quantity;
    itemsSnapshot.push({ product_id: prod.id, product_name: prod.name, quantity: it.quantity, unit_price: unit, subtotal: Number(unit)*it.quantity });
  }
  // coupon validation
  let discount = 0;
  if(body.couponCode){
    const { data: coupon } = await supabaseAdmin.from('coupons').select('*').eq('code', body.couponCode).eq('status','active').single();
    if(coupon){
      const now = new Date();
      if((!coupon.expiry_date || new Date(coupon.expiry_date) > now) && subtotal >= Number(coupon.minimum_order||0)){
        if(coupon.discount_type==='percentage') discount = Math.min(subtotal*Number(coupon.discount_value)/100, Number(coupon.maximum_discount||Infinity));
        else discount = Number(coupon.discount_value);
      }
    }
  }
  // delivery charge from settings
  const { data: delSetting } = await supabaseAdmin.from('settings').select('setting_value').eq('setting_key','delivery').single();
  const deliveryCharge = delSetting?.setting_value?.insideCity ?? 60;
  const total = subtotal + deliveryCharge - discount;
  const order_number = generateOrderNumber();
  const { data: order, error: oErr } = await supabaseAdmin.from('orders').insert({
    order_number, customer_id: (req as any).user?.id || null,
    customer_name: body.customer_name, mobile: body.mobile, alternative_mobile: body.alternative_mobile,
    division: body.division, district: body.district, area: body.area, full_address: body.full_address, notes: body.notes,
    subtotal, delivery_charge: deliveryCharge, discount, total, payment_method: body.payment_method||'cod', status:'pending', coupon_code: body.couponCode || null
  }).select().single();
  if(oErr) return res.status(400).json({ error: oErr.message });
  for(const sn of itemsSnapshot){
    await supabaseAdmin.from('order_items').insert({ order_id: order.id, product_id: sn.product_id, product_name: sn.product_name, quantity: sn.quantity, unit_price: sn.unit_price, subtotal: sn.subtotal });
    // decrement stock
    await supabaseAdmin.rpc('decrement_stock', { pid: sn.product_id, qty: sn.quantity }).then(()=>{},()=>{});
    // fallback manual decrement
    const { data: p } = await supabaseAdmin.from('products').select('stock_quantity').eq('id', sn.product_id).single();
    if(p) await supabaseAdmin.from('products').update({ stock_quantity: Math.max(0, p.stock_quantity - sn.quantity) }).eq('id', sn.product_id);
  }
  // notification for admin
  await supabaseAdmin.from('notifications').insert({ title:'New Order Received', message: `Customer: ${body.customer_name} Total: ৳${total}`, type:'order' });
  res.status(201).json({ order, items: itemsSnapshot });
}
export async function listOrders(_req:Request,res:Response){
  const { data, error } = await supabaseAdmin.from('orders').select('*, order_items(*)').order('created_at',{ascending:false}).limit(100);
  if(error) return res.status(400).json({ error: error.message });
  res.json(data);
}
export async function getOrder(req:Request,res:Response){
  const { data, error } = await supabaseAdmin.from('orders').select('*, order_items(*)').eq('id', req.params.id).single();
  if(error) return res.status(404).json({ error:'Not found' });
  res.json(data);
}
export async function updateOrderStatus(req:Request,res:Response){
  const { status } = req.body;
  const { data, error } = await supabaseAdmin.from('orders').update({ status }).eq('id', req.params.id).select().single();
  if(error) return res.status(400).json({ error: error.message });
  res.json(data);
}
export async function trackOrder(req:Request,res:Response){
  const { order_number, mobile } = req.body;
  const { data, error } = await supabaseAdmin.from('orders').select('*, order_items(*)').eq('order_number', order_number).eq('mobile', mobile).single();
  if(error) return res.status(404).json({ error:'Order not found' });
  res.json(data);
}
