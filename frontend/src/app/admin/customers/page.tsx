'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Mail, Phone, Search } from 'lucide-react';
export default function AdminCustomers(){
  const [customers,setCustomers]=useState<any[]>([]);
  const [q,setQ]=useState('');
  const load=async()=>{
    const { data } = await supabase.from('profiles').select('id,full_name,email,mobile,role,created_at,avatar_url').eq('role','customer').order('created_at',{ascending:false}).limit(100);
    if(data) setCustomers(data);
  };
  useEffect(()=>{ load(); },[]);
  const filtered = customers.filter(c=> !q || `${c.full_name} ${c.email} ${c.mobile}`.toLowerCase().includes(q.toLowerCase()));
  return (<div className="p-6">
    <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white"><Users size={18}/></div><div><h1 className="font-black text-xl">Customers</h1><p className="text-sm text-gray-500">Total {customers.length} customers — from profiles table</p></div></div>
    <div className="mt-4 flex gap-2"><div className="flex-1 flex items-center gap-2 bg-white border rounded-xl px-3 py-2"><Search size={16} className="text-gray-400"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name / email / mobile" className="flex-1 outline-none text-sm"/></div><span className="bg-white border rounded-xl px-4 py-2 text-sm font-bold">{filtered.length} found</span></div>
    <div className="bg-white border rounded-2xl mt-4 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500"><tr><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Contact</th><th className="px-4 py-3 text-left">Joined</th></tr></thead>
          <tbody>
            {filtered.map(c=>(
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 flex items-center gap-3">
                  {c.avatar_url ? <img src={c.avatar_url} className="w-8 h-8 rounded-full object-cover"/> : <div className="w-8 h-8 rounded-full bg-gold text-navy flex items-center justify-center text-xs font-black">{(c.full_name||c.email||'U')[0].toUpperCase()}</div>}
                  <div><p className="font-semibold">{c.full_name||'No name'}</p><p className="text-xs text-gray-500">{c.email}</p></div>
                </td>
                <td className="px-4 py-3"><p className="flex items-center gap-1"><Phone size={12}/>{c.mobile||'-'}</p><p className="flex items-center gap-1 text-xs text-gray-500"><Mail size={12}/>{c.email}</p></td>
                <td className="px-4 py-3 text-xs text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length===0 && <p className="p-8 text-center text-sm text-gray-400">No customers — user will appear here after Sign Up + OTP verify</p>}
    </div>
  </div>);
}
