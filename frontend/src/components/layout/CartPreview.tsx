'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
export default function CartPreview(){
  const [open,setOpen]=useState(false); const { items } = useCartStore(); const count = items.reduce((a,b)=>a+b.qty,0); const subtotal = items.reduce((a,b)=>a+b.price*b.qty,0);
  return (<div className="relative" onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)}>
    <Link href="/cart" className="flex items-center gap-1.5 hover:text-gold transition relative"><ShoppingCart size={18}/><span className="hidden sm:inline text-sm">Cart</span>{count>0 && <span className="absolute -top-2 -right-2 bg-gold text-navy text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">{count}</span>}</Link>
    {open && items.length>0 && <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border p-3 z-50">
      {items.slice(0,3).map((i:any)=><div key={i.productId} className="flex gap-2 py-2 border-b text-sm"><img src={i.image} className="w-12 h-12 object-contain bg-gray-50 rounded"/>{i.name}<span className="ml-auto">x{i.qty}</span><span>৳{i.price}</span></div>)}
      <p className="text-sm font-semibold mt-2">Subtotal: ৳{subtotal}</p>
      <div className="flex gap-2 mt-3"><Link href="/cart" className="flex-1 border rounded-lg py-2 text-center text-sm">View Cart</Link><Link href="/checkout" className="flex-1 bg-gold text-navy rounded-lg py-2 text-center text-sm font-semibold">Checkout</Link></div>
    </div>}
  </div>);
}
