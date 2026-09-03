'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
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
      <div className="text-center mb-6"><img src="/logo.png" alt="Budget Bazar Service" className="w-16 h-16 mx-auto rounded-full border-2 border-gold bg-white object-cover shadow"/><h1 className="font-bold text-xl mt-3">Welcome Back</h1><p className="text-sm text-gray-500">Budget Bazar Service</p></div>
      <form onSubmit={submit} className="space-y-4">
        <div><label className="text-sm font-medium">Email</label><div className="relative mt-1"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@gmail.com" type="email" className="w-full border rounded-xl pl-9 pr-3 py-3 focus:ring-2 focus:ring-gold focus:border-gold outline-none bg-gray-50 focus:bg-white transition" required/></div></div>
        <div><label className="text-sm font-medium">Password</label><div className="relative mt-1"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" type="password" className="w-full border rounded-xl pl-9 pr-3 py-3 focus:ring-2 focus:ring-gold focus:border-gold outline-none bg-gray-50 focus:bg-white transition" required/></div></div>
        {err && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">{err}</p>}
        <button type="submit" disabled={loading} className="w-full bg-navy hover:bg-black text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50">{loading?'Logging in...':'Login'}</button>
      </form>
      <div className="flex justify-between text-sm mt-6"><Link href="/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</Link><Link href="/register" className="text-blue-600 hover:underline font-medium">Create Account</Link></div>
    </div>
  </div>);
}
