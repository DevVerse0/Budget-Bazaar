'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { api } from '@/services/api';

export default function AdminProducts(){
  const [products,setProducts]=useState<any[]>([]);
  const [categories,setCategories]=useState<any[]>([]);
  const [form,setForm]=useState({name:'',slug:'',brand:'',category_id:'',regular_price:'',sale_price:'',stock_quantity:'10',sku:'',short_description:''});
  const [files,setFiles]=useState<FileList|null>(null);
  const [previews,setPreviews]=useState<string[]>([]);
  const [msg,setMsg]=useState('');
  const [loading,setLoading]=useState(false);

  const load=async()=>{
    const { data } = await supabase.from('products').select('*, product_images(*), categories(name)').order('created_at',{ascending:false}).limit(20);
    if(data) setProducts(data);
    const { data: cats } = await supabase.from('categories').select('*').order('display_order');
    if(cats) setCategories(cats);
  };
  useEffect(()=>{ load(); },[]);
  useEffect(()=>{
    if(!files) { setPreviews([]); return; }
    const urls = Array.from(files).map(f=>URL.createObjectURL(f));
    setPreviews(urls);
    return ()=> urls.forEach(u=>URL.revokeObjectURL(u));
  },[files]);

  const submit=async(e:any)=>{
    e.preventDefault(); setLoading(true); setMsg('Creating product...');
    const token = localStorage.getItem('token');
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
    const payload={
      name: form.name, slug,
      brand: form.brand || undefined, category_id: form.category_id || undefined,
      regular_price: Number(form.regular_price), sale_price: form.sale_price? Number(form.sale_price): undefined,
      stock_quantity: Number(form.stock_quantity), sku: form.sku || undefined,
      status:'active', short_description: form.short_description || form.name, description: form.short_description || form.name
    };
    try{
      const res = await api.post('/products', payload, { headers: { Authorization: `Bearer ${token}` }});
      const prod = res.data;
      if(files && files.length>0){
        for(let i=0;i<files.length;i++){
          const f = (files as any)[i] as File;
          const path = `${prod.id}/${Date.now()}-${i}-${f.name}`;
          const { error } = await supabase.storage.from('product-images').upload(path, f, { cacheControl:'3600', upsert:false });
          if(error) throw error;
          const { data: pub } = supabase.storage.from('product-images').getPublicUrl(path);
          await supabase.from('product_images').insert({ product_id: prod.id, image_url: pub.publicUrl, display_order: i });
        }
      }
      setMsg('✅ Product created & images uploaded! Shop e dekhte paba.');
      setForm({name:'',slug:'',brand:'',category_id:'',regular_price:'',sale_price:'',stock_quantity:'10',sku:'',short_description:''});
      setFiles(null); (document.getElementById('fileInput') as any).value='';
      load();
    }catch(err:any){ const e=err.response?.data?.error; const msgText = typeof e==='string'? e : e? JSON.stringify(e, null, 2) : err.message; setMsg('❌ '+msgText); }
    finally{ setLoading(false); }
  };

  const del = async(id:string)=>{
    if(!confirm('Delete?')) return;
    const token=localStorage.getItem('token');
    await api.delete(`/products/${id}`, { headers:{Authorization:`Bearer ${token}`}});
    load();
  };

  return (<div className="p-6">
    <h1 className="font-bold text-lg">Products — Admin Upload</h1>
    <p className="text-sm text-gray-500">Image preview + Category + Shop e auto visible</p>
    <form onSubmit={submit} className="bg-white border rounded p-4 mt-4 grid md:grid-cols-2 gap-3">
      <input placeholder="Product Name *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="border rounded px-3 py-2" required/>
      <input placeholder="Slug (auto)" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} className="border rounded px-3 py-2"/>
      <input placeholder="Brand" value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} className="border rounded px-3 py-2"/>
      <select value={form.category_id} onChange={e=>setForm({...form,category_id:e.target.value})} className="border rounded px-3 py-2">
        <option value="">-- Select Category --</option>
        {categories.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input placeholder="Regular Price ৳ *" type="number" value={form.regular_price} onChange={e=>setForm({...form,regular_price:e.target.value})} className="border rounded px-3 py-2" required/>
      <input placeholder="Sale Price ৳ (discount)" type="number" value={form.sale_price} onChange={e=>setForm({...form,sale_price:e.target.value})} className="border rounded px-3 py-2"/>
      <input placeholder="Stock Qty *" type="number" value={form.stock_quantity} onChange={e=>setForm({...form,stock_quantity:e.target.value})} className="border rounded px-3 py-2" required/>
      <input placeholder="SKU (unique)" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} className="border rounded px-3 py-2"/>
      <input placeholder="Short Description" value={form.short_description} onChange={e=>setForm({...form,short_description:e.target.value})} className="border rounded px-3 py-2 md:col-span-2"/>
      <div className="md:col-span-2">
        <label className="text-sm font-medium">Product Images (multiple, 5MB, image/*)</label>
        <input id="fileInput" type="file" multiple accept="image/*" onChange={e=>setFiles(e.target.files)} className="w-full border rounded px-3 py-2 mt-1"/>
        {previews.length>0 && <div className="flex gap-2 mt-2 flex-wrap">{previews.map((u,i)=><img key={i} src={u} className="w-20 h-20 object-cover rounded border" alt="preview"/> )}</div>}
      </div>
      <button disabled={loading} type="submit" className="md:col-span-2 bg-gold py-2.5 rounded font-semibold disabled:opacity-50">{loading?'Uploading...':'Add Product -> Storage -> DB'}</button>
      {msg && <p className="md:col-span-2 text-sm p-2 bg-gray-50 rounded">{msg}</p>}
    </form>

    <div className="bg-white border rounded p-4 mt-6">
      <h3 className="font-semibold">All Products ({products.length}) — Preview + Category + Stock</h3>
      <div className="grid md:grid-cols-3 gap-3 mt-3">
        {products.map((p:any)=>{
          const img = p.product_images?.[0]?.image_url;
          const disc = p.regular_price && p.sale_price ? Math.round((1 - p.sale_price/p.regular_price)*100) : 0;
          return (<div key={p.id} className="border rounded p-3 bg-white">
            {img ? <img src={img} className="w-full h-32 object-contain bg-gray-50 rounded" alt={p.name}/> : <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">No Image</div>}
            {disc>0 && <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">{disc}% OFF</span>}
            <p className="font-medium text-sm truncate mt-1">{p.name}</p>
            <p className="text-xs text-gray-500">{p.categories?.name || 'No Category'} • {p.brand || '-'}</p>
            <p className="text-sm font-bold">৳{p.sale_price||p.regular_price} <span className="line-through text-gray-400 text-xs">৳{p.regular_price}</span></p>
            <p className={`text-xs ${p.stock_quantity<5?'text-red-500':'text-green-600'}`}>Stock: {p.stock_quantity} {p.stock_quantity===0?'OUT OF STOCK': p.stock_quantity<5?'Low Stock':''}</p>
            <div className="flex gap-2 mt-2"><a href={`/product/${p.slug}`} target="_blank" className="text-xs border px-2 py-1 rounded">View Shop</a><button onClick={()=>del(p.id)} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded">Delete</button></div>
          </div>);
        })}
      </div>
    </div>
  </div>);
}
