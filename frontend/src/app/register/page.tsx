'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function Register(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState(''); const [mobile,setMobile]=useState(''); const [err,setErr]=useState(''); const [ok,setOk]=useState(''); const [loading,setLoading]=useState(false); const router=useRouter();
  const submit=async(e:any)=>{
    e.preventDefault(); setErr(''); setOk(''); setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password, options:{ data:{ full_name:name, mobile } } });
    if(error){ setErr(error.message); setLoading(false); return; }
    if(data.user) await supabase.from('profiles').upsert({ id: data.user.id, full_name:name, email, mobile, role:'customer' });
    setOk('Account created! Check email to confirm, then login.'); setLoading(false);
    setTimeout(()=>router.push('/login'),1500);
  };
  return (<div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-navy via-[#0f1a30] to-navy p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border">
      <div className="text-center mb-6"><div className="inline-flex items-center gap-2 font-bold text-lg"><span className="bg-gold text-navy px-2.5 py-1 rounded-lg">BB</span> BUDGET <span className="text-gold">BAZAR</span></div><h1 className="font-bold text-xl mt-3">Create Account</h1><p className="text-sm text-gray-500">Join Budget Bazar — Best Prices</p></div>
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gold outline-none" required/>
        <input value={mobile} onChange={e=>setMobile(e.target.value)} placeholder="Mobile 01..." className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gold outline-none"/>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gold outline-none" required/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (6+ chars)" type="password" className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gold outline-none" required/>
        {err && <p className="text-red-500 text-sm bg-red-50 border rounded-lg px-3 py-2">{err}</p>}
        {ok && <p className="text-green-600 text-sm bg-green-50 border rounded-lg px-3 py-2">{ok}</p>}
        <button type="submit" disabled={loading} className="w-full bg-gold hover:bg-yellow-500 text-navy py-3 rounded-xl font-bold shadow-lg transition disabled:opacity-50">{loading?'Creating...':'Sign Up'}</button>
      </form>
      <p className="text-sm mt-5 text-center">Already have account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link></p>
    </div>
  </div>);
}
