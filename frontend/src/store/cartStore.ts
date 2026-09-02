import { create } from 'zustand';
import { persist } from 'zustand/middleware';
type Item={ productId:string; name:string; price:number; qty:number; image?:string };
type S={ items: Item[]; add:(i:Item)=>void; remove:(id:string)=>void; clear:()=>void };
export const useCartStore = create<S>()(persist((set,get)=>({
  items: [],
  add: (i)=> set({ items: [...get().items.filter(x=>x.productId!==i.productId), i] }),
  remove: (id)=> set({ items: get().items.filter(x=>x.productId!==id) }),
  clear: ()=> set({ items: [] })
}), { name:'bb-cart' }));
