import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
type P={id?:string; name:string; slug:string; sale_price:number; regular_price:number; image?:string; brand?:string; stock_quantity?:number};
export default function ProductCard({p}:{p:P}){
  const discount = p.regular_price && p.sale_price ? Math.round((1 - p.sale_price/p.regular_price)*100) : 0;
  const { ids, toggle } = useWishlistStore();
  const wish = p.id ? ids.includes(p.id) : false;
  return (<div className="border rounded-xl p-3 bg-white card-hover group relative overflow-hidden">
    <button onClick={()=> p.id && toggle(p.id)} className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow backdrop-blur transition ${wish?'bg-pink-500 text-white':'bg-white/90 text-gray-400 hover:text-pink-500'}`} title="Wishlist">
      <Heart size={16} fill={wish? 'currentColor':'none'}/>
    </button>
    <div className="overflow-hidden rounded-lg bg-gray-50">
      {p.image ? <img src={p.image} alt={p.name} className="w-full h-40 object-contain group-hover:scale-110 transition duration-500"/> : <div className="w-full h-40 bg-gray-50 flex items-center justify-center text-gray-400 text-xs">No Image</div>}
    </div>
    {discount>0 && <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">{discount}% OFF</span>}
    <p className="text-xs text-gray-500 mt-2">{p.brand || ''}</p>
    <Link href={`/product/${p.slug}`} className="font-medium text-sm line-clamp-2 hover:text-gold transition">{p.name}</Link>
    <div className="flex items-center gap-2 mt-1"><span className="font-bold">৳{p.sale_price||p.regular_price}</span>{p.sale_price && <span className="text-gray-400 line-through text-xs">৳{p.regular_price}</span>}</div>
    {p.stock_quantity!==undefined && p.stock_quantity===0 && <p className="text-xs text-red-500">Out of Stock</p>}
    <Link href={`/product/${p.slug}`} className="block w-full mt-3 btn-gold text-navy text-center py-2 rounded-lg text-sm font-semibold">View Details</Link>
  </div>);
}
