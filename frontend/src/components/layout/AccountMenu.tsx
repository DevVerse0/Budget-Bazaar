'use client';
import { useEffect, useState } from 'react';
import { User, ChevronDown, UserRound, Package, Heart, Star, RotateCcw, LogOut } from 'lucide-react';
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
  const firstLetter = (profile?.full_name || user.email || 'U').trim()[0]?.toUpperCase() || 'U';
  return (<div className="relative">
    <button onClick={()=>setOpen(!open)} className="flex items-center gap-1.5 hover:text-gold transition">
      {profile?.avatar_url ? <img src={profile.avatar_url} className="w-7 h-7 rounded-full border border-white/20 object-cover"/> : <span className="w-7 h-7 rounded-full bg-gold text-navy flex items-center justify-center text-xs font-black border border-white/20">{firstLetter}</span>}
      <span className="hidden sm:inline text-sm max-w-[120px] truncate">{profile?.full_name || user.email?.split('@')[0]}</span><ChevronDown size={14}/></button>
    {open && <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border z-50 py-2 overflow-hidden" onMouseLeave={()=>setOpen(false)}>
      <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50 transition"><span className="w-7 h-7 flex items-center justify-center bg-amber-100 rounded-full"><UserRound size={14} className="text-amber-600"/></span> Manage My Account</Link>
      <Link href="/account/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50 transition"><span className="w-7 h-7 flex items-center justify-center bg-orange-100 rounded-full"><Package size={14} className="text-orange-600"/></span> My Orders</Link>
      <Link href="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50 transition"><span className="w-7 h-7 flex items-center justify-center bg-pink-100 rounded-full"><Heart size={14} className="text-pink-600"/></span> My Wishlist</Link>
      <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50 transition"><span className="w-7 h-7 flex items-center justify-center bg-sky-100 rounded-full"><Star size={14} className="text-sky-600"/></span> My Reviews</Link>
      <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50 transition"><span className="w-7 h-7 flex items-center justify-center bg-slate-100 rounded-full"><RotateCcw size={14} className="text-slate-600"/></span> My Returns & Cancellations</Link>
      <button onClick={async()=>{ await supabase.auth.signOut(); localStorage.removeItem('token'); location.href='/login'; }} className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50 transition"><span className="w-7 h-7 flex items-center justify-center bg-blue-100 rounded-full"><LogOut size={14} className="text-blue-600"/></span> Logout</button>
    </div>}
  </div>);
}
