import { create } from 'zustand';
import { persist } from 'zustand/middleware';
type Item={ productId:string; name:string; price:number; qty:number; image?:string };
type S={ items: Item[]; add:(i:Item)=>void; updateQty:(id:string,qty:number)=>void; remove:(id:string)=>void; clear:()=>void };
export const useCartStore = create<S>()(persist((set,get)=>({
  items: [],
  add: (i)=> {
    const ex = get().items.find(x=>x.productId===i.productId);
    if(ex) set({ items: get().items.map(x=> x.productId===i.productId ? { ...x, qty: x.qty + i.qty, image: i.image || x.image, price: i.price } : x)});
    else set({ items: [...get().items, i]});
  },
  updateQty: (id,qty)=> {
    if(qty<=0) set({ items: get().items.filter(x=>x.productId!==id)});
    else set({ items: get().items.map(x=> x.productId===id ? { ...x, qty } : x)});
  },
  remove: (id)=> set({ items: get().items.filter(x=>x.productId!==id) }),
  clear: ()=> set({ items: [] })
}), { name:'bb-cart' }));
