'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Image as ImgIcon, Upload } from 'lucide-react';
export default function AdminBanners(){
  const [banners,setBanners]=useState<any[]>([]); const [file,setFile]=useState<File|null>(null); const [title,setTitle]=useState(''); const [msg,setMsg]=useState('');
  const load=async()=>{ const { data } = await supabase.from('banners').select('*').order('created_at',{ascending:false}); if(data) setBanners(data); };
  useEffect(()=>{ load(); },[]);
  const create=async(e:any)=>{
    e.preventDefault();
    let image_url='https://via.placeholder.com/1200x400?text=Banner';
    if(file){
      const path=`banner-${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('product-images').upload(path, file);
      if(error){ setMsg(error.message); return; }
      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      image_url=data.publicUrl;
    }
    const { error } = await supabase.from('banners').insert({ title, image_url, status:'active' });
    if(error) setMsg(error.message); else { setMsg('✅ Banner created — Home e show hobe (hero)'); setTitle(''); setFile(null); load(); }
  };
  return (<div className="p-6">
    <h1 className="font-black text-xl flex items-center gap-2"><ImgIcon size={20} className="text-gold"/> Banners</h1>
    <form onSubmit={create} className="bg-white border rounded-2xl p-4 mt-4 flex gap-3 shadow-sm">
      <input placeholder="Banner Title" value={title} onChange={e=>setTitle(e.target.value)} className="flex-1 border rounded-xl px-3 py-2.5" required/>
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} className="border rounded-xl px-3 py-2"/>
      <button className="bg-gold px-6 py-2.5 rounded-xl font-bold flex items-center gap-1"><Upload size={14}/> Add</button>
    </form>
    {msg && <p className="text-sm p-2 bg-gray-50 rounded mt-2">{msg}</p>}
    <div className="grid md:grid-cols-2 gap-3 mt-6">
      {banners.map(b=> (<div key={b.id} className="border rounded-xl overflow-hidden bg-white"><img src={b.image_url} className="w-full h-32 object-cover" alt={b.title}/><p className="p-2 text-sm font-semibold">{b.title}</p></div>))}
    </div>
  </div>);
}
