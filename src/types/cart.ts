import { StorePrice, Product } from "./product";

export interface CartItem {
  id: string;
  product: Product;
  store: StorePrice;
  quantity: number;
}

export interface StoreGroup {
  storeName: string;
  storeId: string;
  address: string;
  distance: number;
  items: CartItem[];
  total: number;
  recommended: boolean;
  alternativeTotal?: number;
}
