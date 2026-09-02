'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
export default function AdminLayout({children}:{children:React.ReactNode}){
  const router = useRouter(); const pathname = usePathname();
  const [loading,setLoading]=useState(true); const [isAdmin,setIsAdmin]=useState(false);
  // allow /admin/login without check
  if(pathname==='/admin/login') return (<div>{children}</div>);
  useEffect(()=>{
    (async()=>{
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if(!token){ router.replace('/admin/login'); return; }
      try{
        const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { headers:{ Authorization:`Bearer ${token}` }});
        const j = await r.json();
        if(r.ok && j.profile?.role==='admin'){ setIsAdmin(true); } else { router.replace('/admin/login'); }
      }catch{ router.replace('/admin/login'); }
      finally{ setLoading(false); }
    })();
  },[router, pathname]);
  if(loading) return (<div className="min-h-screen flex items-center justify-center">Checking admin...</div>);
  if(!isAdmin) return null;
  return (<div className="flex min-h-screen">
    <aside className="w-60 bg-navy text-white p-4 hidden md:block space-y-1">
      <div className="font-bold mb-6">BUDGET BAZAR ADMIN</div>
      {['dashboard','products','categories','orders','customers','coupons','campaigns','banners','settings'].map(i=><Link key={i} href={`/admin/${i}`} className="block py-2 px-3 rounded hover:bg-white/10 capitalize">{i}</Link>)}
      <button onClick={async()=>{ await supabase.auth.signOut(); localStorage.removeItem('token'); location.href='/admin/login'; }} className="block w-full text-left py-2 px-3 rounded hover:bg-white/10 mt-4">Logout</button>
    </aside>
    <div className="flex-1 bg-gray-50 min-h-screen">{children}</div>
  </div>);
}
