'use client';

import Link from 'next/link';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="page-hero on-dark" style={{ minHeight: '50vh' }}>
      <div className="container">
        <p className="label">Something went wrong</p>
        <h1 style={{ fontSize: 'var(--fs-h1)', marginTop: 18 }}>This page could not be displayed.</h1>
        <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
          <button type="button" className="btn btn--primary" onClick={reset}>
            Try again
          </button>
          <Link href="/" className="btn btn--ghost">
            Go to homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
