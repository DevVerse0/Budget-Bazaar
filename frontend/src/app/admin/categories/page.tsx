'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
export default function AdminCategories(){
  const [cats,setCats]=useState<any[]>([]);
  const [form,setForm]=useState({name:'',slug:'',parent_id:'',display_order:'0'});
  const [file,setFile]=useState<File|null>(null);
  const [preview,setPreview]=useState<string|null>(null);
  const [msg,setMsg]=useState('');
  const load=async()=>{
    const { data } = await supabase.from('categories').select('*').order('display_order');
    if(data) setCats(data);
  };
  useEffect(()=>{ load(); },[]);
  useEffect(()=>{ if(file) { const u=URL.createObjectURL(file); setPreview(u); return ()=>URL.revokeObjectURL(u);} else setPreview(null); },[file]);
  const submit=async(e:any)=>{
    e.preventDefault(); setMsg('Creating...');
    let image_url: string | null = null;
    if(file){
      const path = `cat-${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('category-images').upload(path, file);
      if(error){ const { error: e2 } = await supabase.storage.from('product-images').upload(path, file); if(e2) { setMsg(e2.message); return; } const { data: p } = supabase.storage.from('product-images').getPublicUrl(path); image_url=p.publicUrl; }
      else { const { data: p } = supabase.storage.from('category-images').getPublicUrl(path); image_url=p.publicUrl; }
    }
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g,'-');
    const { error } = await supabase.from('categories').insert({ name:form.name, slug, parent_id: form.parent_id||null, display_order: Number(form.display_order), image_url, status:'active' });
    if(error) setMsg(error.message); else { setMsg('✅ Category created'); setForm({name:'',slug:'',parent_id:'',display_order:'0'}); setFile(null); load(); }
  };
  return (<div className="p-6">
    <h1 className="font-bold text-lg">Categories — Main + Subcategory</h1>
    <form onSubmit={submit} className="bg-white border rounded p-4 mt-4 grid md:grid-cols-2 gap-3">
      <input placeholder="Category Name *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="border rounded px-3 py-2" required/>
      <input placeholder="Slug (auto)" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} className="border rounded px-3 py-2"/>
      <select value={form.parent_id} onChange={e=>setForm({...form,parent_id:e.target.value})} className="border rounded px-3 py-2">
        <option value="">-- Main Category (no parent) --</option>
        {cats.filter(c=>!c.parent_id).map((c:any)=><option key={c.id} value={c.id}>{c.name} (as parent)</option>)}
      </select>
      <input placeholder="Display Order" type="number" value={form.display_order} onChange={e=>setForm({...form,display_order:e.target.value})} className="border rounded px-3 py-2"/>
      <div className="md:col-span-2">
        <label className="text-sm">Category Image</label>
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} className="w-full border rounded px-3 py-2 mt-1"/>
        {preview && <img src={preview} className="w-32 h-32 object-cover rounded border mt-2" alt="preview"/>}
      </div>
      <button type="submit" className="md:col-span-2 bg-gold py-2 rounded font-semibold">Create Category</button>
      {msg && <p className="md:col-span-2 text-sm bg-gray-50 p-2 rounded">{msg}</p>}
    </form>
    <div className="bg-white border rounded p-4 mt-6">
      <h3 className="font-semibold">All Categories ({cats.length})</h3>
      <div className="grid md:grid-cols-4 gap-3 mt-3">
        {cats.map((c:any)=><div key={c.id} className="border rounded p-3 text-sm">
          {c.image_url ? <img src={c.image_url} className="w-full h-24 object-cover rounded" alt={c.name}/> : <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">No Image</div>}
          <p className="font-medium mt-1">{c.name}</p><p className="text-xs text-gray-500">/{c.slug} {c.parent_id?'• Sub':''}</p><p className="text-xs">Order: {c.display_order}</p>
        </div>)}
      </div>
    </div>
  </div>);
}
