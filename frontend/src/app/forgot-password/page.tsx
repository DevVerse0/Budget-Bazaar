'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
export default function Forgot(){
  const [email,setEmail]=useState(''); const [msg,setMsg]=useState(''); const [err,setErr]=useState(''); const [loading,setLoading]=useState(false);
  const submit=async(e:any)=>{
    e.preventDefault(); setErr(''); setMsg(''); setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if(error) setErr(error.message); else setMsg('Password reset email sent! Check inbox & spam — from budgetbazaarservicebd@gmail.com');
    try{ await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) }); }catch{}
    setLoading(false);
  };
  return (<div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-navy via-[#0f1a30] to-navy p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border">
      <h1 className="font-bold text-xl text-center">Forgot Password</h1><p className="text-sm text-gray-500 text-center mb-6">We will send a reset link to your email</p>
      <form onSubmit={submit} className="space-y-4">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gold outline-none" required/>
        {err && <p className="text-red-500 text-sm bg-red-50 border rounded-lg px-3 py-2">{err}</p>}
        {msg && <p className="text-green-600 text-sm bg-green-50 border rounded-lg px-3 py-2">{msg}</p>}
        <button type="submit" disabled={loading} className="w-full bg-gold hover:bg-yellow-500 text-navy py-3 rounded-xl font-bold shadow transition">{loading?'Sending...':'Send Reset Link'}</button>
      </form>
      <p className="text-sm text-center mt-4"><Link href="/login" className="text-blue-600 hover:underline">Back to Login</Link></p>
    </div>
  </div>);
}
