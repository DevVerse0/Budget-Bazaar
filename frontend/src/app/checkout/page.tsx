'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { orderService } from '@/services/order.service';
import { api } from '@/services/api';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
const schema = z.object({ customer_name:z.string().min(2,'Name required'), mobile:z.string().min(11,'Valid mobile required'), district:z.string().min(1,'District required'), full_address:z.string().min(5,'Address required') });
export default function Checkout(){
  const { register, handleSubmit, formState:{errors} } = useForm({ resolver: zodResolver(schema) });
  const { items, clear } = useCartStore(); const router = useRouter();
  const [coupon,setCoupon]=useState(''); const [discount,setDiscount]=useState(0); const [couponMsg,setCouponMsg]=useState(''); const [applying,setApplying]=useState(false);
  const [verifyMsg,setVerifyMsg]=useState(''); const [verifyEmail,setVerifyEmail]=useState(''); const [checking,setChecking]=useState(true); const [needLogin,setNeedLogin]=useState(false);
  useEffect(()=>{
    supabase.auth.getSession().then(async({data})=>{
      const user = data.session?.user;
      if(!user){
        setNeedLogin(true);
        setVerifyMsg('Please login to place order. You must be logged in to shop.');
        setChecking(false);
        return;
      }
      if(!user.email_confirmed_at){
        setVerifyMsg('Please verify your email with OTP before shopping. Code sent to '+user.email);
        setVerifyEmail(user.email||'');
        try{ await api.post('/otp/request', { email:user.email, type:'signup' }); }catch{}
      }
      setChecking(false);
    });
  },[]);
  const subtotal = items.reduce((s,a)=>s+a.price*a.qty,0);
  const delivery = 60;
  const total = Math.max(0, subtotal + delivery - discount);
  const applyCoupon = async ()=>{
    if(!coupon.trim()) return;
    setApplying(true); setCouponMsg('');
    try{
      const r = await api.post('/coupons/validate', { code:coupon.trim(), subtotal });
      if(r.data.valid){ setDiscount(Number(r.data.discount)); setCouponMsg(`✓ Coupon applied: -৳${Number(r.data.discount).toLocaleString()}`); }
    }catch(e:any){ setDiscount(0); setCouponMsg(e.response?.data?.error || 'Invalid coupon'); }
    setApplying(false);
  };
  const removeCoupon = ()=>{ setCoupon(''); setDiscount(0); setCouponMsg(''); };
  const [placing,setPlacing]=useState(false);
  const onSubmit = async (data:any)=>{
    if(items.length===0) return alert('Cart empty');
    // block guest / unverified
    const { data: sess } = await supabase.auth.getSession();
    const u = sess.session?.user;
    if(!u){
      alert('Please login to place order');
      router.push(`/login?next=/checkout`);
      return;
    }
    if(!u.email_confirmed_at){
      alert('Please verify your email with OTP before shopping. Check '+u.email);
      router.push(`/verify-otp?email=${encodeURIComponent(u.email||'')}`);
      return;
    }
    setPlacing(true);
    const payload = { ...data, items: items.map(i=>({productId:i.productId, quantity:i.qty})), payment_method:'cod', couponCode: discount>0? coupon.trim() : undefined };
    try{ const res= await orderService.create(payload); clear(); router.push(`/order-success?order=${res.order.order_number}`);} catch(e:any){
      const msg = e.response?.data?.error || 'Order failed';
      if(e.response?.data?.code==='EMAIL_NOT_VERIFIED'){
        alert(msg);
        const { data: s } = await supabase.auth.getSession();
        router.push(`/verify-otp?email=${encodeURIComponent(s.session?.user?.email||data.mobile||'')}`);
        setPlacing(false);
        return;
      }
      if(e.response?.data?.code==='LOGIN_REQUIRED'){
        alert(msg);
        router.push('/login');
        setPlacing(false);
        return;
      }
      alert(msg);
      setPlacing(false);
    }
  };
  if(checking) return (<div className="container-bb py-12 text-center text-sm flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin"/> Checking verification...</div>);
  if(verifyMsg) return (<div className="container-bb py-12 text-center">
    <div className="max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-xl p-6"><p className="font-bold text-amber-900">{needLogin?'Login Required':'Email Verification Required'}</p><p className="text-sm text-amber-800 mt-2">{verifyMsg}</p>{needLogin ? <Link href="/login" className="inline-block mt-4 bg-navy text-white px-6 py-2 rounded-xl font-bold">Go to Login</Link> : <Link href={`/verify-otp?email=${encodeURIComponent(verifyEmail)}`} className="inline-block mt-4 bg-gold px-6 py-2 rounded-xl font-bold">Go to Verify</Link>}</div>
  </div>);
  if(items.length===0) return (<div className="container-bb py-16 text-center"><p className="font-bold">Your cart is empty</p><Link href="/shop" className="inline-block mt-4 bg-gold px-6 py-2 rounded-xl font-bold">Shop Now</Link></div>);
  return (<div className="container-bb py-6 pb-32 md:pb-6 grid lg:grid-cols-[1.1fr_420px] gap-6">
    <form onSubmit={handleSubmit(onSubmit)} className="border rounded-xl p-5 bg-white space-y-3 shadow-sm">
      <h2 className="font-black text-lg">Checkout</h2>
      <p className="text-sm text-gray-500 -mt-2 mb-2">Cash on Delivery • Delivery ৳{delivery}</p>
      <div>
        <input {...register('customer_name')} placeholder="Full Name *" className="w-full border rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none" autoComplete="name" />
        {errors.customer_name && <p className="text-xs text-red-500 mt-1">{errors.customer_name.message as string}</p>}
      </div>
      <div>
        <input {...register('mobile')} placeholder="Mobile 01712345678 *" type="tel" className="w-full border rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none" inputMode="numeric" />
        {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile.message as string}</p>}
      </div>
      <div>
        <input {...register('district')} placeholder="District *" className="w-full border rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none" />
        {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district.message as string}</p>}
      </div>
      <div>
        <input {...register('full_address')} placeholder="Full Address (House, Road, Area) *" className="w-full border rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none" />
        {errors.full_address && <p className="text-xs text-red-500 mt-1">{errors.full_address.message as string}</p>}
      </div>
      <button type="submit" disabled={placing} className="w-full bg-gold hover:bg-[#E6A800] py-3.5 rounded-xl font-black shadow flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
        {placing ? <><span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin"/> Processing... Placing Order ৳{total.toLocaleString()}</> : <>Place Order • ৳{total.toLocaleString()}</>}
      </button>
      <p className="text-xs text-gray-500 text-center">By placing order you agree to our Terms</p>
    </form>
    <div className="space-y-4">
      <div className="border rounded-xl p-4 bg-white">
        <h3 className="font-bold">Have a Coupon?</h3>
        <div className="flex gap-2 mt-3">
          <input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="Enter coupon code" className="flex-1 border rounded-xl px-3 py-2.5 text-sm uppercase tracking-widest focus:ring-2 focus:ring-gold focus:border-gold outline-none"/>
          {discount>0 ? <button type="button" onClick={removeCoupon} className="px-4 py-2 rounded-xl border text-sm font-semibold">Remove</button> : <button type="button" onClick={applyCoupon} disabled={applying} className="px-5 py-2 rounded-xl bg-navy text-white text-sm font-bold disabled:opacity-50">{applying?'...':'Apply'}</button>}
        </div>
        {couponMsg && <p className={`text-xs mt-2 ${discount>0?'text-green-600':'text-red-500'}`}>{couponMsg}</p>}
      </div>
      <div className="border rounded-xl p-4 bg-white">
        <h3 className="font-bold">Order Summary <span className="font-normal text-gray-500">({items.length} items)</span></h3>
        <div className="mt-3 space-y-2 max-h-[260px] overflow-auto pr-1">
          {items.map(i=><div key={i.productId} className="flex gap-3 text-sm border-b py-2 last:border-0">
            <img src={i.image} alt={i.name} className="w-12 h-12 rounded-lg bg-gray-50 object-contain border p-1"/>
            <div className="flex-1 min-w-0">
              <p className="line-clamp-1 font-medium">{i.name}</p>
              <p className="text-xs text-gray-500">৳{i.price.toLocaleString()} × {i.qty}</p>
            </div>
            <span className="font-bold">৳{(i.price*i.qty).toLocaleString()}</span>
          </div>)}
        </div>
        <div className="mt-4 space-y-2 text-sm border-t pt-3">
          <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-semibold">৳{subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Delivery</span><span className="font-semibold">৳{delivery}</span></div>
          {discount>0 && <div className="flex justify-between text-green-600"><span>Discount ({coupon.toUpperCase()})</span><span>-৳{discount.toLocaleString()}</span></div>}
          <div className="h-px bg-gray-100 my-2"/>
          <div className="flex justify-between text-base font-black"><span>Total (COD)</span><span>৳{total.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
    {placing && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-[90%] text-center shadow-2xl border">
        <div className="w-14 h-14 border-4 border-gold border-t-navy rounded-full animate-spin mx-auto"/>
        <p className="font-black text-lg mt-4">Processing your order...</p>
        <p className="text-sm text-gray-500 mt-1">Creating BBS ID • Checking stock • Applying coupon</p>
        <p className="text-xs text-gray-400 mt-2">Please do not close the window</p>
      </div>
    </div>}
  </div>);
}
