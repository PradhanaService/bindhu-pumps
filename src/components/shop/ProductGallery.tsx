'use client';

import { useState } from 'react';
import type { CatalogueItem } from '@/content/catalogue';
import { ProductImage } from './ProductImage';
import styles from './gallery.module.css';

/** Main image with thumbnails, plus a link to the 3D model when one exists. */
export function ProductGallery({ item }: { item: CatalogueItem }) {
  const [index, setIndex] = useState(0);
  const count = Math.max(1, item.images.length);
  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <ProductImage item={item} index={index} sizes="(min-width: 1000px) 50vw, 100vw" priority />
      </div>
      <ul className={styles.thumbs} aria-label="Product views">
        {Array.from({ length: count }, (_, i) => (
          <li key={i}>
            <button type="button" className={styles.thumb} aria-pressed={index === i} aria-label={`Show image ${i + 1}`} onClick={() => setIndex(i)}>
              <ProductImage item={item} index={i} sizes="96px" />
            </button>
          </li>
        ))}
        {item.model && (
          <li>
            <a href="#model" className={`${styles.thumb} ${styles.thumb3d}`}>
              <span>3D</span>
              <span className={styles.thumb3dSub}>View model</span>
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
