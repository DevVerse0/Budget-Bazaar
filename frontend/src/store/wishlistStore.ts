import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useWishlistStore = create<any>()(persist((set,get:any)=>({
  ids: [] as string[], toggle:(id:string)=> set({ ids: get().ids.includes(id)? get().ids.filter((x:string)=>x!==id) : [...get().ids,id] })
}),{name:'bb-wishlist'}));
