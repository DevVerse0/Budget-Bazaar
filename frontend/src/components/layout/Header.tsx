'use client';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';
import SearchBar from './SearchBar';
import CartPreview from './CartPreview';
import AccountMenu from './AccountMenu';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
export default function Header(){
  return (<header className="sticky top-0 z-50 shadow-sm">
    <AnnouncementBar/>
    <div className="bg-navy text-white">
      <div className="container-bb flex items-center gap-4 py-3">
        <div className="flex items-center gap-2">
          <MobileMenu/>
          <Link href="/" className="flex items-center gap-2 font-bold text-base sm:text-lg whitespace-nowrap"><img src="/logo.png" alt="Budget Bazar Service" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-gold bg-white object-cover"/> BUDGET <span className="text-gold">BAZAR</span></Link>
        </div>
        <div className="hidden md:flex flex-1 justify-center"><SearchBar/></div>
        <div className="flex items-center gap-5 ml-auto">
          <Link href="/wishlist" className="hidden sm:flex items-center gap-1.5 hover:text-gold transition"><Heart size={18}/><span className="text-sm">Wishlist</span></Link>
          <CartPreview/>
          <AccountMenu/>
        </div>
      </div>
      <div className="md:hidden px-4 pb-3"><SearchBar/></div>
    </div>
    <Navigation/>
  </header>);
}
