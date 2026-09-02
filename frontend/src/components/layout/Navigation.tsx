'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CategoryDropdown from './CategoryDropdown';
export default function Navigation(){
  const path=usePathname();
  const links=[
    { href:'/', label:'Home' },
    { href:'/shop', label:'Shop' },
    { href:'/shop', label:'Categories' },
    { href:'/shop', label:'New Arrivals' },
    { href:'/shop', label:'🔥 Deals' },
    { href:'#', label:'About Us' },
    { href:'#', label:'Contact Us' },
  ];
  return (<div className="bg-[#0f1a33] border-t border-white/5">
    <div className="container-bb flex items-center gap-6 py-2 overflow-x-auto">
      <CategoryDropdown/>
      {links.map(l=><Link key={l.label} href={l.href} className={`text-sm whitespace-nowrap text-white hover:text-gold transition ${path===l.href?'text-gold':''} ${l.label.includes('Deals')?'text-gold font-semibold':''}`}>{l.label}</Link>)}
    </div>
  </div>);
}
