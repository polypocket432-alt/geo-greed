export interface StorePrice {
  id: string;
  storeName: string;
  storeLogo?: string;
  price: number;
  distance: number; // in kilometers
  address: string;
  latitude: number;
  longitude: number;
  inStock: boolean;
  lastUpdated: Date;
  discount?: number; // percentage discount
  dealText?: string; // promotional text
  storeUrl?: string; // link to online store
}

export interface Product {
  id: string;
  name: string;
  brand?: string;
  size?: string;
  category: string;
  imageUrl?: string;
  averagePrice: number;
  stores: StorePrice[];
}

export interface RelatedProduct {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  lowestPrice: number;
}
