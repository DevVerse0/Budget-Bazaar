'use client';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
export default function CartPage(){
  const { items, remove, updateQty } = useCartStore();
  const subtotal = items.reduce((s,x)=>s+x.price*x.qty,0);
  if(items.length===0) return (<div className="container-bb py-16 text-center">
    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4"><ShoppingBag size={28} className="text-gray-400"/></div>
    <p className="font-bold text-lg">Your cart is empty</p>
    <p className="text-sm text-gray-500 mt-1">Add products to see them here</p>
    <Link href="/shop" className="inline-block mt-6 bg-gold px-8 py-2.5 rounded-xl font-bold shadow">Continue Shopping</Link>
  </div>);
  return (<div className="container-bb py-6">
    <h1 className="font-black text-xl lg:text-2xl mb-1">Shopping Cart</h1>
    <p className="text-sm text-gray-500 mb-5">{items.length} {items.length===1?'item':'items'} in your cart</p>
    <div className="grid lg:grid-cols-[1fr_380px] gap-6">
      <div className="space-y-3">
        {items.map(i=><div key={i.productId} className="flex gap-4 bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
          <Link href={`/product/${i.productId}`} className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-50 rounded-xl border flex items-center justify-center shrink-0 overflow-hidden">
            {i.image ? <img src={i.image} className="w-full h-full object-contain p-1" alt={i.name}/> : <span className="text-xs text-gray-400">No Image</span>}
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/product/${i.productId}`} className="font-semibold text-sm lg:text-base line-clamp-2 hover:text-navy">{i.name}</Link>
            <p className="text-gold font-bold mt-1">৳{i.price.toLocaleString()} <span className="text-gray-400 font-normal text-xs">x {i.qty}</span></p>
            <p className="text-xs text-gray-500 mt-0.5">Total: ৳{(i.price*i.qty).toLocaleString()}</p>
          </div>
          <div className="flex flex-col items-end justify-between">
            <button onClick={()=>remove(i.productId)} className="text-gray-400 hover:text-red-500 p-1 transition" title="Remove"><Trash2 size={18}/></button>
            <div className="flex items-center border rounded-lg bg-gray-50">
              <button onClick={()=>updateQty(i.productId, i.qty-1)} className="p-2 hover:bg-white rounded-l-lg transition"><Minus size={14}/></button>
              <span className="w-9 text-center font-bold text-sm">{i.qty}</span>
              <button onClick={()=>updateQty(i.productId, i.qty+1)} className="p-2 hover:bg-white rounded-r-lg transition"><Plus size={14}/></button>
            </div>
          </div>
        </div>)}
      </div>
      <div className="lg:sticky lg:top-24 h-fit">
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-base mb-4">Order Summary</h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal ({items.reduce((a,b)=>a+b.qty,0)} items)</span><span className="font-semibold">৳{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-semibold text-green-600">৳60</span></div>
            <div className="h-px bg-gray-100 my-2"/>
            <div className="flex justify-between text-base font-black"><span>Total</span><span className="text-navy">৳{(subtotal+60).toLocaleString()}</span></div>
            <p className="text-xs text-gray-500">Cash on Delivery available</p>
          </div>
          <Link href="/checkout" className="mt-5 flex items-center justify-center gap-2 bg-gold hover:bg-[#E6A800] text-navy py-3 rounded-xl font-bold shadow transition text-center">Proceed to Checkout</Link>
          <Link href="/shop" className="mt-3 block text-center text-sm text-gray-600 hover:text-navy">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  </div>);
}
