'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [err,setErr]=useState(''); const router=useRouter();
  const submit=async(e:any)=>{
    e.preventDefault(); setErr('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if(error){ setErr(error.message); return; }
    if(data.session) localStorage.setItem('token', data.session.access_token);
    const token = data.session?.access_token;
    try{
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` }});
      const j = await r.json();
      if(j.profile?.role==='admin') router.push('/admin/dashboard');
      else router.push('/');
    }catch{ router.push('/'); }
  };
  return (<div className="container-bb py-12 max-w-md mx-auto border rounded p-6 bg-white">
    <h1 className="font-bold text-lg mb-4">Login</h1>
    <form onSubmit={submit} className="space-y-3">
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded px-3 py-2" required/>
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border rounded px-3 py-2" required/>
      {err && <p className="text-red-500 text-sm">{err}</p>}
      <button type="submit" className="w-full bg-navy text-white py-2.5 rounded font-semibold">Login</button>
    </form>
    <div className="flex justify-between text-sm mt-4">
      <Link href="/forgot-password" className="text-blue-600">Forgot Password?</Link>
      <Link href="/register" className="text-blue-600">Create Account</Link>
    </div>
  </div>);
}
