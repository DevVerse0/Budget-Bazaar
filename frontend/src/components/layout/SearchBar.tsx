'use client';
import { Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import SearchSuggestions from './SearchSuggestions';
export default function SearchBar(){
  const [q,setQ]=useState(''); const [open,setOpen]=useState(false); const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const h=(e:any)=>{ if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h);
  },[]);
  return (<div ref={ref} className="relative flex-1 max-w-[640px]">
    <div className="flex bg-white rounded-xl overflow-hidden shadow-lg focus-within:ring-2 focus-within:ring-gold focus-within:shadow-[0_0_20px_rgba(245,184,0,0.4)] transition-all">
      <span className="pl-3 flex items-center text-gray-400"><Search size={18}/></span>
      <input value={q} onChange={e=>{setQ(e.target.value); setOpen(true);}} onFocus={()=>setOpen(true)} placeholder="Search for gadgets, accessories..." className="flex-1 px-3 py-2.5 text-sm text-slate-900 outline-none" aria-label="Search"/>
      <button className="btn-gold px-6 text-sm font-semibold">Search</button>
    </div>
    {open && <SearchSuggestions q={q} onClose={()=>setOpen(false)}/>}
  </div>);
}
