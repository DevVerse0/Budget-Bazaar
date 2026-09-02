'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { orderService } from '@/services/order.service';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
const schema = z.object({ customer_name:z.string().min(2), mobile:z.string().min(11), district:z.string().min(1), full_address:z.string().min(5) });
export default function Checkout(){
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });
  const { items, clear } = useCartStore(); const router = useRouter();
  const onSubmit = async (data:any)=>{
    const payload = { ...data, items: items.map(i=>({productId:i.productId, quantity:i.qty})), payment_method:'cod' };
    try{ const res= await orderService.create(payload); clear(); router.push(`/order-success?order=${res.order.order_number}`);} catch(e:any){ alert(e.response?.data?.error||'Failed');}
  };
  return (<div className="container-bb py-6 grid md:grid-cols-2 gap-6">
    <form onSubmit={handleSubmit(onSubmit)} className="border rounded p-4 bg-white space-y-3">
      <h2 className="font-bold">Checkout / Order Form</h2>
      <input {...register('customer_name')} placeholder="Full Name" className="w-full border rounded px-3 py-2" />
      <input {...register('mobile')} placeholder="01712345678" className="w-full border rounded px-3 py-2" />
      <input {...register('district')} placeholder="District" className="w-full border rounded px-3 py-2" />
      <input {...register('full_address')} placeholder="Full Address" className="w-full border rounded px-3 py-2" />
      <button type="submit" className="w-full bg-gold py-2 rounded font-semibold">Place Order</button>
    </form>
    <div className="border rounded p-4 bg-white"><h3 className="font-semibold">Order Summary</h3><p className="text-sm text-gray-500 mt-2">{items.length} items - Cash on Delivery</p></div>
  </div>);
}
