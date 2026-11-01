'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MAX_QTY, useCart } from './CartProvider';
import styles from './shop.module.css';

export function AddToCart({ slug, withQty = true, compact = false }: { slug: string; withQty?: boolean; compact?: boolean }) {
  const { add, lines } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const inCart = lines.find((l) => l.slug === slug)?.qty ?? 0;

  const onAdd = () => {
    add(slug, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className={`${styles.atc} ${compact ? styles.atcCompact : ''}`}>
      {withQty && (
        <div className={styles.qty} role="group" aria-label="Quantity">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" disabled={qty <= 1}>
            −
          </button>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_QTY}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(MAX_QTY, Number(e.target.value) || 1)))}
            aria-label="Quantity"
          />
          <button type="button" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} aria-label="Increase quantity" disabled={qty >= MAX_QTY}>
            +
          </button>
        </div>
      )}
      <button type="button" className="btn btn--primary" onClick={onAdd}>
        {added ? 'Added to cart' : 'Add to cart'}
      </button>
      <p className={styles.atcStatus} role="status" aria-live="polite">
        {inCart > 0 && (
          <>
            {inCart} in cart. <Link href="/cart">View cart</Link>
          </>
        )}
      </p>
    </div>
  );
}
