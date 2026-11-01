import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { CategorySchematic } from '@/components/schematics/CategorySchematic';
import { CtaBand } from '@/components/CtaBand';
import { Pending } from '@/components/Pending';
import { ArrowRight } from '@/components/Icons';
import { products } from '@/content/products';
import { getApplication } from '@/content/applications';
import s from './products.module.css';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Submersible, borewell, openwell, agricultural and monoblock water pumps. Compare installation, water source and priming for each category.',
  alternates: { canonical: '/products' },
};

const rows: { label: string; get: (p: (typeof products)[number]) => React.ReactNode }[] = [
  { label: 'Installed', get: (p) => p.position },
  { label: 'Water source', get: (p) => p.waterSource },
  { label: 'Priming', get: (p) => p.priming },
  { label: 'Power range', get: (p) => p.specs.find((r) => r.label === 'Power rating')?.value ?? <Pending /> },
  { label: 'Head range', get: (p) => p.specs.find((r) => r.label === 'Head range')?.value ?? <Pending /> },
  { label: 'Supply', get: (p) => p.specs.find((r) => r.label === 'Supply')?.value ?? <Pending /> },
];

export default function ProductsPage() {
  return (
    <>
      <PageHero
        label="Product range"
        accent="Water pumps" title="by installation and water source."
        lead="Five categories cover borewells, open wells, sumps, tanks, canals and surface installations. Compare them below, then open a category for its construction, specifications and applications."
        crumbs={[{ label: 'Products' }]}
      />

      <section className="section section--tight" aria-labelledby="compare-title">
        <div className="container">
          <div className={s.compareHead}>
            <h2 id="compare-title">Category comparison</h2>
            <p>
              Model-specific values are being confirmed against the catalogue and are marked <Pending />.
            </p>
          </div>
          <div className="table-scroll" tabIndex={0} role="region" aria-labelledby="compare-title">
            <table className={`spec-table ${s.compare}`}>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr-only">Property</span>
                  </th>
                  {products.map((p) => (
                    <th scope="col" key={p.slug}>
                      <span className={s.colNo}>{p.index}</span>
                      <Link href={`/products/${p.slug}`}>{p.name}</Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">{r.label}</th>
                    {products.map((p) => (
                      <td key={p.slug}>{r.get(p)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Product categories" style={{ paddingTop: 0 }}>
        <div className="container">
          {products.map((p) => (
            <article key={p.slug} className={`${s.cat} reveal`} aria-labelledby={`cat-${p.slug}`}>
              <div className={s.catFig}>
                <CategorySchematic kind={p.schematic} title={`${p.name}: installation schematic`} />
              </div>
              <div className={s.catBody}>
                <p className="label">Category {p.index}</p>
                <h2 id={`cat-${p.slug}`}>{p.name}</h2>
                <p className={s.catLead}>{p.overview[0]}</p>
                <dl className={s.catApps}>
                  <dt>Applications</dt>
                  <dd>
                    {p.applications
                      .map((a) => getApplication(a))
                      .filter(Boolean)
                      .map((a) => (
                        <Link key={a!.slug} href={`/applications#${a!.slug}`}>
                          {a!.name}
                        </Link>
                      ))}
                  </dd>
                </dl>
                <div className={s.catActions}>
                  <Link href={`/products/${p.slug}`} className="btn btn--dark">
                    View {p.name.toLowerCase()} <ArrowRight />
                  </Link>
                  <Link href={`/contact?product=${p.slug}#enquiry`} className="btn btn--ghost">
                    Enquire
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBand title="Not sure which category fits your installation?" body="Describe the water source, the depth to water and where the water needs to go. We will recommend the category and model." />
    </>
  );
}
