'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
export default function AdminLogin(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [err,setErr]=useState(''); const [loading,setLoading]=useState(false); const router=useRouter();
  const submit=async(e:any)=>{
    e.preventDefault(); setErr(''); setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if(error){ setErr(error.message); setLoading(false); return; }
    const token = data.session?.access_token; if(token) localStorage.setItem('token', token);
    try{
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { headers:{ Authorization:`Bearer ${token}` }});
      const j = await r.json();
      if(j.profile?.role!=='admin'){ setErr('❌ Admin only - ei account admin na. profiles e role=admin koro.'); await supabase.auth.signOut(); setLoading(false); return; }
      router.push('/admin/dashboard');
    }catch{ setErr('Auth check failed'); setLoading(false); }
  };
  return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-[#0f1a30] to-navy p-4">
    <form onSubmit={submit} className="bg-white border rounded-2xl p-8 w-full max-w-md shadow-2xl">
      <div className="text-center mb-6"><span className="bg-navy text-gold px-3 py-1 rounded-lg font-bold">ADMIN</span><h1 className="font-bold text-xl mt-3">Budget Bazar Admin</h1><p className="text-sm text-gray-500">Separate panel — not for customers</p></div>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Admin Email" className="w-full border rounded-lg px-3 py-2.5 mb-3 focus:ring-2 focus:ring-gold outline-none" required/>
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gold outline-none" required/>
      {err && <p className="text-red-600 text-sm bg-red-50 border rounded-lg px-3 py-2 mt-3">{err}</p>}
      <button type="submit" disabled={loading} className="w-full mt-4 bg-navy hover:bg-black text-white py-3 rounded-xl font-semibold shadow">{loading?'Logging in...':'Login to Dashboard'}</button>
    </form>
  </div>);
}
