'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
export default function Reset(){
  const [pwd,setPwd]=useState(''); const [msg,setMsg]=useState(''); const [err,setErr]=useState(''); const router=useRouter();
  const submit=async(e:any)=>{
    e.preventDefault(); setErr(''); setMsg('');
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if(error) setErr(error.message); else { setMsg('Password updated! Login now.'); setTimeout(()=>router.push('/login'),1200); }
  };
  return (<div className="container-bb py-12 max-w-md mx-auto border rounded p-6 bg-white">
    <h1 className="font-bold text-lg mb-4">Set New Password</h1>
    <form onSubmit={submit} className="space-y-3">
      <input value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="New Password" type="password" className="w-full border rounded px-3 py-2" required/>
      {err && <p className="text-red-500 text-sm">{err}</p>}
      {msg && <p className="text-green-600 text-sm">{msg}</p>}
      <button type="submit" className="w-full bg-navy text-white py-2.5 rounded">Update Password</button>
    </form>
  </div>);
}
