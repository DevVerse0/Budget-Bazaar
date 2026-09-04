'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import Link from 'next/link';
import { Package, Truck, CreditCard } from 'lucide-react';
export default function MyOrders(){
  const [orders,setOrders]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    api.get('/orders/my').then(r=> setOrders(r.data||[])).catch(()=> setOrders([])).finally(()=> setLoading(false));
  },[]);
  if(loading) return (<div className="container-bb py-12 text-center"><div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin mx-auto"/><p className="text-sm text-gray-500 mt-2">Loading your orders...</p></div>);
  if(orders.length===0) return (<div className="container-bb py-12 text-center"><div className="max-w-md mx-auto bg-white border rounded-2xl p-8"><Package size={32} className="mx-auto text-gray-400"/><p className="font-bold mt-3">No orders yet</p><p className="text-sm text-gray-500">Your BBS orders will appear here</p><Link href="/shop" className="inline-block mt-4 bg-gold px-6 py-2 rounded-xl font-bold">Shop Now</Link></div></div>);
  return (<div className="container-bb py-6">
    <h1 className="font-black text-xl">My Orders <span className="text-gray-500 font-normal">({orders.length})</span></h1>
    <div className="mt-4 space-y-3">
      {orders.map(o=>(
        <div key={o.id} className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start gap-2">
            <div><p className="font-mono font-black text-navy">{o.order_number}</p><p className="text-xs text-gray-500">{new Date(o.created_at).toLocaleString()} • {o.district}</p></div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${o.status==='pending'?'bg-amber-100 text-amber-700': o.status==='delivered'?'bg-green-100 text-green-700':'bg-slate-100'}`}>{o.status}</span>
          </div>
          <div className="mt-3 space-y-1">
            {o.order_items?.map((it:any)=>(
              <div key={it.id} className="flex justify-between text-sm border-b py-1 last:border-0"><span>{it.product_name} × {it.quantity}</span><span className="font-semibold">৳{Number(it.subtotal).toLocaleString()}</span></div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-3 text-sm">
            <span className="flex items-center gap-1"><CreditCard size={12}/>{o.payment_method.toUpperCase()} {o.trx_id? `TRX:${o.trx_id}`:''}</span>
            <span className="flex items-center gap-1"><Truck size={12}/>৳{Number(o.delivery_charge).toLocaleString()}</span>
            <span className="font-black">Total ৳{Number(o.total).toLocaleString()}</span>
          </div>
          <div className="mt-3">
            <Link href={`/track-order?order=${o.order_number}`} className="text-xs text-blue-600 hover:underline">Track with BBS ID →</Link>
          </div>
        </div>
      ))}
    </div>
  </div>);
}
