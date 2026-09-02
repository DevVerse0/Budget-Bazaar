'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
export default function Forgot(){
  const [email,setEmail]=useState(''); const [msg,setMsg]=useState(''); const [err,setErr]=useState('');
  const submit=async(e:any)=>{
    e.preventDefault(); setErr(''); setMsg('');
    // Try Supabase first
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if(error) setErr(error.message);
    else setMsg('Password reset email sent! Check inbox (also spam). Gmail: budgetbazaarservicebd@gmail.com via SMTP');
    // also try backend SMTP as fallback
    try{ await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) }); }catch{}
  };
  return (<div className="container-bb py-12 max-w-md mx-auto border rounded p-6 bg-white">
    <h1 className="font-bold text-lg mb-1">Forgot Password</h1><p className="text-sm text-gray-500 mb-4">Enter your email, we will send reset link</p>
    <form onSubmit={submit} className="space-y-3">
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full border rounded px-3 py-2" required/>
      {err && <p className="text-red-500 text-sm">{err}</p>}
      {msg && <p className="text-green-600 text-sm">{msg}</p>}
      <button type="submit" className="w-full bg-gold py-2.5 rounded font-semibold">Send Reset Link</button>
    </form>
  </div>);
}
