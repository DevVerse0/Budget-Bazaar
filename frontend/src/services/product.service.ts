import { api } from './api';
export const productService = {
  list: (params:any)=> api.get('/products',{params}).then(r=>r.data),
  get: (slug:string)=> api.get(`/products/${slug}`).then(r=>r.data),
};
