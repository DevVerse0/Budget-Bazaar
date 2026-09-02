import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
export async function listCategories(_req:Request,res:Response){
  const { data, error } = await supabaseAdmin.from('categories').select('*, specification_definitions(*)').order('display_order');
  if(error) return res.status(400).json({ error: error.message });
  res.json(data);
}
export async function getCategory(req:Request,res:Response){
  const { id } = req.params;
  const field = id.includes('-') ? 'slug' : 'id';
  const { data, error } = await supabaseAdmin.from('categories').select('*, specification_definitions(*)').eq(field,id).single();
  if(error) return res.status(404).json({ error:'Not found' });
  res.json(data);
}
export async function createCategory(req:Request,res:Response){
  const { data, error } = await supabaseAdmin.from('categories').insert(req.body).select().single();
  if(error) return res.status(400).json({ error: error.message });
  res.json(data);
}
export async function updateCategory(req:Request,res:Response){
  const { data, error } = await supabaseAdmin.from('categories').update(req.body).eq('id', req.params.id).select().single();
  if(error) return res.status(400).json({ error: error.message });
  res.json(data);
}
export async function deleteCategory(req:Request,res:Response){
  const { error } = await supabaseAdmin.from('categories').delete().eq('id', req.params.id);
  if(error) return res.status(400).json({ error: error.message });
  res.json({ success:true });
}
