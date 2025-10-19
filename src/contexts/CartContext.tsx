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
        };
      }

      groups[item.store.id].items.push(item);
      groups[item.store.id].total += item.store.price * item.quantity;
    });

    return Object.values(groups).sort((a, b) => a.distance - b.distance);
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
