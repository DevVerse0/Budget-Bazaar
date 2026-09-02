'use client';
import { useWishlistStore } from '@/store/wishlistStore';
export default function WishlistPage(){ const {ids}=useWishlistStore(); return (<div className="container-bb py-12 text-center"><h1 className="font-bold">Wishlist ({ids.length})</h1>{ids.length===0 && <p className="mt-4 text-gray-500">No items - Add products to wishlist ♥</p>}</div>); }
