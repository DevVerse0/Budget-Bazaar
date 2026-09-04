import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/services/api';
type S = {
  ids: string[];
  toggle: (id:string)=> Promise<void> | void;
  syncFromServer: ()=> Promise<void>;
  remove: (id:string)=> void;
};
export const useWishlistStore = create<S>()(persist((set,get)=>({
  ids: [],
  toggle: async (id:string)=>{
    const ids = get().ids;
    const exists = ids.includes(id);
    // optimistic local
    set({ ids: exists ? ids.filter(x=>x!==id) : [...ids, id] });
    // try server sync if logged in
    try{
      const token = typeof window!=='undefined' ? localStorage.getItem('token') : null;
      if(token){
        const res = await api.post('/wishlist/toggle', { productId:id });
        // server truth: if added:false means removed, added:true means added - already optimistic matches
        // if mismatch, revert? keep optimistic
      }
    }catch{ /* keep local for guest */ }
  },
  syncFromServer: async ()=>{
    try{
      const token = typeof window!=='undefined' ? localStorage.getItem('token') : null;
      if(!token) return;
      const { data } = await api.get('/wishlist');
      if(Array.isArray(data)){
        const serverIds = data.map((r:any)=> r.product_id || r.productId);
        set({ ids: serverIds });
      }
    }catch{}
  },
  remove: (id:string)=> set({ ids: get().ids.filter(x=>x!==id) })
}),{name:'bb-wishlist'}));
