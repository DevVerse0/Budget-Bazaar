'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/product/ProductCard';
export default function Home(){
  const [products,setProducts]=useState<any[]>([]);
  const [categories,setCategories]=useState<any[]>([]);
  useEffect(()=>{
    supabase.from('products').select('*, product_images(image_url)').eq('status','active').order('created_at',{ascending:false}).limit(8).then(({data})=>{ if(data) setProducts(data); });
    supabase.from('categories').select('*').eq('status','active').order('display_order').limit(7).then(({data})=>{ if(data) setCategories(data); });
  },[]);
  return (<div>
    <section className="bg-navy text-white relative overflow-hidden">
      <div className="container-bb py-10 md:py-16 grid md:grid-cols-2 gap-8 items-center">
        <div><h1 className="text-3xl md:text-5xl font-bold leading-tight">Best Gadgets<br/>Best <span className="text-gold">Prices</span></h1><p className="mt-3 text-white/80 text-sm">Find the latest gadgets at unbeatable prices only on Budget Bazar.</p><a href="/shop" className="inline-block mt-6 bg-gold text-navy px-6 py-2 rounded font-semibold">Shop Now</a></div>
        <div className="bg-white/10 rounded-2xl h-64 md:h-80 flex items-center justify-center text-white/60">Hero Gadgets</div>
      </div>
    </section>
    <section className="container-bb grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {['Fast Delivery','Best Quality','Best Price','Support 24/7'].map(t=><div key={t} className="border rounded p-4 bg-white text-sm font-medium text-center">{t}</div>)}
    </section>
    <section className="container-bb mt-8">
      <h2 className="font-bold text-lg mb-4">Shop by Categories</h2>
      <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
        {categories.length? categories.map((c:any)=><a key={c.id} href={`/shop?category=${c.slug}`} className="border rounded p-3 text-center text-sm bg-white hover:shadow">
          {c.image_url ? <img src={c.image_url} className="w-12 h-12 mx-auto object-cover rounded" alt={c.name}/> : <div className="w-12 h-12 mx-auto bg-gray-100 rounded flex items-center justify-center text-xs">📦</div>}
          <p className="mt-2 text-xs">{c.name}</p>
        </a>) : ['Mobile','Audio','Watch','Gaming','Electronics','Computer','Offers'].map(c=><div key={c} className="border rounded p-4 text-center text-sm bg-white">{c}</div>)}
      </div>
    </section>
    <section className="container-bb mt-8">
      <div className="flex justify-between items-center mb-4"><h2 className="font-bold">Popular Products</h2><a href="/shop" className="text-sm text-blue-600">View All</a></div>
      {products.length===0 ? <p className="text-sm text-gray-500 border rounded p-8 text-center bg-white">No products yet — Upload from Admin → Products</p> : <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{products.map((p:any)=><ProductCard key={p.id} p={{name:p.name, slug:p.slug, sale_price:p.sale_price, regular_price:p.regular_price, image:p.product_images?.[0]?.image_url, brand:p.brand, stock_quantity:p.stock_quantity}} />)}</div>}
    </section>
  </div>);
}
