'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { api } from '@/services/api';
import { Package, Upload, Sparkles, Eye, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminProducts(){
  const [products,setProducts]=useState<any[]>([]);
  const [categories,setCategories]=useState<any[]>([]);
  const [form,setForm]=useState({name:'',slug:'',brand:'',category_id:'',regular_price:'',sale_price:'',stock_quantity:'10',sku:'',short_description:'',is_new_arrival:false, featured:false});
  const [files,setFiles]=useState<FileList|null>(null);
  const [previews,setPreviews]=useState<string[]>([]);
  const [msg,setMsg]=useState(''); const [msgType,setMsgType]=useState<'success'|'error'|''>('');
  const [loading,setLoading]=useState(false); const [showSuccess,setShowSuccess]=useState(false);

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
  useEffect(()=>{ if(showSuccess){ const t=setTimeout(()=>setShowSuccess(false),2500); return ()=>clearTimeout(t);} },[showSuccess]);

  const submit=async(e:any)=>{
    e.preventDefault(); setLoading(true); setMsg(''); setMsgType('');
    const token = localStorage.getItem('token');
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
    const payload={
      name: form.name, slug,
      brand: form.brand || undefined, category_id: form.category_id || undefined,
      regular_price: Number(form.regular_price), sale_price: form.sale_price? Number(form.sale_price): undefined,
      stock_quantity: Number(form.stock_quantity), sku: form.sku || undefined,
      status:'active', short_description: form.short_description || form.name, description: form.short_description || form.name,
      is_new_arrival: form.is_new_arrival, featured: form.featured, trending: form.featured
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
      setMsg(`✅ "${form.name}" created! ${form.is_new_arrival?'New Arrival ✓ ':''}BBS Shop e live • ${files?.length||0} images uploaded`); setMsgType('success'); setShowSuccess(true);
      setForm({name:'',slug:'',brand:'',category_id:'',regular_price:'',sale_price:'',stock_quantity:'10',sku:'',short_description:'',is_new_arrival:false, featured:false});
      setFiles(null); (document.getElementById('fileInput') as any).value='';
      load();
    }catch(err:any){ const e=err.response?.data?.error; const msgText = typeof e==='string'? e : e? JSON.stringify(e, null, 2) : err.message; setMsg('❌ '+msgText); setMsgType('error'); }
    finally{ setLoading(false); }
  };

  const del = async(id:string)=>{
    if(!confirm('Delete this product permanently?')) return;
    const token=localStorage.getItem('token');
    await api.delete(`/products/${id}`, { headers:{Authorization:`Bearer ${token}`}});
    load();
  };

  return (<div className="p-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center"><Package size={20} className="text-navy"/></div>
      <div><h1 className="font-black text-xl">Products — Full Control</h1><p className="text-sm text-gray-500">Add korle shathe shathe Storage → DB → Shop e visible • Premium animation</p></div>
    </div>

    <form onSubmit={submit} className="bg-white border rounded-2xl p-5 mt-5 shadow-sm">
      <h3 className="font-bold flex items-center gap-2"><Sparkles size={16} className="text-gold"/> Add New Product</h3>
      <p className="text-xs text-gray-500 mb-4">Fill → Upload → Click Add Product → Success animation → Shop e check</p>
      <div className="grid md:grid-cols-2 gap-3">
        <input placeholder="Product Name * (e.g. Dulavai er jainga)" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="border rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-gold focus:border-gold outline-none transition bg-gray-50 focus:bg-white" required/>
        <input placeholder="Slug (auto from name)" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} className="border rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-gold outline-none bg-gray-50"/>
        <input placeholder="Brand (e.g. Budget Choice)" value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} className="border rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-gold outline-none bg-gray-50"/>
        <select value={form.category_id} onChange={e=>setForm({...form,category_id:e.target.value})} className="border rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-gold outline-none bg-gray-50">
          <option value="">-- Select Category * --</option>
          {categories.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Regular Price ৳ *" type="number" value={form.regular_price} onChange={e=>setForm({...form,regular_price:e.target.value})} className="border rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-gold outline-none bg-gray-50" required/>
        <input placeholder="Sale Price ৳ (discount)" type="number" value={form.sale_price} onChange={e=>setForm({...form,sale_price:e.target.value})} className="border rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-gold outline-none bg-gray-50"/>
        <input placeholder="Stock Qty *" type="number" value={form.stock_quantity} onChange={e=>setForm({...form,stock_quantity:e.target.value})} className="border rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-gold outline-none bg-gray-50" required/>
        <input placeholder="SKU (unique, e.g. BBS-001)" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} className="border rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-gold outline-none bg-gray-50"/>
        <input placeholder="Short Description" value={form.short_description} onChange={e=>setForm({...form,short_description:e.target.value})} className="border rounded-xl px-3 py-2.5 md:col-span-2 focus:ring-2 focus:ring-gold outline-none bg-gray-50"/>
        <div className="md:col-span-2 flex gap-4 flex-wrap">
          <label className="flex items-center gap-2 text-sm font-bold cursor-pointer"><input type="checkbox" checked={form.is_new_arrival} onChange={e=>setForm({...form,is_new_arrival:e.target.checked})} className="accent-gold w-4 h-4"/> 🆕 New Arrival (control)</label>
          <label className="flex items-center gap-2 text-sm font-bold cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} className="accent-gold w-4 h-4"/> ⭐ Featured</label>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-bold flex items-center gap-1.5"><Upload size={14}/> Product Images (multiple)</label>
          <input id="fileInput" type="file" multiple accept="image/*" onChange={e=>setFiles(e.target.files)} className="w-full border-2 border-dashed rounded-xl px-3 py-3 mt-1.5 bg-gray-50 hover:bg-white transition"/>
          {previews.length>0 && <div className="flex gap-2 mt-3 flex-wrap animate-[slideIn_0.3s_ease]">{previews.map((u,i)=><img key={i} src={u} className="w-20 h-20 object-cover rounded-xl border-2 border-gold/30" alt="preview"/> )}</div>}
          <p className="text-xs text-gray-500 mt-1">JPG/PNG 5MB max • Shop e 1st image main, baki gallery</p>
        </div>
      </div>
      <button disabled={loading} type="submit" className="w-full mt-4 bg-gold hover:bg-[#E6A800] py-3 rounded-xl font-black shadow flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg transition-all hover:-translate-y-0.5">
        {loading ? <><span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin"/> Uploading to Storage...</> : <><Package size={16}/> Add Product → Storage → DB</>}
      </button>
      {msg && <div className={`mt-3 text-sm p-3 rounded-xl border flex items-start gap-2 ${msgType==='success'?'bg-green-50 border-green-200 text-green-800':'bg-red-50 border-red-200 text-red-700'}`}>{msgType==='success'?<CheckCircle2 size={16} className="mt-0.5 shrink-0"/>:null}<span>{msg}</span></div>}
    </form>

    {showSuccess && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 text-center shadow-2xl border animate-[slideIn_0.3s_ease] max-w-sm w-[90%]">
        <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce"><CheckCircle2 size={28} className="text-white"/></div>
        <p className="font-black text-lg mt-3">Product Added!</p>
        <p className="text-sm text-gray-500">Storage + DB done • Shop e live</p>
      </div>
    </div>}

    <div className="bg-white border rounded-2xl p-5 mt-6 shadow-sm">
      <h3 className="font-bold flex items-center gap-2">All Products ({products.length}) — Live Preview <Eye size={16} className="text-gray-400"/></h3>
      <div className="grid md:grid-cols-3 gap-3 mt-4">
        {products.map((p:any)=>{
          const img = p.product_images?.[0]?.image_url;
          const disc = p.regular_price && p.sale_price ? Math.round((1 - p.sale_price/p.regular_price)*100) : 0;
          return (<div key={p.id} className="border rounded-2xl p-3 bg-white hover:shadow-md hover:-translate-y-0.5 transition group">
            {img ? <img src={img} className="w-full h-32 object-contain bg-gray-50 rounded-xl group-hover:scale-105 transition" alt={p.name}/> : <div className="w-full h-32 bg-gray-100 rounded-xl flex items-center justify-center text-xs text-gray-400">No Image</div>}
            {disc>0 && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{disc}% OFF</span>}
            <p className="font-bold text-sm truncate mt-2">{p.name}</p>
            <p className="text-xs text-gray-500">{p.categories?.name || 'No Category'} • {p.brand || '-'}</p>
            <p className="text-sm font-black mt-1">৳{p.sale_price||p.regular_price} <span className="line-through text-gray-400 text-xs font-normal">৳{p.regular_price}</span></p>
            <p className={`text-xs font-semibold ${p.stock_quantity<5?'text-red-500':'text-green-600'}`}>Stock: {p.stock_quantity} {p.stock_quantity===0?'OUT OF STOCK': p.stock_quantity<5?'Low':'✓'}</p>
            <div className="flex gap-2 mt-3"><a href={`/product/${p.slug}`} target="_blank" className="flex-1 text-xs border rounded-xl px-2 py-1.5 text-center hover:bg-gray-50">View Shop</a><button onClick={()=>del(p.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-xl hover:bg-red-100 flex items-center gap-1"><Trash2 size={12}/> Delete</button></div>
          </div>);
        })}
      </div>
    </div>
  </div>);
}
