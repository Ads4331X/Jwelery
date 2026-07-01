// src/hooks/useCart.ts
import { useState, useEffect, useCallback } from "react";
import type { Product } from "../features/products/types";

export interface CartItem {
  product: Product;
  qty: number;
}

const STORAGE_KEY = "aj_cart";

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const listeners = new Set<() => void>();
function broadcast(): void {
  listeners.forEach((fn) => fn());
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(readCart);

  useEffect(() => {
    const sync = (_e: StorageEvent): void => {
      void _e;
      setItems(readCart());
    };
    const internalSync = (): void => setItems(readCart());
    listeners.add(internalSync);
    window.addEventListener("storage", sync);
    return () => {
      listeners.delete(internalSync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const save = useCallback((next: CartItem[]): void => {
    writeCart(next);
    setItems(next);
    broadcast();
  }, []);

  const addToCart = useCallback(
    (product: Product, qty = 1): void => {
      const current = readCart();
      const idx = current.findIndex((i) => i.product.id === product.id);
      if (idx >= 0) {
        current[idx] = {
          ...current[idx],
          qty: Math.min(product.stock, current[idx].qty + qty),
        };
      } else {
        current.push({ product, qty });
      }
      save(current);
    },
    [save],
  );

  const updateQty = useCallback(
    (productId: string, qty: number): void => {
      const current = readCart();
      const next =
        qty <= 0
          ? current.filter((i) => i.product.id !== productId)
          : current.map((i) =>
              i.product.id === productId ? { ...i, qty } : i,
            );
      save(next);
    },
    [save],
  );

  const removeFromCart = useCallback(
    (productId: string): void => {
      save(readCart().filter((i) => i.product.id !== productId));
    },
    [save],
  );

  const clearCart = useCallback((): void => save([]), [save]);

  const totalItems = items.reduce((acc, i) => acc + i.qty, 0);
  const cartCount = totalItems;
  const totalPrice = items.reduce(
    (acc, i) => acc + (i.product.computedPrice ?? 0) * i.qty,
    0,
  );

  return {
    items,
    totalItems,
    cartCount,
    totalPrice,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
  };
}
