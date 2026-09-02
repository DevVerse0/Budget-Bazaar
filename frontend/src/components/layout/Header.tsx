'use client';
import Link from 'next/link';
import { Search, ShoppingCart, Heart, User } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
export default function Header(){
  const [q,setQ]=useState(''); const cartCount = useCartStore(s=>s.items.length);
  return (<header className="sticky top-0 z-50">
    <div className="bg-navy text-white">
      <div className="container-bb flex items-center gap-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg"><img src="/logo.png" alt="Budget Bazar Service" className="w-10 h-10 rounded-full border-2 border-gold bg-white object-cover"/> BUDGET <span className="text-gold">BAZAR</span></Link>
        <div className="flex-1 max-w-xl mx-4 hidden md:flex">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search for gadgets, accessories..." className="flex-1 px-4 py-2 rounded-l-md text-slate-900 outline-none" />
          <button className="bg-gold text-navy px-6 rounded-r-md font-semibold">Search</button>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <Link href="/wishlist" className="flex items-center gap-1"><Heart size={18}/><span className="hidden sm:inline">Wishlist</span></Link>
          <Link href="/cart" className="flex items-center gap-1"><ShoppingCart size={18}/><span>Cart ({cartCount})</span></Link>
          <Link href="/login" className="hidden sm:flex items-center gap-1"><User size={18}/> Login</Link>
        </div>
      </div>
      <nav className="border-t border-white/10">
        <div className="container-bb flex gap-6 text-sm py-2 overflow-x-auto">
          <span className="bg-gold text-navy px-3 py-1 rounded font-semibold">≡ All Categories</span>
          <Link href="/">Home</Link><Link href="/shop">Shop</Link><Link href="/shop">Categories</Link><Link href="/shop">Deals</Link><Link href="#">About Us</Link><Link href="#">Contact Us</Link>
        </div>
      </nav>
    </div>
    <div className="md:hidden bg-white p-2 flex gap-2 border-b"><input placeholder="Search..." className="flex-1 border rounded px-3 py-2" /><button className="bg-gold px-4 rounded">Search</button></div>
  </header>);
}
