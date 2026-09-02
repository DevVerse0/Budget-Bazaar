'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
export default function CategoryDropdown(){
  const [open,setOpen]=useState(false); const [cats,setCats]=useState<any[]>([]);
  useEffect(()=>{ supabase.from('categories').select('*').eq('status','active').order('display_order').then(({data})=>data&&setCats(data)); },[]);
  return (<div className="relative" onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)}>
    <button onClick={()=>setOpen(!open)} className="bg-gold text-navy px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2">☰ All Categories</button>
    {open && <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border overflow-hidden z-50">
      {cats.map((c:any)=><Link key={c.id} href={`/shop?category=${c.slug}`} className="flex justify-between items-center px-4 py-2.5 hover:bg-gray-50 text-sm">
        <span className="flex items-center gap-2">{c.image_url && <img src={c.image_url} className="w-6 h-6 rounded object-cover"/>}{c.name}</span><ChevronRight size={14} className="text-gray-400"/>
      </Link>)}
      {cats.length===0 && <p className="p-4 text-sm text-gray-500">No categories — create via Admin</p>}
    </div>}
  </div>);
}
