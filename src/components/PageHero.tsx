import Link from 'next/link';

export type Crumb = { href?: string; label: string };

export function PageHero({ label, title, lead, crumbs, aside }: { label: string; title: string; lead?: string; crumbs: Crumb[]; aside?: React.ReactNode }) {
  return (
    <section className="page-hero on-dark">
      <div className="container page-hero__grid">
        <nav aria-label="Breadcrumb" style={{ gridColumn: '1 / -1' }}>
          <ol className="breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            {crumbs.map((c, i) => (
              <li key={c.label}>{c.href && i < crumbs.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>
            ))}
          </ol>
        </nav>
        <div className="page-hero__main">
          <p className="label">{label}</p>
          <h1>{title}</h1>
          {lead && <p className="lead" style={{ marginTop: 20, maxWidth: '62ch' }}>{lead}</p>}
        </div>
        {aside && <div className="page-hero__aside">{aside}</div>}
      </div>
    </section>
  );
}
