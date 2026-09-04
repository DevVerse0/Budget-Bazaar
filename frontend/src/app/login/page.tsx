'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trophy, ShieldCheck, Coins } from 'lucide-react';
import { api } from '@/services/api';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [agree,setAgree]=useState(true);
  const [err,setErr]=useState('');
  const [loading,setLoading]=useState(false);
  const router=useRouter();

  const submit=async(e:any)=>{
    e.preventDefault(); setErr('');
    if(!agree){ setErr('Please agree to Privacy Notice to continue'); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if(error){ setErr(error.message); setLoading(false); return; }
    // Block login until OTP verified
    const user = data.user;
    if(user && !user.email_confirmed_at){
      try{ await api.post('/otp/request', { email, type:'signup' }); }catch{}
      setErr('Please verify your email with OTP code sent to '+email);
      setLoading(false);
      setTimeout(()=> router.push(`/verify-otp?email=${encodeURIComponent(email)}`), 800);
      return;
    }
    if(data.session) localStorage.setItem('token', data.session.access_token);
    const token = data.session?.access_token;
    try{
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { headers: { Authorization:`Bearer ${token}` }});
      const j = await r.json();
      if(j.error && j.code==='EMAIL_NOT_VERIFIED'){ setErr(j.error); setLoading(false); router.push(`/verify-otp?email=${encodeURIComponent(email)}`); return; }
      if(j.profile?.role==='admin') router.push('/admin/dashboard');
      else router.push('/');
    }catch{ router.push('/'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#181A20] flex items-center">
      <div className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-8 lg:py-12 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* LEFT - Binance style promo */}
        <div className="text-white order-2 lg:order-1">
          <h1 className="text-3xl lg:text-4xl font-bold">Join me on <span className="text-gold">Budget Bazar</span></h1>
          <p className="text-gray-400 mt-2 text-sm">Best Gadgets, Best Prices — Trusted by thousands in Bangladesh</p>

          {/* Orbit illustration - like Binance */}
          <div className="relative flex items-center justify-center my-10 lg:my-14">
            <div className="relative w-48 h-48 lg:w-56 lg:h-56">
              {/* orbit rings */}
              <div className="absolute inset-0 rounded-full border border-gold/40" style={{transform:'rotate(-15deg)'}}/>
              <div className="absolute inset-2 rounded-full border border-gold/20" style={{transform:'rotate(25deg)'}}/>
              {/* arrows */}
              <div className="absolute -top-1 left-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-gold rotate-45 -translate-x-1/2"/>
              <div className="absolute -bottom-1 right-8 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-gold rotate-45"/>
              {/* center logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-[#1E2329] border border-gold/30 flex items-center justify-center shadow-[0_0_40px_rgba(245,184,0,0.15)] backdrop-blur">
                  <img src="/logo.png" alt="Budget Bazar Service" className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover bg-white p-1.5"/>
                </div>
              </div>
              {/* glow */}
              <div className="absolute inset-0 rounded-full bg-gold/5 blur-2xl -z-10"/>
            </div>
          </div>

          <div className="space-y-4 max-w-md mx-auto lg:mx-0">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0"><Trophy size={16} className="text-gold"/></div>
              <div>
                <p className="font-semibold text-sm">50,000+ Users Trust Budget Bazar</p>
                <p className="text-xs text-gray-400">Thousands of happy customers across Bangladesh</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0"><ShieldCheck size={16} className="text-gold"/></div>
              <div>
                <p className="font-semibold text-sm">No.1 In Gadgets & Customer Trust</p>
                <p className="text-xs text-gray-400">Best prices, warranty & fast delivery</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0"><Coins size={16} className="text-gold"/></div>
              <div>
                <p className="font-semibold text-sm">Secure Shopping & Safe Funds</p>
                <p className="text-xs text-gray-400">Cash on Delivery • Easy Returns • 24/7 Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - Binance style card */}
        <div className="order-1 lg:order-2">
          <div className="bg-[#1E2329]/80 backdrop-blur border border-[#2B3139] rounded-2xl p-6 lg:p-8 shadow-2xl max-w-[480px] mx-auto lg:ml-auto">
            {/* Logo header inside card */}
            <div className="flex items-center gap-2.5 mb-6">
              <img src="/logo.png" alt="Budget Bazar Service" className="w-10 h-10 rounded-full bg-white object-cover p-1 border border-gold/20"/>
              <span className="font-black tracking-tight leading-none">
                <span className="text-gold">BUDGET</span> <span className="text-white">BAZAR</span>
                <span className="block text-[10px] tracking-[0.3em] text-gold/80 font-bold -mt-0.5">SERVICE</span>
              </span>
            </div>

            <h2 className="text-[28px] font-bold text-white leading-none">Welcome to Budget Bazar</h2>
            <p className="text-sm text-gray-400 mt-2">Login to your account</p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-white">Email/Phone number</label>
                <input
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  placeholder="Email/Phone (without country code)"
                  type="email"
                  className="mt-1.5 w-full bg-[#2B3139]/50 border border-[#474D57] rounded-xl px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white">Password</label>
                <input
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  className="mt-1.5 w-full bg-[#2B3139]/50 border border-[#474D57] rounded-xl px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition text-sm"
                  required
                />
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer group">
                <input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-[#474D57] bg-[#2B3139] text-gold focus:ring-gold focus:ring-1 accent-gold"/>
                <span className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300">By logging in, I agree to Budget Bazar Service&apos;s <a href="#" className="text-white underline decoration-gray-500 hover:text-gold">Privacy Notice</a>.</span>
              </label>

              {err && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">{err}</p>}

              <button type="submit" disabled={loading} className="w-full bg-[#FCD535] hover:bg-[#F0B90B] text-black py-3.5 rounded-xl font-bold text-[15px] shadow-lg hover:shadow-xl transition disabled:opacity-60 disabled:cursor-not-allowed">
                {loading? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="h-px flex-1 bg-[#474D57]"/><span className="text-xs text-gray-400">or</span><div className="h-px flex-1 bg-[#474D57]"/>
            </div>

            <div className="space-y-3">
              <button onClick={()=>alert('Google login coming soon')} className="w-full bg-[#2B3139]/70 hover:bg-[#2B3139] border border-[#474D57] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-3 transition text-sm">
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>
              <button onClick={()=>alert('Apple login coming soon')} className="w-full bg-[#2B3139]/70 hover:bg-[#2B3139] border border-[#474D57] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-3 transition text-sm">
                <svg width="16" height="18" viewBox="0 0 384 512" fill="white"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.6 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                Continue with Apple
              </button>
              <button onClick={()=>alert('Telegram login coming soon')} className="w-full bg-[#2B3139]/70 hover:bg-[#2B3139] border border-[#474D57] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-3 transition text-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#2AABEE"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75l-2.2-1.63c-.97-.64-.34-1 .21-1.59l.03-.03 3.42-3.12c.15-.14-.02-.22-.23-.08l-4.22 2.66-1.81-.59c-.2-.06-.2-.2.04-.29l7.06-2.73c.13-.05.25-.02.35.1z"/></svg>
                Continue with Telegram
              </button>
            </div>

            <div className="flex justify-between items-center mt-6 text-sm">
              <Link href="/register" className="text-gold hover:underline font-medium">Sign up as an entity</Link>
              <span className="text-gray-500">or</span>
              <Link href="/register" className="text-gold hover:underline font-bold">Sign Up</Link>
            </div>
            <div className="text-center mt-3">
              <Link href="/forgot-password" className="text-xs text-gray-400 hover:text-gold">Forgot Password?</Link>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}
