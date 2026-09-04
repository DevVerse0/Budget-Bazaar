'use client';
import { useEffect, useState } from 'react';
import { useWishlistStore } from '@/store/wishlistStore';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
export default function WishlistPage(){
  const { ids, syncFromServer } = useWishlistStore();
  const [products,setProducts]=useState<any[]>([]);
  const [loading,setLoading]=useState(false);
  useEffect(()=>{ syncFromServer(); },[]);
  useEffect(()=>{
    if(ids.length===0){ setProducts([]); return; }
    setLoading(true);
    supabase.from('products').select('id,name,slug,sale_price,regular_price,brand,stock_quantity, product_images(image_url)').in('id', ids).then(({data})=>{
      if(data) setProducts(data);
      setLoading(false);
    });
  },[ids]);
  return (<div className="container-bb py-8">
    <h1 className="font-black text-xl">My Wishlist <span className="text-gray-500 font-normal">({ids.length})</span></h1>
    {loading && <p className="mt-4 text-sm text-gray-500">Loading...</p>}
    {!loading && ids.length===0 && <div className="mt-8 text-center border rounded-xl p-10 bg-white"><p className="text-gray-500">No items - Add products to wishlist ♥</p><Link href="/shop" className="inline-block mt-4 bg-gold px-6 py-2 rounded-xl font-bold">Browse Products</Link></div>}
    {!loading && products.length>0 && <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">{products.map((p:any)=><ProductCard key={p.id} p={{id:p.id, name:p.name, slug:p.slug, sale_price:p.sale_price, regular_price:p.regular_price, image:p.product_images?.[0]?.image_url, brand:p.brand, stock_quantity:p.stock_quantity}} />)}</div>}
  </div>);
}
