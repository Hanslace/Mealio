/* src/context/DataContext.tsx */
import React, { createContext, useContext, useState } from 'react';
import { restaurantsData } from '../data/restaurants';
import { menuItemsData } from '../data/menuItems';
import { ordersData } from '../data/orders';

export interface CartItem {
  menuItemId: string;
  quantity: number;
}

interface DataContextValue {
  restaurants: typeof restaurantsData;
  menuItems: typeof menuItemsData;
  orders: typeof ordersData;

  cart: CartItem[];
  addToCart: (menuItemId: string) => void;
  removeFromCart: (menuItemId: string) => void;
  clearCart: () => void;
}

export const DataContext = createContext<DataContextValue>({} as DataContextValue);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (menuItemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === menuItemId);
      if (existing) {
        return prev.map((c) =>
          c.menuItemId === menuItemId ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        return [...prev, { menuItemId, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === menuItemId);
      if (!existing) return prev;
      if (existing.quantity > 1) {
        return prev.map((c) =>
          c.menuItemId === menuItemId ? { ...c, quantity: c.quantity - 1 } : c
        );
      } else {
        return prev.filter((c) => c.menuItemId !== menuItemId);
      }
    });
  };

  const clearCart = () => setCart([]);

  return (
    <DataContext.Provider
      value={{
        restaurants: restaurantsData,
        menuItems: menuItemsData,
        orders: ordersData,
        cart,
        addToCart,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
