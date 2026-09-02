'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
export default function MobileMenu(){
  const [open,setOpen]=useState(false);
  return (<>
    <button onClick={()=>setOpen(!open)} className="md:hidden p-2"><Menu size={20}/></button>
    {open && <><div className="fixed inset-0 bg-black/50 z-40" onClick={()=>setOpen(false)}/><div className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-6"><span className="font-bold">BUDGET BAZAR</span><button onClick={()=>setOpen(false)}><X size={20}/></button></div>
      <nav className="space-y-1">
        {['Home','Shop','Categories','New Arrivals','Deals','Wishlist','My Orders','About Us','Contact Us'].map(i=><Link key={i} href={i==='Home'?'/':'/shop'} onClick={()=>setOpen(false)} className="block py-2.5 px-3 rounded-lg hover:bg-gray-50 text-sm">{i}</Link>)}
      </nav>
    </div></>}
  </>);
}
