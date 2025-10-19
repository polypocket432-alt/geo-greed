export interface PriceAlert {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  product_brand?: string;
  store_id: string;
  store_name: string;
  target_price: number;
  current_price: number;
  is_active: boolean;
  notified: boolean;
  created_at: string;
  updated_at: string;
}
