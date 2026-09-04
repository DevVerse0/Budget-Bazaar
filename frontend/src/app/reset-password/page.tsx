'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
export default function Reset(){
  const [pwd,setPwd]=useState(''); const [msg,setMsg]=useState(''); const [err,setErr]=useState(''); const [loading,setLoading]=useState(false); const [ready,setReady]=useState(false); const router=useRouter();
  useEffect(()=>{
    // Supabase reset link contains code or access_token - exchange for session
    const hash = window.location.hash;
    const url = window.location.href;
    supabase.auth.getSession().then(async({data})=>{
      if(data.session){ setReady(true); return; }
      // try exchange code from URL (PKCE)
      if(url.includes('code=')){
        const { error } = await supabase.auth.exchangeCodeForSession(url);
        if(error) setErr('Link expired or invalid. Request new reset link.'); else setReady(true);
        return;
      }
      // try hash fragment
      if(hash.includes('access_token')){
        // supabase will auto set session from hash, wait a bit
        setTimeout(async()=>{
          const { data: s2 } = await supabase.auth.getSession();
          if(s2.session) setReady(true); else setErr('Auth session missing! Please click reset link again from email (Gmail beautiful template).');
        }, 500);
        return;
      }
      setErr('Auth session missing! Open the reset link from your Gmail (Budget Bazar Service) again.');
    });
  },[]);
  const submit=async(e:any)=>{
    e.preventDefault(); setErr(''); setMsg(''); setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if(error) setErr(error.message); else { setMsg('Password updated! Redirecting to login...'); setTimeout(()=>router.push('/login'),1200); }
    setLoading(false);
  };
  return (<div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-navy via-[#0f1a30] to-navy p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border">
      <h1 className="font-bold text-xl text-center mb-6">Set New Password</h1>
      {!ready && !err && <p className="text-sm text-gray-500 text-center animate-pulse">Verifying reset link...</p>}
      <form onSubmit={submit} className="space-y-4">
        <input value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="New Password (6+)" type="password" className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gold outline-none" required disabled={!ready}/>
        {err && <p className="text-red-500 text-sm bg-red-50 border rounded-lg px-3 py-2">{err}</p>}
        {msg && <p className="text-green-600 text-sm bg-green-50 border rounded-lg px-3 py-2">{msg}</p>}
        <button type="submit" disabled={loading || !ready} className="w-full bg-navy hover:bg-black text-white py-3 rounded-xl font-semibold shadow disabled:opacity-50">{loading?'Updating...':'Update Password'}</button>
      </form>
    </div>
  </div>);
}
