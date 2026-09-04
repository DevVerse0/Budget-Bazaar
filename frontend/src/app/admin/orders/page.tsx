'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Package, Truck, CreditCard, Clock, CheckCircle2, Search } from 'lucide-react';
const statuses = ['pending','confirmed','processing','shipped','delivered','cancelled'] as const;
export default function AdminOrders(){
  const [orders,setOrders]=useState<any[]>([]);
  const [filter,setFilter]=useState('all');
  const [q,setQ]=useState('');
  const [loading,setLoading]=useState(true);
  const [updating,setUpdating]=useState<string | null>(null);
  const load=async()=>{
    setLoading(true);
    try{ const { data } = await api.get('/orders'); setOrders(data||[]); }catch(e){ console.error(e); }
    setLoading(false);
  };
  useEffect(()=>{ load(); },[]);
  const updateStatus=async(id:string, status:string)=>{
    setUpdating(id);
    try{ await api.put(`/orders/${id}/status`, { status }); load(); }catch(e:any){ alert(e.response?.data?.error||'Failed'); }
    setUpdating(null);
  };
  const filtered = orders.filter(o=>{
    if(filter!=='all' && o.status!==filter) return false;
    if(q && !(`${o.order_number} ${o.customer_name} ${o.mobile}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });
  const counts = {
    total: orders.length,
    pending: orders.filter(o=>o.status==='pending').length,
    delivered: orders.filter(o=>o.status==='delivered').length,
    revenue: orders.reduce((s,o)=> s+Number(o.total||0),0),
  };
  return (<div className="p-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center"><Package size={18}/></div>
      <div><h1 className="font-black text-xl">Orders — Full Control</h1><p className="text-sm text-gray-500">BBS ID • Customer • Payment • Delivery • Status — Backend live</p></div>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
      <div className="bg-white border rounded-2xl p-4"><p className="text-xs text-gray-500">Total Orders</p><p className="text-2xl font-black">{counts.total}</p><p className="text-xs text-gray-400">৳{counts.revenue.toLocaleString()} revenue</p></div>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4"><p className="text-xs text-amber-700">Pending</p><p className="text-2xl font-black text-amber-700">{counts.pending}</p><p className="text-xs text-amber-600">{counts.pending>0?'Action needed':''}</p></div>
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4"><p className="text-xs text-green-700">Delivered</p><p className="text-2xl font-black text-green-700">{counts.delivered}</p></div>
      <div className="bg-white border rounded-2xl p-4 flex items-center gap-2"><Search size={16} className="text-gray-400"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search BBS / customer / mobile" className="flex-1 outline-none text-sm placeholder:text-gray-400"/></div>
    </div>
    <div className="flex gap-2 mt-4 flex-wrap">
      {['all',...statuses].map(s=>(
        <button key={s} onClick={()=>setFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize border transition ${filter===s?'bg-navy text-white border-navy':'bg-white hover:bg-gray-50'}`}>{s} {s!=='all' && `(${orders.filter(o=>o.status===s).length})`}</button>
      ))}
    </div>
    <div className="bg-white border rounded-2xl mt-4 overflow-hidden shadow-sm">
      {loading ? <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin mx-auto"/><p className="text-sm text-gray-500 mt-2">Loading orders from backend...</p></div> : filtered.length===0 ? <div className="p-12 text-center"><p className="text-gray-400">No orders — BBS ID will appear here after checkout</p><p className="text-xs text-gray-400 mt-1">Backend: GET /api/orders • Supabase orders table</p></div> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500"><tr><th className="px-4 py-3 text-left">BBS ID</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Payment</th><th className="px-4 py-3 text-left">Delivery</th><th className="px-4 py-3 text-left">Total</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Action</th></tr></thead>
            <tbody>
              {filtered.map(o=>(
                <tr key={o.id} className="border-t hover:bg-gray-50/70 transition">
                  <td className="px-4 py-3"><span className="font-mono font-bold text-navy">{o.order_number}</span><p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString()}</p></td>
                  <td className="px-4 py-3"><p className="font-semibold">{o.customer_name}</p><p className="text-xs text-gray-500">{o.mobile} • {o.district}</p></td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${o.payment_method==='cod'?'bg-gold/20 border-gold text-navy': o.payment_method==='bkash'?'bg-pink-50 border-pink-200 text-pink-700':'bg-orange-50 border-orange-200 text-orange-700'}`}><CreditCard size={12}/>{o.payment_method.toUpperCase()}</span>{o.trx_id && <p className="text-xs font-mono text-gray-500 mt-1">TRX:{o.trx_id}</p>}</td>
                  <td className="px-4 py-3"><span className="inline-flex items-center gap-1 text-xs"><Truck size={12}/>৳{Number(o.delivery_charge).toLocaleString()}</span><p className="text-xs text-gray-400">{o.district?.toLowerCase().includes('dhaka')?'Inside':'Outside'} Dhaka</p></td>
                  <td className="px-4 py-3 font-black">৳{Number(o.total).toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${o.status==='pending'?'bg-amber-100 text-amber-700': o.status==='delivered'?'bg-green-100 text-green-700': o.status==='cancelled'?'bg-red-100 text-red-700':'bg-slate-100'}`}>{o.status}</span></td>
                  <td className="px-4 py-3">
                    <select value={o.status} onChange={e=>updateStatus(o.id, e.target.value)} disabled={!!updating} className="border rounded-xl px-2 py-1.5 text-xs bg-white disabled:opacity-50">
                      {statuses.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                    {updating===o.id && <span className="ml-2 w-3 h-3 border-2 border-navy border-t-transparent rounded-full animate-spin inline-block"/>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    <p className="text-xs text-gray-400 mt-3">Backend logic: <code>POST /api/orders</code> creates BBS ID, checks stock/coupon, decrements stock, creates order_items, inserts notification. Change status via <code>PUT /api/orders/:id/status</code> — counts update live.</p>
  </div>);
}
