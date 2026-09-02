'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
export default function AdminLogin(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [err,setErr]=useState(''); const router=useRouter();
  const submit=async(e:any)=>{
    e.preventDefault(); setErr('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if(error){ setErr(error.message); return; }
    const token = data.session?.access_token;
    if(token) localStorage.setItem('token', token);
    // verify admin
    try{
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { headers:{ Authorization:`Bearer ${token}` }});
      const j = await r.json();
      if(j.profile?.role!=='admin'){ setErr('❌ Admin only - ei account admin na. profiles e role=admin koro.'); await supabase.auth.signOut(); return; }
      router.push('/admin/dashboard');
    }catch(e:any){ setErr('Auth check failed'); }
  };
  return (<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <form onSubmit={submit} className="bg-white border rounded-xl p-6 w-full max-w-md">
      <h1 className="font-bold text-lg">Admin Login</h1><p className="text-sm text-gray-500 mb-4">Budget Bazar Admin Panel — separate from main site</p>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Admin Email" className="w-full border rounded px-3 py-2 mb-3" required/>
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border rounded px-3 py-2" required/>
      {err && <p className="text-red-500 text-sm mt-2">{err}</p>}
      <button type="submit" className="w-full mt-4 bg-navy text-white py-2.5 rounded font-semibold">Login to Dashboard</button>
      <p className="text-xs text-gray-400 mt-3 text-center">User ra /admin URL dileo login chara dhukte parbe na. Backend adminMiddleware + frontend guard.</p>
    </form>
  </div>);
}
