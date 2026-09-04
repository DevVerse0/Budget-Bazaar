'use client';
import { useEffect, useState, Suspense, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/product/ProductCard';
import { useSearchParams, useRouter } from 'next/navigation';
function ShopInner(){
  const [raw,setRaw]=useState<any[]>([]);
  const [cats,setCats]=useState<any[]>([]);
  const params = useSearchParams(); const router = useRouter();
  const cat = params.get('category');
  const isNew = params.get('new')==='1';
  const isDeals = params.get('deals')==='1';
  const [priceMin,setPriceMin]=useState(''); const [priceMax,setPriceMax]=useState('');
  const [brand,setBrand]=useState(''); const [sort,setSort]=useState('newest'); const [inStock,setInStock]=useState(false);
  const load=async()=>{
    let q = supabase.from('products').select('*, product_images(image_url), categories!inner(slug,name)').eq('status','active');
    if(cat) q = q.eq('categories.slug', cat);
    if(isNew) q = q.eq('is_new_arrival', true);
    q = q.order('created_at',{ascending:false});
    const { data } = await q;
    if(data){
      let filtered = data;
      if(isDeals) filtered = filtered.filter((p:any)=> p.sale_price && p.sale_price < p.regular_price);
      setRaw(filtered);
    }
  };
  useEffect(()=>{ supabase.from('categories').select('*').then(({data})=>data&&setCats(data)); },[]);
  useEffect(()=>{ load(); },[cat, isNew, isDeals]);
  const brands = useMemo(()=> Array.from(new Set(raw.map(r=>r.brand).filter(Boolean))) as string[], [raw]);
  const products = useMemo(()=>{
    let lst = [...raw];
    lst = lst.filter(p=>{
      const eff = Number(p.sale_price ?? p.regular_price ?? 0);
      if(priceMin && eff < Number(priceMin)) return false;
      if(priceMax && eff > Number(priceMax)) return false;
      if(brand && p.brand!==brand) return false;
      if(inStock && Number(p.stock_quantity)===0) return false;
      return true;
    });
    if(sort==='price_asc') lst.sort((a,b)=> Number(a.sale_price??a.regular_price) - Number(b.sale_price??b.regular_price));
    else if(sort==='price_desc') lst.sort((a,b)=> Number(b.sale_price??b.regular_price) - Number(a.sale_price??a.regular_price));
    else if(sort==='discount') lst.sort((a,b)=>{
      const da = a.sale_price && a.regular_price ? (1 - a.sale_price/a.regular_price) : 0;
      const db = b.sale_price && b.regular_price ? (1 - b.sale_price/b.regular_price) : 0;
      return db-da;
    });
    return lst;
  },[raw, priceMin, priceMax, brand, sort, inStock]);
  return (<div className="container-bb py-6 grid lg:grid-cols-[280px_1fr] gap-6">
    <aside className="border rounded-xl p-4 bg-white h-fit space-y-5 shadow-sm">
      <div className="flex items-center justify-between"><h3 className="font-black">Filters</h3><button onClick={()=>{setPriceMin('');setPriceMax('');setBrand('');setSort('newest');setInStock(false);router.push('/shop');}} className="text-xs text-blue-600 hover:underline">Clear all</button></div>
      <div><p className="text-sm font-bold">Category</p><div className="mt-2 space-y-1.5">{cats.map((c:any)=><a key={c.id} href={`/shop?category=${c.slug}`} className={`block text-sm px-2 py-1.5 rounded-lg ${cat===c.slug?'bg-gold text-navy font-bold':'hover:bg-gray-50'}`}>{c.name}</a>)}<a href="/shop" className={`block text-sm px-2 py-1.5 rounded-lg ${!cat?'bg-navy text-white':''}`}>All</a></div></div>
      <div><p className="text-sm font-bold">Brand</p><select value={brand} onChange={e=>setBrand(e.target.value)} className="w-full mt-1.5 border rounded-xl px-3 py-2 text-sm bg-white"><option value="">All Brands</option>{brands.map(b=><option key={b} value={b}>{b}</option>)}</select></div>
      <div><p className="text-sm font-bold">Price (৳)</p><div className="flex gap-2 mt-1.5"><input value={priceMin} onChange={e=>setPriceMin(e.target.value)} placeholder="Min" type="number" className="w-full border rounded-xl px-3 py-2 text-sm"/><input value={priceMax} onChange={e=>setPriceMax(e.target.value)} placeholder="Max" type="number" className="w-full border rounded-xl px-3 py-2 text-sm"/></div></div>
      <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={inStock} onChange={e=>setInStock(e.target.checked)} className="rounded"/> In Stock only</label>
      <div><p className="text-sm font-bold">Sort by</p><select value={sort} onChange={e=>setSort(e.target.value)} className="w-full mt-1.5 border rounded-xl px-3 py-2 text-sm bg-white"><option value="newest">Newest</option><option value="price_asc">Price: Low to High</option><option value="price_desc">Price: High to Low</option><option value="discount">Biggest Discount</option></select></div>
      <p className="text-xs text-gray-500">{products.length} products found</p>
    </aside>
    <div>
      <div className="flex justify-between items-center text-sm mb-4 bg-white border rounded-xl px-4 py-3"><span className="font-semibold">{products.length} products {cat?`in ${cat}`:''} {isNew?'• New Arrivals':''} {isDeals?'• Deals':''} {brand?`• ${brand}`:''}</span><span className="text-gray-500 hidden sm:inline">Shop • Budget Bazar</span></div>
      {products.length===0 ? <p className="border rounded-xl p-10 text-center bg-white text-sm text-gray-500">No products found — Try clearing filters or create via Admin</p> : <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{products.map((p:any)=><ProductCard key={p.id} p={{id:p.id, name:p.name, slug:p.slug, sale_price:p.sale_price, regular_price:p.regular_price, image:p.product_images?.[0]?.image_url, brand:p.brand, stock_quantity:p.stock_quantity}} />)}</div>}
    </div>
  </div>);
}
export default function Shop(){ return (<Suspense fallback={<div className="container-bb py-6">Loading...</div>}><ShopInner/></Suspense>); }
