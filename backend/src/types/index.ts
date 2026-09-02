export type Role = 'customer'|'admin';
export interface OrderInput {
  customer_name: string; mobile: string; alternative_mobile?: string;
  division?: string; district: string; area?: string; full_address: string; notes?: string;
  items: { productId: string; quantity: number }[];
  couponCode?: string; payment_method?: string;
}
