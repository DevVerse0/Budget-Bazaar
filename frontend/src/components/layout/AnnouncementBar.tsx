'use client';
export default function AnnouncementBar(){
  return (<div className="bg-[#0a0f1e] border-b border-white/5 text-white text-xs py-2 hidden md:block">
    <div className="container-bb flex justify-center gap-6">
      <span>🚚 <span className="text-gold font-semibold">Fast Delivery</span> Across Bangladesh</span>
      <span className="hidden sm:inline opacity-30">|</span>
      <span>🔥 <span className="text-gold font-semibold">Best Gadgets</span> at the Best Prices</span>
    </div>
  </div>);
}
