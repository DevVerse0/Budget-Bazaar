'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
export default function Reset(){
  const [pwd,setPwd]=useState(''); const [msg,setMsg]=useState(''); const [err,setErr]=useState(''); const [loading,setLoading]=useState(false); const router=useRouter();
  const submit=async(e:any)=>{
    e.preventDefault(); setErr(''); setMsg(''); setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if(error) setErr(error.message); else { setMsg('Password updated! Redirecting...'); setTimeout(()=>router.push('/login'),1200); }
    setLoading(false);
  };
  return (<div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-navy via-[#0f1a30] to-navy p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border">
      <h1 className="font-bold text-xl text-center mb-6">Set New Password</h1>
      <form onSubmit={submit} className="space-y-4">
        <input value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="New Password (6+)" type="password" className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gold outline-none" required/>
        {err && <p className="text-red-500 text-sm bg-red-50 border rounded-lg px-3 py-2">{err}</p>}
        {msg && <p className="text-green-600 text-sm bg-green-50 border rounded-lg px-3 py-2">{msg}</p>}
        <button type="submit" disabled={loading} className="w-full bg-navy hover:bg-black text-white py-3 rounded-xl font-semibold shadow">{loading?'Updating...':'Update Password'}</button>
      </form>
    </div>
  </div>);
}
