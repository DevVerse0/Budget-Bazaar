'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
export default function AdminCampaigns(){
  const [list,setList]=useState<any[]>([]); const [name,setName]=useState(''); const [msg,setMsg]=useState('');
  const load=async()=>{ const { data } = await supabase.from('campaigns').select('*').order('created_at',{ascending:false}); if(data) setList(data); };
  useEffect(()=>{ load(); },[]);
  const create=async(e:any)=>{ e.preventDefault(); const { error } = await supabase.from('campaigns').insert({ name, status:'active' }); if(error) setMsg(error.message); else { setMsg('✅ Campaign created'); setName(''); load(); } };
  return (<div className="p-6">
    <h1 className="font-black text-xl">Campaigns</h1>
    <form onSubmit={create} className="bg-white border rounded-2xl p-4 mt-4 flex gap-3"><input placeholder="Campaign Name (e.g. Eid Sale)" value={name} onChange={e=>setName(e.target.value)} className="flex-1 border rounded-xl px-3 py-2.5" required/><button className="bg-gold px-6 py-2.5 rounded-xl font-bold">Create</button></form>
    {msg && <p className="text-sm p-2 bg-gray-50 rounded mt-2">{msg}</p>}
    <div className="bg-white border rounded-2xl p-4 mt-6">
      <h3 className="font-bold">All Campaigns ({list.length})</h3>
      <div className="mt-3 space-y-2">{list.map(c=> (<div key={c.id} className="border rounded-xl p-3 flex justify-between"><span className="font-semibold">{c.name}</span><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{c.status}</span></div>))}</div>
    </div>
  </div>);
}
