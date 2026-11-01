'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getItem, type CatalogueItem } from '@/content/catalogue';

type Line = { slug: string; qty: number };
export type CartLine = Line & { item: CatalogueItem };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const STORAGE_KEY = 'cart:v1';
export const MAX_QTY = 99;
const CartContext = createContext<CartContextValue | null>(null);

function read(): Line[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Line[]) : [];
    return Array.isArray(parsed) ? parsed.filter((l) => getItem(l.slug) && l.qty > 0).map((l) => ({ slug: l.slug, qty: Math.min(MAX_QTY, Math.floor(l.qty)) })) : [];
  } catch {
    return [];
  }
}

function write(lines: Line[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* Storage unavailable (private mode): the cart still works for this visit. */
  }
}

/** Cart kept in the visitor's browser. Prices are always re-read from the catalogue, never stored. */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<Line[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRaw(read());
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setRaw(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = useCallback((fn: (prev: Line[]) => Line[]) => {
    setRaw((prev) => {
      const next = fn(prev);
      write(next);
      return next;
    });
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const lines = raw.map((l) => ({ ...l, item: getItem(l.slug)! })).filter((l) => l.item);
    return {
      lines,
      ready,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * l.item.price, 0),
      add: (slug, qty = 1) =>
        update((prev) => {
          const found = prev.find((l) => l.slug === slug);
          if (found) return prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
          return [...prev, { slug, qty: Math.min(MAX_QTY, qty) }];
        }),
      setQty: (slug, qty) =>
        update((prev) => (qty <= 0 ? prev.filter((l) => l.slug !== slug) : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(MAX_QTY, Math.floor(qty)) } : l)))),
      remove: (slug) => update((prev) => prev.filter((l) => l.slug !== slug)),
      clear: () => update(() => []),
    };
  }, [raw, ready, update]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
