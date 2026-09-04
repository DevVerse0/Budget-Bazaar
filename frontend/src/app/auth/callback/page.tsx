'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { api } from '@/services/api';
export default function AuthCallback(){
  const router = useRouter();
  const [msg,setMsg]=useState('Verifying Google login...');
  useEffect(()=>{
    (async()=>{
      const { data: { session }, error } = await supabase.auth.getSession();
      // If code in URL, exchange
      if(!session){
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        if(code){
          const { error: exErr } = await supabase.auth.exchangeCodeForSession(window.location.href);
          if(exErr){ setMsg('Google login failed: '+exErr.message); return; }
        }
      }
      const { data: { session: s2 } } = await supabase.auth.getSession();
      const user = s2?.user;
      if(!user){ setMsg('No session after Google. Redirecting to login...'); setTimeout(()=> router.push('/login'),1000); return; }
      // ensure profile exists with location fields
      const { data: prof } = await supabase.from('profiles').select('id').eq('id', user.id).single();
      if(!prof){
        await supabase.from('profiles').insert({ id:user.id, full_name:user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0], email:user.email, role:'customer' });
      }
      // if already verified, go home
      if(user.email_confirmed_at){
        router.push('/');
        return;
      }
      // not verified -> request OTP and go to verify
      setMsg(`Google accepted — OTP code sending to ${user.email}...`);
      try{ await api.post('/otp/request', { email:user.email, type:'signup' }); }catch{}
      // sign out so code verification required before login
      await supabase.auth.signOut(); localStorage.removeItem('token');
      setTimeout(()=> router.push(`/verify-otp?email=${encodeURIComponent(user.email||'')}`), 800);
    })();
  },[router]);
  return (<div className="min-h-[60vh] flex items-center justify-center"><div className="bg-white border rounded-2xl p-6 text-center shadow-sm max-w-md w-[90%]"><div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin mx-auto"/><p className="mt-3 font-semibold">{msg}</p><p className="text-xs text-gray-500 mt-1">Budget Bazar Service • Gmail login → OTP → Verify</p></div></div>);
}
