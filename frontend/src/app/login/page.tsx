'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [err,setErr]=useState(''); const [loading,setLoading]=useState(false); const router=useRouter();
  const submit=async(e:any)=>{
    e.preventDefault(); setErr(''); setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if(error){ setErr(error.message); setLoading(false); return; }
    if(data.session) localStorage.setItem('token', data.session.access_token);
    const token = data.session?.access_token;
    try{
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { headers: { Authorization:`Bearer ${token}` }});
      const j = await r.json();
      if(j.profile?.role==='admin') router.push('/admin/dashboard');
      else router.push('/');
    }catch{ router.push('/'); }
    setLoading(false);
  };
  return (<div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-navy via-[#0f1a30] to-navy p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border">
      <div className="text-center mb-6"><div className="inline-flex items-center gap-2 font-bold text-lg"><span className="bg-gold text-navy px-2.5 py-1 rounded-lg">BB</span> BUDGET <span className="text-gold">BAZAR</span></div><h1 className="font-bold text-xl mt-3">Welcome Back</h1><p className="text-sm text-gray-500">Login to your account</p></div>
      <form onSubmit={submit} className="space-y-4">
        <div><label className="text-sm font-medium">Email</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@gmail.com" type="email" className="w-full mt-1 border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gold outline-none" required/></div>
        <div><label className="text-sm font-medium">Password</label><input value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" type="password" className="w-full mt-1 border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gold outline-none" required/></div>
        {err && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</p>}
        <button type="submit" disabled={loading} className="w-full bg-navy hover:bg-black text-white py-3 rounded-xl font-semibold shadow-lg transition disabled:opacity-50">{loading?'Logging in...':'Login'}</button>
      </form>
      <div className="flex justify-between text-sm mt-5"><Link href="/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</Link><Link href="/register" className="text-blue-600 hover:underline">Create Account</Link></div>
    </div>
  </div>);
}
