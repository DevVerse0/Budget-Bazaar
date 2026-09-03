'use client';
import { useEffect, useState } from 'react';
import { User, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
export default function AccountMenu(){
  const [open,setOpen]=useState(false); const [user,setUser]=useState<any>(null); const [profile,setProfile]=useState<any>(null);
  useEffect(()=>{
    supabase.auth.getSession().then(async({data})=>{ setUser(data.session?.user||null); if(data.session?.user) { const {data: p}=await supabase.from('profiles').select('full_name,avatar_url').eq('id',data.session.user.id).single(); if(p) setProfile(p); } });
    const {data: {subscription}} = supabase.auth.onAuthStateChange(async(_e,s)=>{ setUser(s?.user||null); if(s?.user){ const {data:p}=await supabase.from('profiles').select('full_name,avatar_url').eq('id',s.user.id).single(); if(p) setProfile(p); }});
    return ()=>subscription.unsubscribe();
  },[]);
  if(!user) return (<Link href="/login" className="flex items-center gap-1.5 hover:text-gold transition"><User size={18}/> <span className="hidden sm:inline text-sm">Login</span></Link>);
  return (<div className="relative">
    <button onClick={()=>setOpen(!open)} className="flex items-center gap-1.5 hover:text-gold transition"><img src={profile?.avatar_url || `https://i.pravatar.cc/100?u=${user.email}`} className="w-7 h-7 rounded-full border border-white/20 object-cover"/><span className="hidden sm:inline text-sm max-w-[120px] truncate">{profile?.full_name || user.email?.split('@')[0]}</span><ChevronDown size={14}/></button>
    {open && <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border z-50 py-1" onMouseLeave={()=>setOpen(false)}>
      <Link href="/account" className="block px-4 py-2.5 text-sm text-slate-900 hover:bg-gray-50">My Account</Link>
      <Link href="/account" className="block px-4 py-2.5 text-sm text-slate-900 hover:bg-gray-50">My Orders</Link>
      <Link href="/wishlist" className="block px-4 py-2.5 text-sm text-slate-900 hover:bg-gray-50">Wishlist</Link>
      <Link href="/account" className="block px-4 py-2.5 text-sm text-slate-900 hover:bg-gray-50">Account Settings</Link>
      <div className="border-t mt-1 pt-1"><button onClick={async()=>{ await supabase.auth.signOut(); localStorage.removeItem('token'); location.href='/login'; }} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50">Logout</button></div>
    </div>}
  </div>);
}
