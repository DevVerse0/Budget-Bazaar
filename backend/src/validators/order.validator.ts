import { z } from 'zod';
export const createOrderSchema = z.object({
  customer_name: z.string().min(2),
  mobile: z.string().min(11),
  alternative_mobile: z.string().optional(),
  division: z.string().optional(),
  district: z.string().min(1),
  area: z.string().optional(),
  full_address: z.string().min(5),
  notes: z.string().optional(),
  trx_id: z.string().optional(),
  items: z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().positive() })).min(1),
  couponCode: z.string().optional(),
  payment_method: z.enum(['cod','bkash','nagad','rocket','card']).default('cod'),
});
export const trackOrderSchema = z.object({ order_number: z.string(), mobile: z.string() });
