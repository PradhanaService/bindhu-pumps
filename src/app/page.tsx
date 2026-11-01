import Link from 'next/link';
import { CtaBand } from '@/components/CtaBand';
import { ProductCard } from '@/components/shop/ProductCard';
import { catalogue } from '@/content/catalogue';
import { ArrowRight } from '@/components/Icons';
import { products } from '@/content/products';
import { brand, siteUrl, siteDescription } from '@/content/site';
import s from './home.module.css';

/** Three short reasons to buy, linking to the pages that explain each one. */
const promises = [
  {
    no: '01',
    title: 'Selected for your site',
    body: 'Each pump is matched to the water source, depth, distance and power supply it has to work with.',
    href: '/products',
    cta: 'Pump categories',
  },
  {
    no: '02',
    title: 'Order online',
    body: 'Add pumps to your cart and send an order request. We confirm price, delivery and payment with you.',
    href: '/shop',
    cta: 'Browse the shop',
  },
  {
    no: '03',
    title: 'Serviced after installation',
    body: 'Maintenance, repairs, AMC plans and technical help once the pump is in the ground.',
    href: '/service',
    cta: 'Service and support',
  },
];

const featured = catalogue.filter((i) => i.featured).slice(0, 4);

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: `${brand.name} ${brand.descriptor}`,
    url: siteUrl,
    description: siteDescription,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ---------- Hero ---------- */}
      <section className={s.hero} aria-labelledby="hero-title">
        <div className={`container ${s.heroGrid}`}>
          <div className={s.heroCopy}>
            <p className="label">Water pump engineering, sales and service</p>
            <h1 id="hero-title" className={s.heroTitle}>
              <span className="hl">Pumps for borewells,</span> open wells, farms and buildings.
            </h1>
            <p className={s.heroLead}>
              We supply and service submersible, borewell, openwell, agricultural and monoblock pumps. Each pump is selected from the water source, depth, distance and power supply on
              site, and supported after installation with maintenance and AMC plans.
            </p>
            <div className={s.heroActions}>
              <Link href="/shop" className="btn btn--primary">
                Explore products <ArrowRight />
              </Link>
              <Link href="/contact#enquiry" className="btn btn--ghost">
                Request a quote
              </Link>
            </div>
          </div>
          <div className={`notch on-dark ${s.heroShop}`} aria-labelledby="hero-shop-title">
            <div className={`notch__tab ${s.heroShopTab}`}>
              <h2 id="hero-shop-title" className={s.heroShopTitle}>
                Products <span className="hl">for sale</span>
              </h2>
            </div>
            <div className={s.heroShopHead}>
              <Link href="/shop" className={s.heroShopAll}>
                View all {catalogue.length} products <ArrowRight />
              </Link>
            </div>
            <ul className={s.heroShopGrid}>
              {featured.map((item) => (
                <li key={item.slug}>
                  <ProductCard item={item} tone="dark" layout="row" sizes="(min-width: 1100px) 12vw, 40vw" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <nav className={s.index} aria-label="Product categories">
          <div className="container">
            <ol className={s.indexList}>
              {products.map((p) => (
                <li key={p.slug}>
                  <Link href={`/products/${p.slug}`}>
                    <span className={s.indexNo}>{p.index}</span>
                    <span className={s.indexName}>{p.name}</span>
                    <span className={s.indexPos}>{p.position}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </nav>
      </section>

      {/* ---------- Why buy here ---------- */}
      <section className={`section ${s.promiseSection}`} aria-labelledby="promise-title">
        <div className="container">
          <h2 id="promise-title" className="sr-only">
            Why buy from us
          </h2>
          <ul className={s.promises}>
            {promises.map((p) => (
              <li key={p.no}>
                <Link href={p.href} className={s.promise}>
                  <span className={s.promiseNo}>{p.no}</span>
                  <span className={s.promiseTitle}>{p.title}</span>
                  <span className={s.promiseBody}>{p.body}</span>
                  <span className={s.promiseCta}>
                    {p.cta} <ArrowRight />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
