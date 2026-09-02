import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
export async function listProducts(req:Request,res:Response){
  const { category, search, minPrice, maxPrice, brand, sort='created_at', order='desc', page='1', limit='20', featured } = req.query as any;
  let q = supabaseAdmin.from('products').select('*, product_images(*), categories!inner(name,slug)', { count:'exact' }).eq('status','active');
  if(category) q = q.eq('categories.slug', category);
  if(search) q = q.ilike('name', `%${search}%`);
  if(brand) q = q.eq('brand', brand);
  if(minPrice) q = q.gte('sale_price', Number(minPrice));
  if(maxPrice) q = q.lte('sale_price', Number(maxPrice));
  if(featured) q = q.eq('featured', true);
  const sortMap:any = { price: 'sale_price', newest: 'created_at', best: 'created_at' };
  q = q.order(sortMap[sort] || sort, { ascending: order==='asc' });
  const p = parseInt(page), l = parseInt(limit);
  q = q.range((p-1)*l, p*l-1);
  const { data, error, count } = await q;
  if(error) return res.status(400).json({ error: error.message });
  res.json({ data, count, page:p, limit:l });
}
export async function getProduct(req:Request,res:Response){
  const { id } = req.params;
  const field = id.includes('-') && !id.match(/^[0-9a-f-]{36}$/) ? 'slug' : 'id';
  const { data, error } = await supabaseAdmin.from('products').select('*, product_images(*), product_specifications(*, specification_definitions(*))').eq(field,id).single();
  if(error) return res.status(404).json({ error:'Not found' });
  res.json(data);
}
export async function createProduct(req:Request,res:Response){
  const payload = (req as any).validated || req.body;
  const { data, error } = await supabaseAdmin.from('products').insert(payload).select().single();
  if(error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
}
export async function updateProduct(req:Request,res:Response){
  const { id } = req.params;
  const { data, error } = await supabaseAdmin.from('products').update(req.body).eq('id', id).select().single();
  if(error) return res.status(400).json({ error: error.message });
  res.json(data);
}
export async function deleteProduct(req:Request,res:Response){
  const { id } = req.params;
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if(error) return res.status(400).json({ error: error.message });
  res.json({ success:true });
}
