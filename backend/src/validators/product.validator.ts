import { z } from 'zod';
export const createProductSchema = z.object({
  name: z.string().min(2), slug: z.string().min(2), brand: z.string().optional(),
  category_id: z.string().uuid().nullable().optional(),
  regular_price: z.number().nonnegative(), sale_price: z.number().nonnegative().nullable().optional(),
  stock_quantity: z.number().int().nonnegative(), sku: z.string().optional(),
  status: z.enum(['active','hidden','out_of_stock']).default('active'),
  short_description: z.string().optional(), description: z.string().optional(),
  featured: z.boolean().optional(), trending: z.boolean().optional(),
});
