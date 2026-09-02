'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
export default function SearchSuggestions({q, onClose}:{q:string; onClose:()=>void}){
  const [products,setProducts]=useState<any[]>([]);
  useEffect(()=>{
    if(!q) { setProducts([]); return; }
    const t=setTimeout(async()=>{
      const { data } = await supabase.from('products').select('name,slug,sale_price,regular_price,product_images(image_url),categories(name)').ilike('name',`%${q}%`).limit(5);
      if(data) setProducts(data);
    },300);
    return ()=>clearTimeout(t);
  },[q]);
  const recent = ['Wireless Earbuds','Gaming Mouse','Smart Watch'];
  const popular = ['Headphones','Power Bank','Gaming Keyboard','Fast Charger'];
  return (<div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border overflow-hidden z-50">
    {q && products.length>0 ? (<div className="divide-y">
      {products.map((p:any)=><Link key={p.slug} href={`/product/${p.slug}`} onClick={onClose} className="flex gap-3 p-3 hover:bg-gray-50 transition">
        {p.product_images?.[0]?.image_url ? <img src={p.product_images[0].image_url} className="w-12 h-12 object-contain bg-gray-50 rounded"/> : <div className="w-12 h-12 bg-gray-100 rounded"/>}
        <div className="flex-1 text-left"><p className="text-sm font-medium line-clamp-1">{p.name}</p><p className="text-xs text-gray-500">{p.categories?.name}</p></div>
        <span className="text-sm font-bold">৳{p.sale_price||p.regular_price}</span>
      </Link>)}
    </div>) : q ? (<p className="p-4 text-sm text-gray-500 text-center">No results for &quot;{q}&quot;</p>) : null}
    {!q && <div className="p-4 grid grid-cols-2 gap-4">
      <div><p className="text-xs font-semibold text-gray-400 mb-2">RECENT SEARCHES</p>{recent.map(r=><p key={r} className="text-sm py-1 hover:text-gold cursor-pointer">{r}</p>)}</div>
      <div><p className="text-xs font-semibold text-gray-400 mb-2">POPULAR SEARCHES</p>{popular.map(r=><p key={r} className="text-sm py-1 hover:text-gold cursor-pointer">{r}</p>)}</div>
    </div>}
  </div>);
}
