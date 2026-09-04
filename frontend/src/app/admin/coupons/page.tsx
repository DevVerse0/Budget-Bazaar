'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Ticket, Plus, Trash2 } from 'lucide-react';
export default function AdminCoupons(){
  const [coupons,setCoupons]=useState<any[]>([]);
  const [form,setForm]=useState({code:'', discount_type:'percentage', discount_value:'', minimum_order:'0', maximum_discount:'', expiry_date:''});
  const [msg,setMsg]=useState('');
  const load=async()=>{ const { data } = await supabase.from('coupons').select('*').order('created_at',{ascending:false}); if(data) setCoupons(data); };
  useEffect(()=>{ load(); },[]);
  const create=async(e:any)=>{
    e.preventDefault();
    const { error } = await supabase.from('coupons').insert({
      code: form.code.toUpperCase(), discount_type: form.discount_type, discount_value: Number(form.discount_value),
      minimum_order: Number(form.minimum_order||0), maximum_discount: form.maximum_discount? Number(form.maximum_discount): null,
      expiry_date: form.expiry_date||null, status:'active'
    });
    if(error) setMsg('❌ '+error.message); else { setMsg('✅ Coupon '+form.code.toUpperCase()+' created — checkout e apply hobe'); setForm({code:'',discount_type:'percentage',discount_value:'',minimum_order:'0',maximum_discount:'',expiry_date:''}); load(); }
  };
  const del=async(id:string)=>{ if(!confirm('Delete coupon?'))return; await supabase.from('coupons').delete().eq('id',id); load(); };
  return (<div className="p-6">
    <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white"><Ticket size={18}/></div><div><h1 className="font-black text-xl">Coupons</h1><p className="text-sm text-gray-500">Create → Checkout e coupon apply → discount</p></div></div>
    <form onSubmit={create} className="bg-white border rounded-2xl p-4 mt-4 grid md:grid-cols-3 gap-3 shadow-sm">
      <input placeholder="CODE (e.g. BBS10)" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} className="border rounded-xl px-3 py-2.5 font-mono uppercase" required/>
      <select value={form.discount_type} onChange={e=>setForm({...form,discount_type:e.target.value})} className="border rounded-xl px-3 py-2.5"><option value="percentage">Percentage %</option><option value="fixed">Fixed ৳</option></select>
      <input placeholder="Discount value" type="number" value={form.discount_value} onChange={e=>setForm({...form,discount_value:e.target.value})} className="border rounded-xl px-3 py-2.5" required/>
      <input placeholder="Min order ৳" type="number" value={form.minimum_order} onChange={e=>setForm({...form,minimum_order:e.target.value})} className="border rounded-xl px-3 py-2.5"/>
      <input placeholder="Max discount ৳ (for %)" type="number" value={form.maximum_discount} onChange={e=>setForm({...form,maximum_discount:e.target.value})} className="border rounded-xl px-3 py-2.5"/>
      <input type="date" value={form.expiry_date} onChange={e=>setForm({...form,expiry_date:e.target.value})} className="border rounded-xl px-3 py-2.5"/>
      <button className="md:col-span-3 bg-gold py-2.5 rounded-xl font-black flex items-center justify-center gap-2"><Plus size={16}/> Create Coupon</button>
      {msg && <p className="md:col-span-3 text-sm p-2 bg-gray-50 rounded-xl">{msg}</p>}
    </form>
    <div className="bg-white border rounded-2xl p-4 mt-6 shadow-sm">
      <h3 className="font-bold">All Coupons ({coupons.length})</h3>
      <div className="grid md:grid-cols-2 gap-3 mt-3">
        {coupons.map(c=>(
          <div key={c.id} className="border rounded-xl p-3 flex justify-between items-center hover:shadow-sm">
            <div><p className="font-mono font-black text-navy">{c.code}</p><p className="text-xs text-gray-500">{c.discount_type==='percentage'? `${c.discount_value}%` : `৳${c.discount_value}` } off • Min ৳{c.minimum_order} {c.expiry_date? `• Exp ${new Date(c.expiry_date).toLocaleDateString()}`:''}</p><span className={`text-xs px-2 py-0.5 rounded-full ${c.status==='active'?'bg-green-100 text-green-700':'bg-gray-100'}`}>{c.status}</span></div>
            <button onClick={()=>del(c.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-xl"><Trash2 size={16}/></button>
          </div>
        ))}
      </div>
    </div>
  </div>);
}
