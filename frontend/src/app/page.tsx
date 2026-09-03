'use client';
import { AirVent, BatteryCharging, CookingPot, Plane, Video, Tablet, Tv, Refrigerator, Smartphone, Cable, HardDrive, Camera, Scissors, Watch, Headphones, Flashlight, Truck, BadgeCheck, PiggyBank, Headset } from 'lucide-react';
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
    <section className="hero-gradient text-white relative overflow-hidden">
      <div className="container-bb py-10 md:py-16 grid md:grid-cols-2 gap-8 items-center">
        <div className="animate-[float_6s_ease-in-out_infinite]"><h1 className="text-3xl md:text-5xl font-bold leading-tight">Best Gadgets<br/>Best <span className="text-gold">Prices</span></h1><p className="mt-3 text-white/80 text-sm">Find the latest gadgets at unbeatable prices only on Budget Bazar.</p><a href="/shop" className="inline-block mt-6 btn-gold px-8 py-3 rounded-xl font-bold">Shop Now →</a></div>
        <div className="bg-white/10 backdrop-blur rounded-2xl h-64 md:h-80 flex items-center justify-center text-white/60 border border-white/10 shadow-2xl animate-[float_4s_ease-in-out_infinite]">Hero Gadgets</div>
      </div>
    </section>
    <section className="container-bb grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {[
        {t:'Fast Delivery',d:'Within 24-48 Hours',I:Truck},
        {t:'Best Quality',d:'100% Original Products',I:BadgeCheck},
        {t:'Best Price',d:'Unbeatable Guarantee',I:PiggyBank},
        {t:'Support 24/7',d:"We're Here to Help",I:Headset},
      ].map(s=><div key={s.t} className="border rounded-xl p-4 bg-white flex gap-3 items-center hover:shadow-md transition card-hover"><span className="w-10 h-10 flex items-center justify-center bg-gold/15 rounded-xl text-navy"><s.I size={20} className="stroke-[1.7]"/></span><div><p className="text-sm font-semibold">{s.t}</p><p className="text-xs text-gray-500">{s.d}</p></div></div>)}
    </section>
    <section className="bg-[#f1f5f9] py-8 mt-8">
      <div className="container-bb">
        <h2 className="font-bold text-xl text-center">Featured Category</h2>
        <p className="text-sm text-gray-600 text-center mb-6">Get Your Desired Product from Featured Category!</p>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {[
            {name:'AC',slug:'ac',I:AirVent}, {name:'Portable Power Station',slug:'portable-power-station',I:BatteryCharging}, {name:'Air Fryer',slug:'air-fryer',I:CookingPot}, {name:'Drone',slug:'drone',I:Plane}, {name:'Gimbal',slug:'gimbal',I:Video}, {name:'Table PC',slug:'table-pc',I:Tablet}, {name:'TV',slug:'tv',I:Tv}, {name:'Fridge',slug:'fridge',I:Refrigerator},
            {name:'Mobile Phone',slug:'mobile-phone',I:Smartphone}, {name:'Mobile Accessories',slug:'mobile-accessories',I:Cable}, {name:'Portable SSD',slug:'portable-ssd',I:HardDrive}, {name:'WiFi Camera',slug:'wifi-camera',I:Camera}, {name:'Trimmer',slug:'trimmer',I:Scissors}, {name:'Smart Watch',slug:'smart-watch',I:Watch}, {name:'Earbuds',slug:'earbuds',I:Headphones}, {name:'Torch Light',slug:'torch-light',I:Flashlight},
          ].map(c=><a key={c.slug} href={`/shop?category=${c.slug}`} className="bg-white rounded-2xl p-5 text-center shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all border border-transparent hover:border-gold/20 group">
            <c.I className="w-9 h-9 mx-auto text-slate-600 group-hover:text-gold transition stroke-[1.5]" />
            <p className="mt-3 text-xs font-medium leading-tight text-slate-800">{c.name}</p>
          </a>)}
        </div>
      </div>
    </section>
    <section className="container-bb mt-8">
      <div className="flex justify-between items-center mb-4"><h2 className="font-bold">Popular Products</h2><a href="/shop" className="text-sm text-blue-600">View All</a></div>
      {products.length===0 ? <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[1,2,3,4].map(i=><div key={i} className="border rounded-xl p-3 bg-white"><div className="skeleton h-40 rounded-lg"/><div className="skeleton h-4 mt-3 rounded"/><div className="skeleton h-4 mt-2 w-1/2 rounded"/></div>)}</div> : <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{products.map((p:any)=><ProductCard key={p.id} p={{name:p.name, slug:p.slug, sale_price:p.sale_price, regular_price:p.regular_price, image:p.product_images?.[0]?.image_url, brand:p.brand, stock_quantity:p.stock_quantity}} />)}</div>}
    </section>
  </div>);
}
