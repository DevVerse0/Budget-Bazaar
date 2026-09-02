'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/store/cartStore';
export default function ProductPage({params}:{params:{slug:string}}){
  const [p,setP]=useState<any>(null); const [idx,setIdx]=useState(0); const [qty,setQty]=useState(1);
  const add = useCartStore(s=>s.add);
  useEffect(()=>{ supabase.from('products').select('*, product_images(*), categories(name), product_specifications(value, specification_definitions(name))').eq('slug', params.slug).single().then(({data})=>setP(data)); },[params.slug]);
  if(!p) return (<div className="container-bb py-10 text-center text-sm">Loading...</div>);
  const images = p.product_images || [];
  const main = images[idx]?.image_url;
  const disc = p.regular_price && p.sale_price ? Math.round((1 - p.sale_price/p.regular_price)*100) : 0;
  return (<div className="container-bb py-6 grid md:grid-cols-2 gap-8">
    <div>
      <div className="border rounded p-4 bg-white h-96 flex items-center justify-center overflow-hidden">{main ? <img src={main} className="max-h-full object-contain" alt={p.name}/> : <span className="text-gray-400">No Image</span>}</div>
      <div className="flex gap-2 mt-3">{images.map((im:any,i:number)=><button key={im.id} onClick={()=>setIdx(i)} className={`border rounded p-1 ${i===idx?'border-gold':''}`}><img src={im.image_url} className="w-16 h-16 object-cover" alt="thumb"/></button>)}</div>
    </div>
    <div>
      <h1 className="text-xl font-bold">{p.name}</h1>
      <p className="text-sm text-gray-500">{p.brand} • {p.categories?.name}</p>
      <div className="mt-3 text-2xl font-bold">৳{p.sale_price||p.regular_price} {p.sale_price && <><span className="line-through text-gray-400 text-base">৳{p.regular_price}</span> {disc>0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded ml-2">{disc}% OFF</span>}</>}</div>
      <p className={`text-sm mt-1 ${p.stock_quantity===0?'text-red-500':'text-green-600'}`}>{p.stock_quantity===0?'OUT OF STOCK':`In Stock: ${p.stock_quantity}`}</p>
      <div className="flex items-center gap-3 mt-4">
        <div className="flex items-center border rounded"><button onClick={()=>setQty(Math.max(1,qty-1))} className="px-3 py-1">-</button><span className="px-4">{qty}</span><button onClick={()=>setQty(Math.min(p.stock_quantity||99, qty+1))} className="px-3 py-1">+</button></div>
        <button disabled={p.stock_quantity===0} onClick={()=>{ add({productId:p.id, name:p.name, price: p.sale_price||p.regular_price, qty, image: main}); alert('Added to Cart'); }} className="flex-1 bg-navy text-white py-2.5 rounded disabled:opacity-40">Add to Cart</button>
        <button disabled={p.stock_quantity===0} onClick={()=>{ add({productId:p.id, name:p.name, price: p.sale_price||p.regular_price, qty, image: main}); location.href='/checkout'; }} className="flex-1 bg-gold py-2.5 rounded font-semibold disabled:opacity-40">Buy Now</button>
      </div>
      {p.product_specifications?.length>0 && <table className="w-full mt-6 text-sm border"><tbody>{p.product_specifications.map((s:any)=><tr key={s.specification_definitions.name} className="border-b"><td className="p-2 bg-gray-50 w-1/2">{s.specification_definitions.name}</td><td className="p-2">{s.value}</td></tr>)}</tbody></table>}
      <p className="mt-6 text-sm text-gray-600">{p.description}</p>
      <p className="mt-4 text-sm">Delivery: ৳60 inside city, Cash on Delivery available.</p>
    </div>
  </div>);
}
