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
import { Truck, MapPin, CreditCard, ShieldCheck, Smartphone, Wallet, Banknote, CheckCircle2 } from 'lucide-react';

const districts = ['Dhaka','Chittagong','Rajshahi','Khulna','Barisal','Sylhet','Rangpur','Mymensingh','Gazipur','Narayanganj','Cumilla','Cox\'s Bazar','Jessore','Bogra','Dinajpur','Feni','Noakhali','Pabna','Tangail','Other'];

const schema = z.object({
  customer_name:z.string().min(2,'Name required'),
  mobile:z.string().min(11,'Valid mobile required'),
  district:z.string().min(1,'District required'),
  full_address:z.string().min(5,'Address required'),
  payment_method:z.enum(['cod','bkash','nagad']),
  trx_id:z.string().optional(),
});

export default function Checkout(){
  const { register, handleSubmit, watch, formState:{errors} } = useForm<any>({ resolver: zodResolver(schema), defaultValues:{ payment_method:'cod' } });
  const { items, clear } = useCartStore(); const router = useRouter();
  const [coupon,setCoupon]=useState(''); const [discount,setDiscount]=useState(0); const [couponMsg,setCouponMsg]=useState(''); const [applying,setApplying]=useState(false);
  const [verifyMsg,setVerifyMsg]=useState(''); const [verifyEmail,setVerifyEmail]=useState(''); const [checking,setChecking]=useState(true); const [needLogin,setNeedLogin]=useState(false);
  const [step,setStep]=useState(1);
  const payment = (watch as any)('payment_method');
  const districtVal = (watch as any)('district');

  useEffect(()=>{
    supabase.auth.getSession().then(async({data})=>{
      const user = data.session?.user;
      if(!user){ setNeedLogin(true); setVerifyMsg('Please login to place order. You must be logged in to shop.'); setChecking(false); return; }
      if(!user.email_confirmed_at){
        setVerifyMsg('Please verify your email with OTP before shopping. Code sent to '+user.email);
        setVerifyEmail(user.email||'');
        try{ await api.post('/otp/request', { email:user.email, type:'signup' }); }catch{}
      }
      setChecking(false);
    });
  },[]);

  const subtotal = items.reduce((s,a)=>s+a.price*a.qty,0);
  const isInsideDhaka = districtVal?.toLowerCase().includes('dhaka');
  const delivery = !districtVal ? 60 : isInsideDhaka ? 60 : 120;
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
    const { data: sess } = await supabase.auth.getSession();
    const u = sess.session?.user;
    if(!u){ alert('Please login to place order'); router.push(`/login?next=/checkout`); return; }
    if(!u.email_confirmed_at){ alert('Please verify your email with OTP before shopping. Check '+u.email); router.push(`/verify-otp?email=${encodeURIComponent(u.email||'')}`); return; }
    if(data.payment_method!=='cod' && !data.trx_id){ alert('Please enter Transaction ID for '+data.payment_method); return; }
    setPlacing(true);
    const payload = { ...data, items: items.map(i=>({productId:i.productId, quantity:i.qty})), couponCode: discount>0? coupon.trim() : undefined };
    try{ const res= await orderService.create(payload); clear(); router.push(`/order-success?order=${res.order.order_number}`);} catch(e:any){
      const msg = e.response?.data?.error || 'Order failed';
      if(e.response?.data?.code==='EMAIL_NOT_VERIFIED'){ alert(msg); const { data: s } = await supabase.auth.getSession(); router.push(`/verify-otp?email=${encodeURIComponent(s.session?.user?.email||data.mobile||'')}`); setPlacing(false); return; }
      if(e.response?.data?.code==='LOGIN_REQUIRED'){ alert(msg); router.push('/login'); setPlacing(false); return; }
      alert(msg); setPlacing(false);
    }
  };

  if(checking) return (<div className="container-bb py-12 text-center text-sm flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin"/> Checking verification...</div>);
  if(verifyMsg) return (<div className="container-bb py-12 text-center"><div className="max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-2xl p-6 animate-[slideIn_0.3s_ease]"><p className="font-bold text-amber-900">{needLogin?'Login Required':'Email Verification Required'}</p><p className="text-sm text-amber-800 mt-2">{verifyMsg}</p>{needLogin ? <Link href="/login" className="inline-block mt-4 bg-navy text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition">Go to Login</Link> : <Link href={`/verify-otp?email=${encodeURIComponent(verifyEmail)}`} className="inline-block mt-4 bg-gold px-6 py-2.5 rounded-xl font-bold">Go to Verify</Link>}</div></div>);
  if(items.length===0) return (<div className="container-bb py-16 text-center"><p className="font-bold text-lg">Your cart is empty</p><Link href="/shop" className="inline-block mt-4 bg-gold px-8 py-2.5 rounded-xl font-bold shadow">Shop Now</Link></div>);

  return (<div className="container-bb py-6 pb-32 md:pb-6">
    {/* Premium Stepper */}
    <div className="max-w-3xl mx-auto mb-6">
      <div className="flex items-center justify-between gap-2">
        {[
          {n:1, label:'Delivery', icon:MapPin, active:step>=1},
          {n:2, label:'Payment', icon:CreditCard, active:step>=2},
          {n:3, label:'Review', icon:ShieldCheck, active:step>=3},
        ].map((s,idx)=>(
          <div key={s.n} className="flex items-center flex-1 gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${s.active?'bg-navy text-white shadow-lg scale-105':'bg-gray-100 text-gray-400'} ${step===s.n?'ring-2 ring-gold ring-offset-2':''}`}>
              {step> s.n ? <CheckCircle2 size={16}/> : <s.icon size={14}/>}
            </div>
            <span className={`hidden sm:inline text-sm font-bold ${s.active?'text-navy':'text-gray-400'}`}>{s.label}</span>
            {idx<2 && <div className={`flex-1 h-1 rounded-full mx-2 transition ${step> s.n?'bg-navy':'bg-gray-200'}`}/>}
          </div>
        ))}
      </div>
      <div className="h-1 bg-gray-100 rounded-full mt-4 overflow-hidden"><div className="h-full bg-gold transition-all duration-500" style={{width: `${(step/3)*100}%`}}/></div>
    </div>

    <div className="grid lg:grid-cols-[1.1fr_420px] gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Step 1: Delivery */}
        <div className={`border rounded-2xl p-5 bg-white shadow-sm transition-all ${step===1?'ring-2 ring-gold/20':''}`}>
          <h2 className="font-black text-base flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-gold text-navy flex items-center justify-center text-xs font-black">1</span> Delivery Information <Truck size={16} className="text-gray-400"/></h2>
          <div className="grid gap-3 mt-4">
            <div>
              <input {...register('customer_name')} placeholder="Full Name *" className="w-full border rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition bg-gray-50 focus:bg-white" autoComplete="name" />
              {errors.customer_name && <p className="text-xs text-red-500 mt-1">{errors.customer_name.message as string}</p>}
            </div>
            <div>
              <input {...register('mobile')} placeholder="Mobile 01712345678 *" type="tel" className="w-full border rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition bg-gray-50 focus:bg-white" inputMode="numeric" />
              {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile.message as string}</p>}
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <select {...register('district')} className="w-full border rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none bg-gray-50 focus:bg-white">
                  <option value="">Select District *</option>
                  {districts.map(d=><option key={d} value={d}>{d}</option>)}
                </select>
                {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district.message as string}</p>}
                <p className="text-xs mt-1.5 flex items-center gap-1">{isInsideDhaka ? <span className="text-green-600 flex items-center gap-1"><Truck size={12}/> Inside Dhaka: ৳60</span> : <span className="text-orange-600 flex items-center gap-1"><Truck size={12}/> Outside Dhaka: ৳120</span>}</p>
              </div>
              <input {...register('full_address')} placeholder="Full Address (House, Road, Area) *" className="w-full border rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none bg-gray-50 focus:bg-white" />
            </div>
            {errors.full_address && <p className="text-xs text-red-500 -mt-1">{errors.full_address.message as string}</p>}
          </div>
          <button type="button" onClick={()=> districtVal ? setStep(2) : alert('Please select District')} className="mt-4 w-full bg-navy text-white py-3 rounded-xl font-bold hover:bg-black transition">Continue to Payment →</button>
        </div>

        {/* Step 2: Payment */}
        <div className={`border rounded-2xl p-5 bg-white shadow-sm transition-all ${step===2?'ring-2 ring-gold/20': step>2?'opacity-60':''}`}>
          <h2 className="font-black text-base flex items-center gap-2"><span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step>=2?'bg-gold text-navy':'bg-gray-200 text-gray-500'}`}>2</span> Payment Method <CreditCard size={16} className="text-gray-400"/></h2>
          {step>=2 && (
            <div className="mt-4 space-y-3 animate-[slideIn_0.3s_ease]">
              <label className={`flex items-center gap-3 border-2 rounded-xl p-3 cursor-pointer transition ${payment==='cod'?'border-gold bg-gold/10':'border-gray-200 bg-gray-50 hover:bg-white'}`}>
                <input type="radio" value="cod" {...register('payment_method')} className="accent-navy"/>
                <Banknote size={20} className="text-navy"/><div><p className="font-bold text-sm">Cash on Delivery</p><p className="text-xs text-gray-500">Pay when product arrives</p></div>
                <span className="ml-auto text-xs bg-green-500 text-white px-2 py-1 rounded-full">Popular</span>
              </label>
              <label className={`flex items-center gap-3 border-2 rounded-xl p-3 cursor-pointer transition ${payment==='bkash'?'border-pink-500 bg-pink-50':'border-gray-200 bg-gray-50 hover:bg-white'}`}>
                <input type="radio" value="bkash" {...register('payment_method')} className="accent-pink-500"/>
                <div className="w-8 h-8 bg-[#E2136E] rounded-lg flex items-center justify-center text-white font-black text-xs">bKash</div>
                <div><p className="font-bold text-sm">bKash</p><p className="text-xs text-gray-500">017xx • Send Money</p></div>
              </label>
              <label className={`flex items-center gap-3 border-2 rounded-xl p-3 cursor-pointer transition ${payment==='nagad'?'border-orange-500 bg-orange-50':'border-gray-200 bg-gray-50 hover:bg-white'}`}>
                <input type="radio" value="nagad" {...register('payment_method')} className="accent-orange-500"/>
                <div className="w-8 h-8 bg-[#FF6A00] rounded-lg flex items-center justify-center text-white font-black text-[10px]">Nagad</div>
                <div><p className="font-bold text-sm">Nagad</p><p className="text-xs text-gray-500">Fast & Secure</p></div>
              </label>
              {payment!=='cod' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 animate-[slideIn_0.2s_ease]">
                  <p className="text-xs font-bold text-amber-900">Send to: 01922-896103 (Personal)</p>
                  <p className="text-xs text-amber-800 mt-1">After sending, enter Transaction ID below</p>
                  <input {...register('trx_id')} placeholder="Transaction ID (e.g. 9A7F...)" className="w-full mt-2 border rounded-xl px-3 py-2.5 text-sm font-mono uppercase tracking-widest focus:ring-2 focus:ring-gold outline-none"/>
                  <p className="text-xs text-gray-500 mt-1">We will verify within 30 minutes</p>
                </div>
              )}
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={()=>setStep(1)} className="flex-1 border py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition">← Back</button>
                <button type="button" onClick={()=>setStep(3)} className="flex-1 bg-gold py-2.5 rounded-xl font-black hover:bg-[#E6A800] transition">Review Order →</button>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Review */}
        <div className={`border rounded-2xl p-5 bg-white shadow-sm transition-all ${step===3?'ring-2 ring-gold/20':''}`}>
          <h2 className="font-black text-base flex items-center gap-2"><span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step===3?'bg-gold text-navy':'bg-gray-200 text-gray-500'}`}>3</span> Review & Place Order <ShieldCheck size={16} className="text-gray-400"/></h2>
          {step===3 && (
            <div className="mt-4 animate-[slideIn_0.3s_ease]">
              <div className="bg-gray-50 rounded-xl p-3 text-sm space-y-1">
                <p><span className="text-gray-500">Payment:</span> <span className="font-bold capitalize">{payment}</span> {payment!=='cod' && <span className="text-xs text-gray-500">(TRX required)</span>}</p>
                <p><span className="text-gray-500">Delivery:</span> <span className="font-bold">{isInsideDhaka?'Inside Dhaka ৳60':'Outside Dhaka ৳120'}</span></p>
                <p><span className="text-gray-500">Total:</span> <span className="font-black text-navy">৳{total.toLocaleString()}</span></p>
              </div>
              <button type="submit" disabled={placing} className="mt-4 w-full bg-gold hover:bg-[#E6A800] py-4 rounded-xl font-black text-base shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-xl transition-all hover:-translate-y-0.5">
                {placing ? <><span className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin"/> Processing... Creating BBS ID</> : <><Wallet size={18}/> Place Order • ৳{total.toLocaleString()}</>}
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">By placing order you agree to our Terms • BBS ID will be generated</p>
            </div>
          )}
        </div>
      </form>

      <div className="space-y-4">
        <div className="border rounded-2xl p-4 bg-white shadow-sm">
          <h3 className="font-black flex items-center gap-2"><Smartphone size={16}/> Have a Coupon?</h3>
          <div className="flex gap-2 mt-3">
            <input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="Enter coupon code" className="flex-1 border rounded-xl px-3 py-2.5 text-sm uppercase tracking-widest focus:ring-2 focus:ring-gold focus:border-gold outline-none"/>
            {discount>0 ? <button type="button" onClick={removeCoupon} className="px-4 py-2 rounded-xl border text-sm font-semibold hover:bg-gray-50 transition">Remove</button> : <button type="button" onClick={applyCoupon} disabled={applying} className="px-5 py-2 rounded-xl bg-navy text-white text-sm font-bold disabled:opacity-50 hover:bg-black transition">{applying?'...':'Apply'}</button>}
          </div>
          {couponMsg && <p className={`text-xs mt-2 ${discount>0?'text-green-600':'text-red-500'}`}>{couponMsg}</p>}
        </div>
        <div className="border rounded-2xl p-4 bg-white shadow-sm">
          <h3 className="font-black">Order Summary <span className="font-normal text-gray-500">({items.length} items)</span></h3>
          <div className="mt-3 space-y-2 max-h-[260px] overflow-auto pr-1">
            {items.map(i=><div key={i.productId} className="flex gap-3 text-sm border-b py-2 last:border-0">
              <img src={i.image} alt={i.name} className="w-12 h-12 rounded-xl bg-gray-50 object-contain border p-1"/>
              <div className="flex-1 min-w-0">
                <p className="line-clamp-1 font-medium">{i.name}</p>
                <p className="text-xs text-gray-500">৳{i.price.toLocaleString()} × {i.qty}</p>
              </div>
              <span className="font-bold">৳{(i.price*i.qty).toLocaleString()}</span>
            </div>)}
          </div>
          <div className="mt-4 space-y-2 text-sm border-t pt-3">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-semibold">৳{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-600 flex items-center gap-1"><Truck size={12}/> Delivery {isInsideDhaka?'(Inside)':'(Outside)'}</span><span className="font-semibold">৳{delivery}</span></div>
            {discount>0 && <div className="flex justify-between text-green-600"><span>Discount ({coupon.toUpperCase()})</span><span>-৳{discount.toLocaleString()}</span></div>}
            <div className="h-px bg-gray-100 my-2"/>
            <div className="flex justify-between text-base font-black"><span>Total</span><span className="text-navy">৳{total.toLocaleString()}</span></div>
            <p className="text-xs text-gray-500">{payment==='cod'?'Cash on Delivery':'Prepaid via '+payment.toUpperCase()} • BBS ID on success</p>
          </div>
        </div>
      </div>

      {placing && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-[90%] text-center shadow-2xl border animate-[slideIn_0.3s_ease]">
          <div className="w-14 h-14 border-4 border-gold border-t-navy rounded-full animate-spin mx-auto"/>
          <p className="font-black text-lg mt-4">Processing your order...</p>
          <p className="text-sm text-gray-500 mt-1">Creating BBS ID • Checking stock • Verifying {payment.toUpperCase()}</p>
          <div className="mt-4 flex justify-center gap-1"><span className="w-2 h-2 bg-gold rounded-full animate-bounce"/><span className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:0.1s]"/><span className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:0.2s]"/></div>
          <p className="text-xs text-gray-400 mt-2">Please do not close the window</p>
        </div>
      </div>}
    </div>
  </div>);
}
