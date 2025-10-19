import { Product } from "@/types/product";
import { calculateDistance } from "./distance";

export function updateStoreDistances(
  products: Product[],
  userLat: number,
  userLon: number
): Product[] {
  return products.map((product) => ({
    ...product,
    stores: product.stores
      .map((store) => ({
        ...store,
        distance: calculateDistance(userLat, userLon, store.latitude, store.longitude),
      }))
      .sort((a, b) => a.distance - b.distance), // Sort by distance
  }));
}
