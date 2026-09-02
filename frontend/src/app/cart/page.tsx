'use client';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
export default function CartPage(){
  const { items, remove } = useCartStore();
  const subtotal = items.reduce((s,x)=>s+x.price*x.qty,0);
  if(items.length===0) return (<div className="container-bb py-12 text-center"><p className="font-semibold">Your cart is empty</p><Link href="/shop" className="inline-block mt-4 bg-gold px-6 py-2 rounded">Continue Shopping</Link></div>);
  return (<div className="container-bb py-6">
    <h1 className="font-bold text-lg mb-4">Shopping Cart</h1>
    {items.map(i=><div key={i.productId} className="flex gap-4 border-b py-3"><div className="flex-1">{i.name}</div><span>৳{i.price} x {i.qty}</span><button onClick={()=>remove(i.productId)} className="text-red-500">Remove</button></div>)}
    <div className="mt-4 text-right"><p>Subtotal: ৳{subtotal}</p><p>Shipping: ৳60</p><p className="font-bold">Total: ৳{subtotal+60}</p><Link href="/checkout" className="inline-block mt-4 bg-gold px-8 py-2 rounded font-semibold">Checkout</Link></div>
  </div>);
}
