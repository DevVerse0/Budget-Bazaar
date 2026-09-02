'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/services/api';
export default function Verify(){
  const sp = useSearchParams(); const emailParam = sp.get('email') || '';
  const [email,setEmail]=useState(emailParam); const [code,setCode]=useState(''); const [msg,setMsg]=useState(''); const [err,setErr]=useState(''); const router=useRouter();
  const submit=async(e:any)=>{
    e.preventDefault(); setErr(''); setMsg('');
    try{ await api.post('/otp/verify', { email, code, type:'signup' }); setMsg('Verified! Redirecting to login...'); setTimeout(()=>router.push('/login'),1000); }catch(e:any){ setErr(e.response?.data?.error || 'Invalid code'); }
  };
  const resend=async()=>{ try{ await api.post('/otp/request', { email, type:'signup' }); setMsg('Code resent to '+email); }catch(e:any){ setErr('Resend failed'); } };
  return (<div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-navy via-[#0f1a30] to-navy p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border text-center">
      <img src="/logo.png" alt="Budget Bazar Service" className="w-20 h-20 mx-auto rounded-full border-4 border-gold object-cover" onError={(e:any)=>e.target.style.display='none'}/>
      <h1 className="font-bold text-xl mt-3">Verify Email</h1><p className="text-sm text-gray-500">Code sent from <b>Budget Bazar Service</b> to</p><p className="text-sm font-mono">{email||'your email'}</p>
      <form onSubmit={submit} className="space-y-4 mt-6">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-lg px-3 py-2.5" required/>
        <input value={code} onChange={e=>setCode(e.target.value)} placeholder="6-digit code" maxLength={6} className="w-full border rounded-lg px-3 py-3 text-center text-2xl tracking-[0.5em] font-bold" required/>
        {err && <p className="text-red-600 text-sm bg-red-50 border rounded-lg px-3 py-2">{err}</p>}
        {msg && <p className="text-green-600 text-sm bg-green-50 border rounded-lg px-3 py-2">{msg}</p>}
        <button type="submit" className="w-full bg-navy hover:bg-black text-white py-3 rounded-xl font-semibold">Verify Code</button>
        <button type="button" onClick={resend} className="w-full border py-2.5 rounded-xl text-sm">Resend Code</button>
      </form>
    </div>
  </div>);
}
