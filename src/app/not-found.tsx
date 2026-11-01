import Link from 'next/link';
import { products } from '@/content/products';

export default function NotFound() {
  return (
    <section className="page-hero on-dark" style={{ minHeight: '60vh' }}>
      <div className="container">
        <p className="label">Error 404</p>
        <h1 style={{ fontSize: 'var(--fs-h1)', marginTop: 18, maxWidth: '18ch' }}>This page does not exist.</h1>
        <p className="lead" style={{ marginTop: 20, maxWidth: '52ch' }}>
          The link may be out of date. Choose a product category below or return to the homepage.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '32px 0', display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
          {products.map((p) => (
            <li key={p.slug}>
              <Link href={`/products/${p.slug}`}>{p.name}</Link>
            </li>
          ))}
        </ul>
        <Link href="/" className="btn btn--primary">
          Go to homepage
        </Link>
      </div>
    </section>
  );
}
