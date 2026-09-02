import { api } from './api';
export const orderService = {
  create: (payload:any)=> api.post('/orders', payload).then(r=>r.data),
  track: (order_number:string, mobile:string)=> api.post('/orders/track',{order_number,mobile}).then(r=>r.data),
};
