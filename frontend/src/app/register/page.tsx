'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';
import { User, Smartphone, Mail, Lock } from 'lucide-react';
export default function Register(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState(''); const [mobile,setMobile]=useState(''); const [err,setErr]=useState(''); const [loading,setLoading]=useState(false); const router=useRouter();
  const submit=async(e:any)=>{
    e.preventDefault(); setErr(''); setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password, options:{ data:{ full_name:name, mobile } } });
    if(error){ setErr(error.message); setLoading(false); return; }
    if(data.user) await supabase.from('profiles').upsert({ id: data.user.id, full_name:name, email, mobile, role:'customer' });
    // prevent auto-login before OTP verify
    await supabase.auth.signOut(); localStorage.removeItem('token');
    // request OTP code via Budget Bazar Service Gmail (not link)
    try{ await api.post('/otp/request', { email, type:'signup' }); router.push(`/verify-otp?email=${encodeURIComponent(email)}`); }catch(e:any){ setErr('Signup ok but code send failed: '+(e.response?.data?.error||e.message)); router.push(`/verify-otp?email=${encodeURIComponent(email)}`); }
    setLoading(false);
  };
  return (<div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-navy via-[#0f1a30] to-navy p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border">
      <div className="text-center mb-6"><img src="/logo.png" alt="logo" className="w-16 h-16 mx-auto rounded-full border-2 border-gold object-cover" onError={(e:any)=>e.target.style.display='none'}/><h1 className="font-bold text-xl mt-2">Create Account</h1><p className="text-sm text-gray-500">Budget Bazar Service</p></div>
      <form onSubmit={submit} className="space-y-3">
        <div className="relative"><User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" className="w-full border rounded-xl pl-10 pr-3 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold focus:border-gold outline-none transition" required/></div>
        <div className="relative"><Smartphone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={mobile} onChange={e=>setMobile(e.target.value)} placeholder="01712 345 678" className="w-full border rounded-xl pl-10 pr-3 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"/></div>
        <div className="relative"><Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@gmail.com" type="email" className="w-full border rounded-xl pl-10 pr-3 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold focus:border-gold outline-none transition" required/></div>
        <div className="relative"><Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 6 characters" type="password" className="w-full border rounded-xl pl-10 pr-3 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold focus:border-gold outline-none transition" required/></div>
        {err && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">{err}</p>}
        <button type="submit" disabled={loading} className="w-full btn-gold py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">{loading?'Creating & Sending Code...':'Sign Up & Send Code'}</button>
      </form>
      <p className="text-sm mt-5 text-center">Already have account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link></p>
    </div>
  </div>);
}
