"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_STORAGE_KEY = "tienda-nova-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let restoredItems: CartItem[] = [];
    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed: unknown = JSON.parse(savedCart);
        if (
          Array.isArray(parsed) &&
          parsed.every(
            (item): item is CartItem =>
              typeof item === "object" &&
              item !== null &&
              "product" in item &&
              "quantity" in item &&
              typeof item.quantity === "number" &&
              item.quantity > 0 &&
              typeof item.product === "object" &&
              item.product !== null &&
              "id" in item.product &&
              "stock" in item.product &&
              typeof item.product.id === "number" &&
              typeof item.product.stock === "number",
          )
        ) {
          restoredItems = parsed;
        }
      }
    } catch (error) {
      console.error("No se pudo recuperar el carrito guardado.", error);
    }
    const restoreTimer = window.setTimeout(() => {
      setItems(restoredItems);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error("No se pudo guardar el carrito en este dispositivo.", error);
      }
    }
  }, [hydrated, items]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (!existing) {
        return [...current, { product, quantity: Math.min(quantity, product.stock) }];
      }
      return current.map((item) =>
        item.product.id === product.id
          ? {
              ...item,
              quantity: Math.min(item.quantity + quantity, product.stock),
              product,
            }
          : item,
      );
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: Math.min(Math.max(1, quantity), item.product.stock),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce(
        (total, item) => total + Number(item.product.price) * item.quantity,
        0,
      ),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [addItem, clearCart, items, removeItem, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider.");
  return context;
}
