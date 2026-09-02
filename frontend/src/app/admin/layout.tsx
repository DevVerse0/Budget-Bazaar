import Link from 'next/link';
export default function AdminLayout({children}:{children:React.ReactNode}){
  return (<div className="flex min-h-screen">
    <aside className="w-60 bg-navy text-white p-4 hidden md:block space-y-1">
      <div className="font-bold mb-6">BUDGET BAZAR ADMIN</div>
      {['Dashboard','Products','Categories','Orders','Customers','Coupons','Campaigns','Banners','Settings'].map(i=><Link key={i} href={`/admin/${i.toLowerCase()}`} className="block py-2 px-3 rounded hover:bg-white/10">{i}</Link>)}
    </aside>
    <div className="flex-1 bg-gray-50">{children}</div>
  </div>);
}
