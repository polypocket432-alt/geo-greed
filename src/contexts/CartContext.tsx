import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CartItem, StoreGroup } from "@/types/cart";
import { Product, StorePrice } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

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
  const { user } = useAuth();

  // Load cart from database when user logs in
  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
    } else {
      setCart([]);
    }
  }, [user]);

  const loadCartFromDatabase = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error loading cart:", error);
      return;
    }

    if (data) {
      const cartItems: CartItem[] = data.map((item) => ({
        id: item.id,
        product: {
          id: item.product_id,
          name: item.product_name,
          brand: item.product_brand || undefined,
          size: item.product_size || undefined,
          category: item.product_category,
          averagePrice: item.price,
          stores: [],
        },
        store: {
          id: item.store_id,
          storeName: item.store_name,
          address: item.store_address,
          price: item.price,
          distance: 0,
          latitude: 0,
          longitude: 0,
          inStock: true,
          lastUpdated: new Date(),
        },
        quantity: item.quantity,
      }));
      setCart(cartItems);
    }
  };

  const saveCartItemToDatabase = async (item: CartItem) => {
    if (!user) return;

    const { error } = await supabase.from("cart_items").upsert({
      id: item.id,
      user_id: user.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_brand: item.product.brand || null,
      product_size: item.product.size || null,
      product_category: item.product.category,
      store_id: item.store.id,
      store_name: item.store.storeName,
      store_address: item.store.address,
      price: item.store.price,
      quantity: item.quantity,
    });

    if (error) {
      console.error("Error saving cart item:", error);
    }
  };

  const deleteCartItemFromDatabase = async (itemId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  const addToCart = (product: Product, store: StorePrice) => {
    const existingItem = cart.find(
      (item) => item.product.id === product.id && item.store.id === store.id
    );

    if (existingItem) {
      const updatedItem = { ...existingItem, quantity: existingItem.quantity + 1 };
      setCart(
        cart.map((item) =>
          item.id === existingItem.id ? updatedItem : item
        )
      );
      saveCartItemToDatabase(updatedItem);
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${store.id}-${Date.now()}`,
        product,
        store,
        quantity: 1,
      };
      setCart([...cart, newItem]);
      saveCartItemToDatabase(newItem);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
    deleteCartItemFromDatabase(itemId);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      const updatedCart = cart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setCart(updatedCart);
      
      const updatedItem = updatedCart.find((item) => item.id === itemId);
      if (updatedItem) {
        saveCartItemToDatabase(updatedItem);
      }
    }
  };

  const clearCart = async () => {
    if (user) {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        console.error("Error clearing cart:", error);
      }
    }
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
      return {
        groups: groups.map(g => ({ ...g, recommended: true })),
        recommendation: `Shopping at ${groups.length} stores gets you the best prices on all items.`,
        potentialSavings: 0,
      };
    }

    // Find the store with the most items as primary recommendation
    const sortedByItemCount = [...groups].sort((a, b) => b.items.length - a.items.length);
    const primaryStore = sortedByItemCount[0];
    
    // Calculate what it would cost to buy everything at the primary store
    let consolidatedCost = 0;
    const productPriceMap = new Map<string, number>();
    
    // Build a map of product prices at primary store
    cart.forEach(item => {
      if (item.store.id === primaryStore.storeId) {
        productPriceMap.set(item.product.id, item.store.price);
      }
    });
    
    // Calculate consolidated cost (estimate higher prices for items not at primary store)
    cart.forEach(item => {
      const quantity = item.quantity;
      if (item.store.id === primaryStore.storeId) {
        consolidatedCost += item.store.price * quantity;
      } else {
        // Use current price + 10% as estimate for same product at primary store
        const estimatedPrice = item.store.price * 1.1;
        consolidatedCost += estimatedPrice * quantity;
      }
    });

    // Calculate current multi-store cost
    const currentMultiStoreCost = groups.reduce((sum, g) => sum + g.total, 0);
    const savings = consolidatedCost - currentMultiStoreCost;
    
    // Determine recommendation based on savings
    const smallStoreCount = groups.filter(g => g.items.length < 5).length;
    
    if (savings > 5) {
      // Significant savings by visiting multiple stores
      return {
        groups: groups.map(g => ({ ...g, recommended: true })),
        recommendation: `To save £${savings.toFixed(2)}, visit all ${groups.length} stores. To save time, shop only at ${primaryStore.storeName} (extra cost: £${savings.toFixed(2)}).`,
        potentialSavings: savings,
      };
    } else {
      // Small savings, recommend single store
      return {
        groups: groups.map(g => ({
          ...g,
          recommended: g.storeId === primaryStore.storeId,
        })),
        recommendation: `Save time - shop at ${primaryStore.storeName} for all items. Extra cost: only £${savings.toFixed(2)} vs visiting ${groups.length} stores.`,
        potentialSavings: savings,
      };
    }
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
