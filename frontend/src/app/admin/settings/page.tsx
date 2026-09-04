'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Settings as SetIcon, Save } from 'lucide-react';
export default function AdminSettings(){
  const [delivery,setDelivery]=useState({insideCity:60, outsideCity:120});
  const [msg,setMsg]=useState('');
  const load=async()=>{ const { data } = await supabase.from('settings').select('*').eq('setting_key','delivery').single(); if(data?.setting_value) setDelivery(data.setting_value); };
  useEffect(()=>{ load(); },[]);
  const save=async()=>{
    const { error } = await supabase.from('settings').upsert({ setting_key:'delivery', setting_value: delivery }, { onConflict:'setting_key' });
    if(error) setMsg('❌ '+error.message); else setMsg('✅ Delivery charges saved — Checkout e auto apply (Inside 60 / Outside 120)');
  };
  return (<div className="p-6 max-w-2xl">
    <h1 className="font-black text-xl flex items-center gap-2"><SetIcon size={20}/> Settings</h1>
    <div className="bg-white border rounded-2xl p-5 mt-4 shadow-sm">
      <h3 className="font-bold">Delivery Charges</h3>
      <p className="text-xs text-gray-500">Dhaka inside vs outside — Checkout e auto</p>
      <div className="grid md:grid-cols-2 gap-3 mt-3">
        <div><label className="text-sm">Inside Dhaka ৳</label><input type="number" value={delivery.insideCity} onChange={e=>setDelivery({...delivery,insideCity:Number(e.target.value)})} className="w-full border rounded-xl px-3 py-2.5 mt-1"/></div>
        <div><label className="text-sm">Outside Dhaka ৳</label><input type="number" value={delivery.outsideCity} onChange={e=>setDelivery({...delivery,outsideCity:Number(e.target.value)})} className="w-full border rounded-xl px-3 py-2.5 mt-1"/></div>
      </div>
      <button onClick={save} className="mt-4 bg-navy text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2"><Save size={16}/> Save</button>
      {msg && <p className="text-sm p-2 bg-gray-50 rounded mt-3">{msg}</p>}
    </div>
    <div className="bg-white border rounded-2xl p-5 mt-4">
      <h3 className="font-bold">Payment Methods</h3>
      <p className="text-sm text-gray-500 mt-1">Checkout e COD / bKash / Nagad — bKash TRX verify manual. Settings table `payment_methods` JSON e control.</p>
    </div>
  </div>);
}
