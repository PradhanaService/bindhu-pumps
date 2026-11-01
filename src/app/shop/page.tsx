import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { ProductCard } from '@/components/shop/ProductCard';
import { PendingBlock } from '@/components/Pending';
import { catalogue, hasSamples } from '@/content/catalogue';
import { products } from '@/content/products';
import s from './shop.module.css';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Submersible, borewell, openwell, agricultural and monoblock pumps with prices. Add to cart and send an order request.',
  alternates: { canonical: '/shop' },
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const active = typeof sp.category === 'string' && products.some((p) => p.slug === sp.category) ? sp.category : null;
  const items = active ? catalogue.filter((i) => i.category === active) : catalogue;
  const counts = Object.fromEntries(products.map((p) => [p.slug, catalogue.filter((i) => i.category === p.slug).length]));

  return (
    <>
      <PageHero
        label="Shop"
        title="Pumps for sale."
        lead="Browse the range, add pumps to your cart and send an order request. We confirm the final price, delivery and payment with you before anything is dispatched."
        crumbs={[{ label: 'Shop' }]}
      />
      <section className="section section--tight" aria-labelledby="shop-title">
        <div className="container">
          {hasSamples && (
            <div className={s.notice}>
              <PendingBlock title="Sample catalogue">
                The products, prices and specifications shown are examples for reviewing the shop layout. They will be replaced with the real catalogue.
              </PendingBlock>
            </div>
          )}
          <div className={s.bar}>
            <h2 id="shop-title" className={s.count}>
              {items.length} {items.length === 1 ? 'product' : 'products'}
              {active && <span> in {products.find((p) => p.slug === active)?.name}</span>}
            </h2>
            <nav aria-label="Filter by category">
              <ul className={s.filters}>
                <li>
                  <Link href="/shop" aria-current={!active ? 'page' : undefined} scroll={false}>
                    All <span>{catalogue.length}</span>
                  </Link>
                </li>
                {products.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/shop?category=${p.slug}`} aria-current={active === p.slug ? 'page' : undefined} scroll={false}>
                      {p.name.replace(' Pumps', '')} <span>{counts[p.slug]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          {items.length ? (
            <ul className={s.grid}>
              {items.map((item) => (
                <li key={item.slug}>
                  <ProductCard item={item} sizes="(min-width: 1100px) 30vw, (min-width: 640px) 45vw, 100vw" />
                </li>
              ))}
            </ul>
          ) : (
            <p className={s.empty}>
              No products are listed in this category yet. <Link href="/contact#enquiry">Send an enquiry</Link> and we will advise.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
