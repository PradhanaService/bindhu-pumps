import Image from 'next/image';
import type { CatalogueItem } from '@/content/catalogue';
import { getProduct } from '@/content/products';
import { CategorySchematic } from '@/components/schematics/CategorySchematic';
import styles from './shop.module.css';

/** Product photo, or a drawn placeholder until a photo is supplied. */
export function ProductImage({ item, index = 0, sizes, priority = false, tone = 'light' }: { item: CatalogueItem; index?: number; sizes: string; priority?: boolean; tone?: 'light' | 'dark' }) {
  const img = item.images[index];
  if (img) {
    return (
      <div className={styles.photo}>
        <Image src={img.src} alt={img.alt} fill sizes={sizes} priority={priority} className={styles.photoImg} />
      </div>
    );
  }
  const cat = getProduct(item.category);
  return (
    <div className={`${styles.photo} ${styles.placeholder} ${tone === 'dark' ? styles.placeholderDark : ''}`} role="img" aria-label={`${item.name}: photo not yet available`}>
      {cat && (
        <div className={styles.placeholderArt} aria-hidden="true">
          <CategorySchematic kind={cat.schematic} title={cat.name} compact />
        </div>
      )}
      <span className={styles.placeholderNote}>Photo to be supplied</span>
    </div>
  );
}
