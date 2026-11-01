import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/shop/ProductGallery';
import { AddToCart } from '@/components/shop/AddToCart';
import { ProductCard } from '@/components/shop/ProductCard';
import { SampleTag } from '@/components/shop/SampleTag';
import { PendingBlock } from '@/components/Pending';
import PumpViewer from '@/components/viewer/PumpViewer';
import { catalogue, formatPrice, getItem } from '@/content/catalogue';
import { getProduct } from '@/content/products';
import { contact, whatsappHref } from '@/content/site';
import s from './item.module.css';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return catalogue.map((i) => ({ slug: i.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) return {};
  return { title: item.name, description: `${item.tagline}. ${item.description[0]}`, alternates: { canonical: `/shop/${item.slug}` } };
}

export default async function ItemPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) notFound();
  const cat = getProduct(item.category);
  const related = [...catalogue.filter((i) => i.slug !== item.slug && i.category === item.category), ...catalogue.filter((i) => i.slug !== item.slug && i.category !== item.category)].slice(0, 3);

  return (
    <>
      <section className={s.top} aria-labelledby="item-title">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className={s.crumbs}>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/shop">Shop</Link>
              </li>
              {cat && (
                <li>
                  <Link href={`/shop?category=${cat.slug}`}>{cat.name}</Link>
                </li>
              )}
              <li>
                <span aria-current="page">{item.name}</span>
              </li>
            </ol>
          </nav>

          <div className={s.grid}>
            <ProductGallery item={item} />

            <div className={s.buy}>
              {cat && (
                <Link href={`/products/${cat.slug}`} className={s.cat}>
                  {cat.name}
                </Link>
              )}
              <h1 id="item-title" className={s.title}>
                {item.name}
              </h1>
              <p className={s.sku}>
                SKU <span className="mono">{item.sku}</span>
                {item.isSample && <SampleTag label="Sample product" />}
              </p>
              <p className={s.tagline}>{item.tagline}</p>

              <div className={s.priceRow}>
                <p className={s.price}>{formatPrice(item.price)}</p>
                {item.isSample && <SampleTag label="Sample price" />}
              </div>
              <p className={s.priceNote}>Listed price per unit. Final price, taxes and delivery are confirmed when we reply to your order request.</p>

              <ul className={s.highlights}>
                {item.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>

              <AddToCart slug={item.slug} />

              <div className={s.secondary}>
                <Link href={`/contact?product=${item.category}#enquiry`} className="btn btn--ghost">
                  Ask a question
                </Link>
                {contact.whatsapp && (
                  <a
                    href={whatsappHref(contact.whatsapp, `Hello, I would like to order: ${item.name} (${item.sku}).`)}
                    className="btn btn--ghost"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Order on WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="desc-title">
        <div className={`container ${s.details}`}>
          <div>
            <p className="label">Description</p>
            <h2 id="desc-title" className={s.h2}>
              About this pump
            </h2>
            <div className={`prose ${s.desc}`}>
              {item.description.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            {cat && (
              <p className={s.more}>
                How {cat.name.toLowerCase()} work, where they are used and how to select them: <Link href={`/products/${cat.slug}`}>{cat.name} guide</Link>
              </p>
            )}
          </div>
          <div>
            <p className="label">Specifications</p>
            <h2 className={s.h2}>Technical data</h2>
            <table className="spec-table">
              <caption className="sr-only">Specifications for {item.name}</caption>
              <tbody>
                {item.specs.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">{r.label}</th>
                    <td>{r.value}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row">SKU</th>
                  <td className="mono">{item.sku}</td>
                </tr>
              </tbody>
            </table>
            {item.isSample && (
              <div style={{ marginTop: 20 }}>
                <PendingBlock title="Sample specifications">These values are examples. They will be replaced with the manufacturer&apos;s data for this product.</PendingBlock>
              </div>
            )}
          </div>
        </div>
      </section>

      {item.model && (
        <section id="model" className="section section--dark" aria-labelledby="model-title">
          <div className="container">
            <div className="section-head">
              <p className="label">3D model</p>
              <h2 id="model-title">Explore the pump in 3D.</h2>
              <p className="section-intro">
                Rotate, zoom, separate the parts and select components for an explanation. Shown: the reference model built from supplied engineering CAD. A model of this exact
                product will replace it when supplied.
              </p>
            </div>
            <PumpViewer variant="full" label={`3D model for ${item.name}`} />
          </div>
        </section>
      )}

      <section className="section section--paper2" aria-labelledby="rel-title">
        <div className="container">
          <div className={s.relHead}>
            <h2 id="rel-title" className={s.h2}>
              You may also need
            </h2>
            <Link href="/shop" className="link-arrow">
              All products
            </Link>
          </div>
          <ul className={s.related}>
            {related.map((r) => (
              <li key={r.slug}>
                <ProductCard item={r} sizes="(min-width: 1000px) 30vw, 100vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
