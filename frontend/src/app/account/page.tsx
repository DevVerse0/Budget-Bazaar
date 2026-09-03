'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Phone, MapPin, Trash2, Camera, Save, Shield } from 'lucide-react';

export default function Account(){
  const [profile,setProfile]=useState<any>(null); const [loading,setLoading]=useState(true);
  const [form,setForm]=useState({full_name:'',mobile:'',district:'',upazila:'',full_address:''});
  const [msg,setMsg]=useState(''); const [pic,setPic]=useState<File|null>(null); const [preview,setPreview]=useState<string|null>(null);

  const load=async()=>{
    const { data:{session} } = await supabase.auth.getSession();
    if(!session) { setLoading(false); return; }
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    if(data){ setProfile(data); setForm({full_name:data.full_name||'',mobile:data.mobile||'',district:(data as any).district||'',upazila:(data as any).upazila||'',full_address:(data as any).full_address||''}); setPreview((data as any).avatar_url||null); }
    setLoading(false);
  };
  useEffect(()=>{ load(); },[]);
  useEffect(()=>{ if(pic){ const u=URL.createObjectURL(pic); setPreview(u); return ()=>URL.revokeObjectURL(u); } },[pic]);

  const save=async(e:any)=>{
    e.preventDefault(); setMsg('Saving...');
    const { data:{session} } = await supabase.auth.getSession();
    if(!session) return;
    let avatar_url = preview;
    if(pic){
      const path = `avatars/${session.user.id}/${Date.now()}-${pic.name}`;
      const { error } = await supabase.storage.from('avatars').upload(path, pic, { upsert:true });
      if(!error){ const { data } = supabase.storage.from('avatars').getPublicUrl(path); avatar_url=data.publicUrl; }
      else { // fallback to product-images bucket
        const { error: e2 } = await supabase.storage.from('product-images').upload(path, pic, { upsert:true });
        if(!e2){ const { data } = supabase.storage.from('product-images').getPublicUrl(path); avatar_url=data.publicUrl; }
      }
    }
    const { error } = await supabase.from('profiles').update({ full_name:form.full_name, mobile:form.mobile, avatar_url, district:form.district, upazila:form.upazila, full_address:form.full_address } as any).eq('id', session.user.id);
    if(error) setMsg('Error: '+error.message); else { setMsg('✅ Profile saved'); load(); }
  };

  const delAccount=async()=>{
    if(!confirm('Delete account? This will remove profile. 2-step verify later.')) return;
    const { data:{session} } = await supabase.auth.getSession();
    if(session) await supabase.from('profiles').delete().eq('id', session.user.id);
    await supabase.auth.signOut();
    location.href='/';
  };

  if(loading) return (<div className="container-bb py-12 text-center">Loading...</div>);
  if(!profile) return (<div className="container-bb py-12 text-center"><p>Please <a href="/login" className="text-blue-600">Login</a> to view My Profile</p></div>);

  return (<div className="container-bb py-6 grid md:grid-cols-[260px_1fr] gap-6">
    <aside className="bg-white border rounded-2xl p-4 h-fit shadow-sm">
      <div className="flex flex-col items-center">
        <div className="relative"><img src={preview||`https://i.pravatar.cc/100?u=${profile.email}`} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-gold"/><label className="absolute bottom-0 right-0 bg-navy text-white p-1.5 rounded-full cursor-pointer"><Camera size={14}/><input type="file" accept="image/*" className="hidden" onChange={e=>setPic(e.target.files?.[0]||null)}/></label></div>
        <p className="font-semibold mt-2">{profile.full_name||'User'}</p><p className="text-xs text-gray-500">{profile.email}</p>
      </div>
      <nav className="mt-6 space-y-1">
        <a className="flex items-center gap-2 px-3 py-2.5 bg-navy text-white rounded-xl text-sm"><User size={16}/> My Profile</a>
        <a href="/account" className="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-xl text-sm"><Shield size={16}/> My Orders</a>
        <a href="/wishlist" className="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-xl text-sm"><Phone size={16}/> Wishlist</a>
      </nav>
      <button onClick={delAccount} className="w-full mt-4 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2.5 rounded-xl text-sm hover:bg-red-50"><Trash2 size={16}/> Delete Account</button>
      <p className="text-xs text-gray-400 mt-2 text-center">2-step verify later</p>
    </aside>
    <form onSubmit={save} className="bg-white border rounded-2xl p-6 shadow-sm">
      <h1 className="font-bold text-lg flex items-center gap-2"><User size={20} className="text-gold"/> My Profile</h1><p className="text-sm text-gray-500 mb-6">Update your personal info — premium grading look</p>
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Full Name</label><div className="relative mt-1"><User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} className="w-full border rounded-xl pl-9 pr-3 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold outline-none" placeholder="Full Name"/></div></div>
        <div><label className="text-sm font-medium">Mobile</label><div className="relative mt-1"><Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={form.mobile} onChange={e=>setForm({...form,mobile:e.target.value})} className="w-full border rounded-xl pl-9 pr-3 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold outline-none" placeholder="017..."/></div></div>
        <div><label className="text-sm font-medium">District (Jela)</label><div className="relative mt-1"><MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={form.district} onChange={e=>setForm({...form,district:e.target.value})} className="w-full border rounded-xl pl-9 pr-3 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold outline-none" placeholder="Dhaka"/></div></div>
        <div><label className="text-sm font-medium">Upazila</label><div className="relative mt-1"><MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={form.upazila} onChange={e=>setForm({...form,upazila:e.target.value})} className="w-full border rounded-xl pl-9 pr-3 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold outline-none" placeholder="Dhanmondi"/></div></div>
        <div className="md:col-span-2"><label className="text-sm font-medium">Full Address</label><textarea value={form.full_address} onChange={e=>setForm({...form,full_address:e.target.value})} className="w-full border rounded-xl px-3 py-3 mt-1 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold outline-none" rows={3} placeholder="House, Road, Area"/></div>
      </div>
      {msg && <p className="text-sm mt-4 p-3 bg-gray-50 rounded-xl">{msg}</p>}
      <button type="submit" className="mt-6 w-full md:w-auto bg-navy hover:bg-black text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2"><Save size={16}/> Save Changes</button>
    </form>
  </div>);
}
