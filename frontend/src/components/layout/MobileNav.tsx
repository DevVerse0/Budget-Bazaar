'use client';
import Link from 'next/link';
import { Home, LayoutGrid, ShoppingCart, Heart, User } from 'lucide-react';
export default function MobileNav(){
  return (<nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50">
    <Link href="/" className="flex flex-col items-center text-xs"><Home size={20}/>Home</Link>
    <Link href="/shop" className="flex flex-col items-center text-xs"><LayoutGrid size={20}/>Categories</Link>
    <Link href="/cart" className="flex flex-col items-center text-xs"><ShoppingCart size={20}/>Cart</Link>
    <Link href="/wishlist" className="flex flex-col items-center text-xs"><Heart size={20}/>Wishlist</Link>
    <Link href="/account" className="flex flex-col items-center text-xs"><User size={20}/>Account</Link>
  </nav>);
}
