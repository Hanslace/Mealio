import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
  menuItemId: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (menuItemId: string) => void;
  removeFromCart: (menuItemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    loadCart();
  }, []);

  const saveCart = useCallback(async (updatedCart: CartItem[]) => {
    try {
      setCart(updatedCart);
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, []);

  const addToCart = useCallback((menuItemId: string) => {
    setCart(prevCart => {
      const updatedCart = [...prevCart];
      const existing = updatedCart.find(item => item.menuItemId === menuItemId);

      if (existing) {
        existing.quantity += 1;
      } else {
        updatedCart.push({ menuItemId, quantity: 1 });
      }

      saveCart(updatedCart);
      return updatedCart;
    });
  }, [saveCart]);

  const removeFromCart = useCallback((menuItemId: string) => {
    setCart(prevCart => {
      const updatedCart = prevCart
        .map(item =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0);

      saveCart(updatedCart);
      return updatedCart;
    });
  }, [saveCart]);

  const clearCart = useCallback(() => {
    saveCart([]);
  }, [saveCart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
