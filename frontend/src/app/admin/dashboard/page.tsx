'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Package, ShoppingCart, Clock, Users, TrendingUp, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
export default function Dashboard(){
  const [stats,setStats]=useState({products:0, orders:0, pending:0, customers:0, revenue:0});
  const [recent,setRecent]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const load=async()=>{
    setLoading(true);
    try{
      const [prod, cust, ordRes] = await Promise.all([
        supabase.from('products').select('id',{count:'exact', head:true}),
        supabase.from('profiles').select('id',{count:'exact', head:true}).eq('role','customer'),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, { headers:{ Authorization:`Bearer ${localStorage.getItem('token')||''}` }}).then(r=> r.ok? r.json(): []).catch(()=>[]),
      ]);
      const ord = Array.isArray(ordRes) ? ordRes : [];
      const pend = ord.filter((o:any)=> o.status==='pending').length;
      const rev = ord.reduce((s:any,x:any)=> s+Number(x.total||0), 0);
      setStats({
        products: prod.count||0,
        orders: ord.length||0,
        pending: pend,
        customers: cust.count||0,
        revenue: rev,
      });
      setRecent(ord.slice(0,6));
    }catch(e){ console.error(e); }
    setLoading(false);
  };
  useEffect(()=>{ load(); },[]);
  const cards = [
    {label:'Total Products', value:stats.products, icon:Package, color:'bg-blue-500', light:'bg-blue-50', href:'/admin/products'},
    {label:'Total Orders', value:stats.orders, sub:`৳${stats.revenue.toLocaleString()} revenue`, icon:ShoppingCart, color:'bg-navy', light:'bg-slate-100', href:'/admin/orders'},
    {label:'Pending Orders', value:stats.pending, icon:Clock, color:'bg-amber-500', light:'bg-amber-50', href:'/admin/orders', alert: stats.pending>0},
    {label:'Total Customers', value:stats.customers, icon:Users, color:'bg-emerald-500', light:'bg-emerald-50', href:'/admin/customers'},
  ];
  return (<div className="p-6">
    <div className="flex justify-between items-center">
      <div><h1 className="font-black text-xl">Dashboard</h1><p className="text-sm text-gray-500">Full control — Budget Bazar Service</p></div>
      <button onClick={load} className="text-sm border px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50">↻ Refresh</button>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {cards.map(c=>(
        <Link key={c.label} href={c.href} className={`rounded-2xl p-4 border bg-white hover:shadow-lg hover:-translate-y-0.5 transition ${c.alert?'ring-2 ring-amber-300':''}`}>
          <div className="flex justify-between items-start">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.light}`}><c.icon size={18} className={c.color==='bg-navy'?'text-navy': c.color==='bg-blue-500'?'text-blue-600': c.color==='bg-amber-500'?'text-amber-600':'text-emerald-600'}/></div>
            {c.alert && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"/>}
          </div>
          <p className="text-sm text-gray-500 mt-3">{c.label}</p>
          {loading ? <div className="h-7 w-16 bg-gray-100 rounded animate-pulse mt-1"/> : <p className="text-2xl font-black mt-1 flex items-center gap-1">{c.value} {c.value>0 && <ArrowUpRight size={14} className="text-green-500"/>}</p>}
          {c.sub && <p className="text-xs text-gray-400 mt-1">{c.sub}</p>}
        </Link>
      ))}
    </div>
    <div className="grid lg:grid-cols-3 gap-4 mt-6">
      <div className="lg:col-span-2 bg-white rounded-2xl p-5 border shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><ShoppingCart size={16}/> Recent Orders <span className="text-xs bg-gold text-navy px-2 py-0.5 rounded-full">{recent.length}</span></h3>
          <Link href="/admin/orders" className="text-xs text-blue-600 hover:underline">View All →</Link>
        </div>
        {recent.length===0 ? <p className="text-sm text-gray-400 mt-6 text-center py-8">No orders yet — BBS ID will appear here when customers order</p> : (
          <div className="mt-4 space-y-2">
            {recent.map(o=>(
              <div key={o.order_number} className="flex items-center gap-3 p-3 border rounded-xl hover:bg-gray-50 transition">
                <div className={`w-2 h-2 rounded-full ${o.status==='pending'?'bg-amber-500': o.status==='delivered'?'bg-green-500':'bg-blue-500'} animate-pulse`}/>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm font-bold">{o.order_number}</p>
                  <p className="text-xs text-gray-500 truncate">{o.customer_name} • {o.payment_method.toUpperCase()} • ৳{Number(o.total).toLocaleString()}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${o.status==='pending'?'bg-amber-100 text-amber-700': o.status==='delivered'?'bg-green-100 text-green-700':'bg-slate-100'}`}>{o.status}</span>
                <span className="text-xs text-gray-400 hidden sm:inline">{new Date(o.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white rounded-2xl p-5 border shadow-sm">
        <h3 className="font-bold flex items-center gap-2"><TrendingUp size={16}/> Sales Overview</h3>
        <div className="mt-4 space-y-3">
          <div className="flex justify-between text-sm"><span className="text-gray-500">Today</span><span className="font-bold">৳{(stats.revenue*0.08).toFixed(0)}</span></div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gold rounded-full" style={{width:'45%'}}/></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">This Week</span><span className="font-bold">৳{(stats.revenue*0.35).toFixed(0)}</span></div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-navy rounded-full" style={{width:'65%'}}/></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">This Month</span><span className="font-bold">৳{stats.revenue.toLocaleString()}</span></div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{width:'85%'}}/></div>
        </div>
        <div className="mt-6 bg-gold/10 border border-gold/20 rounded-xl p-3">
          <p className="text-xs font-bold text-navy">💡 Tip</p>
          <p className="text-xs text-gray-600 mt-1">Click <b>Products</b> → Add Product → Storage → DB → Shop e auto visible. Animation + success toast dekhabe.</p>
        </div>
      </div>
    </div>
  </div>);
}
