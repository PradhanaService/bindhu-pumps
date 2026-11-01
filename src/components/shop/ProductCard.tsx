import Link from 'next/link';
import { formatPrice, type CatalogueItem } from '@/content/catalogue';
import { getProduct } from '@/content/products';
import { ProductImage } from './ProductImage';
import { SampleTag } from './SampleTag';
import styles from './shop.module.css';

export function ProductCard({
  item,
  tone = 'light',
  layout = 'stack',
  sizes = '(min-width: 1100px) 25vw, 50vw',
}: {
  item: CatalogueItem;
  tone?: 'light' | 'dark';
  layout?: 'stack' | 'row';
  sizes?: string;
}) {
  const cat = getProduct(item.category);
  return (
    <article className={`${styles.card} ${tone === 'dark' ? styles.cardDark : ''} ${layout === 'row' ? styles.cardRow : ''}`}>
      <Link href={`/shop/${item.slug}`} className={styles.cardLink}>
        <ProductImage item={item} sizes={sizes} tone={tone} />
        <div className={styles.cardBody}>
          <p className={styles.cardCat}>{cat?.name}</p>
          <h3 className={styles.cardName}>{item.name}</h3>
          <p className={styles.cardTag}>{item.tagline}</p>
          <p className={styles.cardPrice}>
            <span>{formatPrice(item.price)}</span>
            {item.isSample && <SampleTag label="Sample price" />}
          </p>
        </div>
      </Link>
    </article>
  );
}
