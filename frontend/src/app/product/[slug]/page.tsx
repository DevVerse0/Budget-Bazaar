'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react';
export default function ProductPage({params}:{params:{slug:string}}){
  const [p,setP]=useState<any>(null); const [idx,setIdx]=useState(0); const [qty,setQty]=useState(1); const [toast,setToast]=useState('');
  const add = useCartStore(s=>s.add);
  useEffect(()=>{ supabase.from('products').select('*, product_images(*), categories(name), product_specifications(value, specification_definitions(name))').eq('slug', params.slug).single().then(({data})=>setP(data)); },[params.slug]);
  useEffect(()=>{ if(toast){ const t=setTimeout(()=>setToast(''),2500); return ()=>clearTimeout(t);} },[toast]);
  if(!p) return (<div className="container-bb py-10 text-center text-sm">Loading...</div>);
  const images = p.product_images || [];
  const main = images[idx]?.image_url;
  const disc = p.regular_price && p.sale_price ? Math.round((1 - p.sale_price/p.regular_price)*100) : 0;
  const handleAdd = () => {
    add({productId:p.id, name:p.name, price: p.sale_price||p.regular_price, qty, image: main});
    setToast(`${p.name} • ${qty} × ৳${(p.sale_price||p.regular_price).toLocaleString()} added to cart`);
  };
  const handleBuy = () => {
    add({productId:p.id, name:p.name, price: p.sale_price||p.regular_price, qty, image: main});
    location.href='/checkout';
  };
  return (<div className="container-bb py-6 grid md:grid-cols-2 gap-8">
    <div>
      <div className="border rounded-xl p-4 bg-white h-96 lg:h-[520px] flex items-center justify-center overflow-hidden shadow-sm">{main ? <img src={main} className="max-h-full max-w-full object-contain" alt={p.name}/> : <span className="text-gray-400">No Image</span>}</div>
      <div className="flex gap-2 mt-3 flex-wrap">{images.map((im:any,i:number)=><button key={im.id} onClick={()=>setIdx(i)} className={`border rounded-lg p-1.5 bg-white ${i===idx?'border-gold ring-1 ring-gold':''}`}><img src={im.image_url} className="w-16 h-16 object-cover rounded" alt="thumb"/></button>)}</div>
    </div>
    <div>
      <h1 className="text-xl lg:text-2xl font-black leading-tight">{p.name}</h1>
      <p className="text-sm text-gray-500 mt-1">{p.brand} • {p.categories?.name}</p>
      <div className="mt-3 text-2xl font-black text-navy">৳{(p.sale_price||p.regular_price).toLocaleString()} {p.sale_price && <><span className="line-through text-gray-400 text-base font-normal">৳{p.regular_price.toLocaleString()}</span> {disc>0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2 align-middle">{disc}% OFF</span>}</>}</div>
      <p className={`text-sm mt-1 font-semibold ${p.stock_quantity===0?'text-red-500':'text-green-600'}`}>{p.stock_quantity===0?'OUT OF STOCK':`In Stock: ${p.stock_quantity}`}</p>
      <div className="flex items-center gap-3 mt-6">
        <div className="flex items-center border rounded-xl bg-gray-50">
          <button onClick={()=>setQty(Math.max(1,qty-1))} className="px-3.5 py-2.5 hover:bg-white rounded-l-xl transition"><Minus size={14}/></button>
          <span className="w-10 text-center font-bold">{qty}</span>
          <button onClick={()=>setQty(Math.min(p.stock_quantity||99, qty+1))} className="px-3.5 py-2.5 hover:bg-white rounded-r-xl transition"><Plus size={14}/></button>
        </div>
        <button disabled={p.stock_quantity===0} onClick={handleAdd} className="flex-1 bg-navy hover:bg-black text-white py-3 rounded-xl font-bold shadow hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-40"><ShoppingCart size={16}/> Add to Cart</button>
        <button disabled={p.stock_quantity===0} onClick={handleBuy} className="flex-1 bg-gold hover:bg-[#E6A800] py-3 rounded-xl font-black disabled:opacity-40 shadow">Buy Now</button>
      </div>
      <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-navy hover:underline mt-3">View Cart →</Link>
      {p.product_specifications?.length>0 && <table className="w-full mt-6 text-sm border rounded-xl overflow-hidden"><tbody>{p.product_specifications.map((s:any)=><tr key={s.specification_definitions.name} className="border-b last:border-0"><td className="p-2.5 bg-gray-50 w-1/2 font-medium">{s.specification_definitions.name}</td><td className="p-2.5">{s.value}</td></tr>)}</tbody></table>}
      <p className="mt-6 text-sm text-gray-600 leading-relaxed">{p.description}</p>
      <p className="mt-4 text-sm bg-gold/10 border border-gold/20 rounded-xl px-3 py-2">🚚 Delivery: ৳60 inside city • Cash on Delivery available • 24/7 Support</p>
    </div>
    {/* Premium toast - replaces alert */}
    {toast && <div className="fixed bottom-5 right-5 z-50 bg-navy text-white px-4 py-3 rounded-xl shadow-2xl border border-white/10 flex items-center gap-3 max-w-[92vw] lg:max-w-md animate-[slideIn_0.2s_ease]">
      <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center shrink-0"><Check size={16} className="text-white"/></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold leading-none">Added to Cart</p>
        <p className="text-xs text-gray-300 truncate mt-1">{toast}</p>
      </div>
      <Link href="/cart" className="shrink-0 bg-gold text-navy px-3 py-1.5 rounded-lg text-xs font-black">View</Link>
    </div>}
    <style>{`@keyframes slideIn{from{transform:translateY(8px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
  </div>);
}
