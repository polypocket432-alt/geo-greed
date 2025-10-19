import React, { createContext, useContext, useState, ReactNode } from "react";
import { CartItem, StoreGroup } from "@/types/cart";
import { Product, StorePrice } from "@/types/product";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, store: StorePrice) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getStoreGroups: () => StoreGroup[];
  getOptimizedStoreGroups: () => {
    groups: StoreGroup[];
    recommendation: string;
    potentialSavings: number;
  };
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, store: StorePrice) => {
    const existingItem = cart.find(
      (item) => item.product.id === product.id && item.store.id === store.id
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${store.id}-${Date.now()}`,
        product,
        store,
        quantity: 1,
      };
      setCart([...cart, newItem]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getStoreGroups = (): StoreGroup[] => {
    const groups: Record<string, StoreGroup> = {};

    cart.forEach((item) => {
      if (!groups[item.store.id]) {
        groups[item.store.id] = {
          storeName: item.store.storeName,
          storeId: item.store.id,
          address: item.store.address,
          distance: item.store.distance,
          items: [],
          total: 0,
          recommended: true,
        };
      }

      groups[item.store.id].items.push(item);
      groups[item.store.id].total += item.store.price * item.quantity;
    });

    return Object.values(groups).sort((a, b) => a.distance - b.distance);
  };

  const getOptimizedStoreGroups = () => {
    const groups = getStoreGroups();
    
    if (groups.length === 0) {
      return { groups: [], recommendation: "", potentialSavings: 0 };
    }

    if (groups.length === 1) {
      return {
        groups,
        recommendation: `Shop at ${groups[0].storeName} for all your items.`,
        potentialSavings: 0,
      };
    }

    // Check if all stores have 5+ items
    const allStoresHaveEnoughItems = groups.every(g => g.items.length >= 5);

    if (allStoresHaveEnoughItems) {
      // Recommend shopping at all stores
      const totalCost = groups.reduce((sum, g) => sum + g.total, 0);
      return {
        groups: groups.map(g => ({ ...g, recommended: true })),
        recommendation: `Visit ${groups.length} stores to get the best prices on all items.`,
        potentialSavings: 0,
      };
    }

    // Find stores with fewer than 5 items
    const smallStores = groups.filter(g => g.items.length < 5);
    const largeStores = groups.filter(g => g.items.length >= 5);

    if (largeStores.length === 0) {
      // No store has 5+ items, find the cheapest overall
      const sortedByTotal = [...groups].sort((a, b) => a.total - b.total);
      const cheapestStore = sortedByTotal[0];
      
      // Calculate alternative cost if buying everything at cheapest store
      let alternativeTotal = 0;
      cart.forEach((item) => {
        // Find the price of this product at the cheapest store
        const productInCheapestStore = cart.find(
          ci => ci.product.id === item.product.id && ci.store.id === cheapestStore.storeId
        );
        
        if (productInCheapestStore) {
          alternativeTotal += productInCheapestStore.store.price * item.quantity;
        } else {
          // If product not available at cheapest store, use highest price from cart
          alternativeTotal += item.store.price * item.quantity;
        }
      });

      const currentTotal = groups.reduce((sum, g) => sum + g.total, 0);
      const extraCost = alternativeTotal - currentTotal;

      return {
        groups: groups.map(g => ({
          ...g,
          recommended: g.storeId === cheapestStore.storeId,
          alternativeTotal: g.storeId === cheapestStore.storeId ? alternativeTotal : undefined,
        })),
        recommendation: `Shop at ${cheapestStore.storeName} for all items to save time. Extra cost: £${extraCost.toFixed(2)} vs shopping at multiple stores.`,
        potentialSavings: -extraCost,
      };
    }

    // We have large stores and small stores
    // Recommend consolidating small store items into the nearest large store
    const primaryStore = largeStores.sort((a, b) => a.distance - b.distance)[0];
    
    let consolidatedTotal = primaryStore.total;
    smallStores.forEach(smallStore => {
      smallStore.items.forEach(item => {
        // Assume product might be slightly more expensive at primary store
        // For simplicity, add 10% to the price (in real scenario, you'd check actual prices)
        consolidatedTotal += item.store.price * 1.1 * item.quantity;
      });
    });

    const currentTotal = groups.reduce((sum, g) => sum + g.total, 0);
    const extraCost = consolidatedTotal - currentTotal;

    return {
      groups: groups.map(g => ({
        ...g,
        recommended: largeStores.some(ls => ls.storeId === g.storeId),
        alternativeTotal: g.storeId === primaryStore.storeId ? consolidatedTotal : undefined,
      })),
      recommendation: extraCost < 5
        ? `Shop at ${primaryStore.storeName} and ${largeStores.length > 1 ? largeStores.slice(1).map(s => s.storeName).join(' and ') : ''} to maximize savings.`.trim()
        : `Consider shopping only at ${primaryStore.storeName}. Small extra cost (£${extraCost.toFixed(2)}) saves you extra trips.`,
      potentialSavings: -extraCost,
    };
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (sum, item) => sum + item.store.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getStoreGroups,
        getOptimizedStoreGroups,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
