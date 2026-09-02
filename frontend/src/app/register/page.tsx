'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function Register(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState(''); const [mobile,setMobile]=useState(''); const [err,setErr]=useState(''); const [ok,setOk]=useState(''); const router=useRouter();
  const submit=async(e:any)=>{
    e.preventDefault(); setErr(''); setOk('');
    const { data, error } = await supabase.auth.signUp({ email, password, options:{ data:{ full_name:name, mobile } } });
    if(error){ setErr(error.message); return; }
    // create profile row (trigger may do, but ensure)
    if(data.user){
      await supabase.from('profiles').upsert({ id: data.user.id, full_name:name, email, mobile, role:'customer' });
    }
    setOk('Account created! Check email to confirm, then login.');
    setTimeout(()=>router.push('/login'),1500);
  };
  return (<div className="container-bb py-12 max-w-md mx-auto border rounded p-6 bg-white">
    <h1 className="font-bold text-lg mb-1">Create Account</h1><p className="text-sm text-gray-500 mb-4">Budget Bazar - Best Gadgets, Best Prices</p>
    <form onSubmit={submit} className="space-y-3">
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" className="w-full border rounded px-3 py-2" required/>
      <input value={mobile} onChange={e=>setMobile(e.target.value)} placeholder="Mobile (01...)" className="w-full border rounded px-3 py-2"/>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email (gmail)" type="email" className="w-full border rounded px-3 py-2" required/>
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (6+ chars)" type="password" className="w-full border rounded px-3 py-2" required/>
      {err && <p className="text-red-500 text-sm">{err}</p>}
      {ok && <p className="text-green-600 text-sm">{ok}</p>}
      <button type="submit" className="w-full bg-navy text-white py-2.5 rounded font-semibold">Sign Up</button>
    </form>
    <p className="text-sm mt-4 text-center">Already have account? <Link href="/login" className="text-blue-600">Login</Link></p>
  </div>);
}
