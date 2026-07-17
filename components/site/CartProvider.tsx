'use client';

import { createContext, useContext, useState, useCallback } from 'react';

type CartContextValue = { count: number; addOne: () => void };
const CartContext = createContext<CartContextValue>({ count: 2, addOne: () => {} });

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(2);
  const addOne = useCallback(() => setCount((c) => c + 1), []);
  return <CartContext.Provider value={{ count, addOne }}>{children}</CartContext.Provider>;
}
