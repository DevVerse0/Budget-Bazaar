'use client';
import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/product/ProductCard';
import { useSearchParams } from 'next/navigation';
function ShopInner(){
  const [products,setProducts]=useState<any[]>([]);
  const [cats,setCats]=useState<any[]>([]);
  const params = useSearchParams();
  const cat = params.get('category');
  const [priceMin,setPriceMin]=useState(''); const [priceMax,setPriceMax]=useState('');
  const load=async()=>{
    let q = supabase.from('products').select('*, product_images(image_url), categories!inner(slug)').eq('status','active');
    if(cat) q = q.eq('categories.slug', cat);
    if(priceMin) q = q.gte('sale_price', Number(priceMin));
    if(priceMax) q = q.lte('sale_price', Number(priceMax));
    q = q.order('created_at',{ascending:false});
    const { data } = await q;
    if(data) setProducts(data);
  };
  useEffect(()=>{ supabase.from('categories').select('*').then(({data})=>data&&setCats(data)); },[]);
  useEffect(()=>{ load(); },[cat]);
  return (<div className="container-bb py-6 grid md:grid-cols-[260px_1fr] gap-6">
    <aside className="border rounded p-4 bg-white h-fit space-y-4">
      <h3 className="font-semibold">Filters</h3>
      <div><p className="text-sm font-medium">Category</p><div className="mt-1 space-y-1">{cats.map((c:any)=><a key={c.id} href={`/shop?category=${c.slug}`} className={`block text-sm ${cat===c.slug?'font-bold text-gold':''}`}>{c.name}</a>)}<a href="/shop" className="block text-sm text-blue-600">Clear</a></div></div>
      <div><p className="text-sm font-medium">Price</p><div className="flex gap-2 mt-1"><input value={priceMin} onChange={e=>setPriceMin(e.target.value)} placeholder="Min" className="w-full border rounded px-2 py-1 text-sm"/><input value={priceMax} onChange={e=>setPriceMax(e.target.value)} placeholder="Max" className="w-full border rounded px-2 py-1 text-sm"/></div><button onClick={load} className="w-full mt-2 bg-navy text-white py-1 rounded text-sm">Apply</button></div>
    </aside>
    <div>
      <div className="flex justify-between text-sm mb-4"><span>{products.length} products {cat?`in ${cat}`:''}</span></div>
      {products.length===0 ? <p className="border rounded p-8 text-center bg-white text-sm text-gray-500">No products found — Create via Admin</p> : <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{products.map((p:any)=><ProductCard key={p.id} p={{name:p.name, slug:p.slug, sale_price:p.sale_price, regular_price:p.regular_price, image:p.product_images?.[0]?.image_url, brand:p.brand, stock_quantity:p.stock_quantity}} />)}</div>}
    </div>
  </div>);
}
export default function Shop(){ return (<Suspense fallback={<div className="container-bb py-6">Loading...</div>}><ShopInner/></Suspense>); }
