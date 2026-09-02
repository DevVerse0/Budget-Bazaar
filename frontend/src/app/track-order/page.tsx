'use client';
import { useState } from 'react';
import { orderService } from '@/services/order.service';
export default function Track(){
  const [num,setNum]=useState(''); const [mobile,setMobile]=useState(''); const [data,setData]=useState<any>(null);
  const submit=async(e:any)=>{ e.preventDefault(); try{ setData(await orderService.track(num,mobile)); } catch{ alert('Not found'); } };
  return (<div className="container-bb py-6 max-w-lg mx-auto">
    <h1 className="font-bold text-lg mb-4">Track Order</h1>
    <form onSubmit={submit} className="border rounded p-4 bg-white space-y-3"><input value={num} onChange={e=>setNum(e.target.value)} placeholder="Order Number BB-2026-xxxx" className="w-full border rounded px-3 py-2"/><input value={mobile} onChange={e=>setMobile(e.target.value)} placeholder="Mobile Number" className="w-full border rounded px-3 py-2"/><button className="w-full bg-gold py-2 rounded font-semibold">Track</button></form>
    {data && <div className="mt-6 border rounded p-4 bg-white"><p>Status: <span className="font-bold">{data.status}</span></p><div className="flex gap-2 mt-2">{['pending','confirmed','processing','shipped','delivered'].map(s=><span key={s} className={`px-2 py-1 rounded text-xs ${data.status===s?'bg-gold':'bg-gray-100'}`}>{s}</span>)}</div></div>}
  </div>);
}
