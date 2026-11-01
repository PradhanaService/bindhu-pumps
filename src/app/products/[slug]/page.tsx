import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/PageHero';
import { CategorySchematic } from '@/components/schematics/CategorySchematic';
import { EnquiryForm } from '@/components/EnquiryForm';
import { Pending, PendingBlock } from '@/components/Pending';
import { ArrowRight } from '@/components/Icons';
import PumpViewer from '@/components/viewer/PumpViewer';
import { getProduct, products } from '@/content/products';
import { getApplication, sectors } from '@/content/applications';
import { ContactList } from '@/components/ContactLinks';
import s from './detail.module.css';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return products.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.summary} Construction, specifications, applications and enquiries.`,
    alternates: { canonical: `/products/${p.slug}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const apps = p.applications.map((a) => getApplication(a)).filter((a): a is NonNullable<typeof a> => Boolean(a));
  const related = p.related.map((r) => getProduct(r)).filter((r): r is NonNullable<typeof r> => Boolean(r));
  const verifiedSpecs = p.specs.filter((r) => r.value).length;

  return (
    <>
      <PageHero
        label={`Category ${p.index}`}
        title={p.name}
        lead={p.summary}
        crumbs={[{ href: '/products', label: 'Products' }, { label: p.name }]}
        aside={
          <dl className={s.quick}>
            <div>
              <dt>Installed</dt>
              <dd>{p.position}</dd>
            </div>
            <div>
              <dt>Water source</dt>
              <dd>{p.waterSource}</dd>
            </div>
            <div>
              <dt>Priming</dt>
              <dd>{p.priming}</dd>
            </div>
          </dl>
        }
      />

      <nav className={s.local} aria-label="On this page">
        <div className="container">
          <ul>
            <li>
              <a href="#overview">Overview</a>
            </li>
            {p.has3D && (
              <li>
                <a href="#model">3D model</a>
              </li>
            )}
            <li>
              <a href="#specifications">Specifications</a>
            </li>
            <li>
              <a href="#construction">Construction</a>
            </li>
            <li>
              <a href="#applications">Applications</a>
            </li>
            <li>
              <a href="#enquiry">Enquiry</a>
            </li>
          </ul>
          <Link href="#enquiry" className="btn btn--primary">
            Enquire about this category
          </Link>
        </div>
      </nav>

      {/* Overview */}
      <section id="overview" className="section" aria-labelledby="overview-title">
        <div className={`container ${s.overview}`}>
          <div className={s.overviewText}>
            <p className="label">Overview</p>
            <h2 id="overview-title">How {p.name.toLowerCase()} work</h2>
            <div className="prose">
              {p.overview.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
          </div>
          <div className={s.overviewFig}>
            <CategorySchematic kind={p.schematic} title={`${p.name}: installation schematic`} />
          </div>
        </div>
      </section>

      {p.has3D && (
        <section id="model" className="section section--dark" aria-labelledby="model-title">
          <div className="container">
            <div className="section-head">
              <p className="label">Interactive 3D model</p>
              <h2 id="model-title">Reference model: compact submersible pump.</h2>
              <p className="section-intro">
                Built from supplied engineering CAD. It shows the construction of a compact submersible unit and is not a specific model from this range.
              </p>
            </div>
            <PumpViewer variant="full" label={`3D reference model for ${p.name}`} />
          </div>
        </section>
      )}

      {/* Specifications */}
      <section id="specifications" className="section section--paper2" aria-labelledby="spec-title">
        <div className={`container ${s.specs}`}>
          <div className={s.specsSide}>
            <p className="label">Specifications</p>
            <h2 id="spec-title">Technical data</h2>
            <p className={s.specsNote}>
              {verifiedSpecs === p.specs.length
                ? 'Values apply across the category. Confirm the exact model data before ordering.'
                : 'Values for this range are being confirmed against the catalogue. Rows marked as pending will be filled with verified data only.'}
            </p>
            <div className={s.docs}>
              <h3>Technical documents</h3>
              {p.documents.length ? (
                <ul>
                  {p.documents.map((d) => (
                    <li key={d.href}>
                      <a href={d.href} download>
                        {d.title} <span className="mono">{d.format}{d.size ? `, ${d.size}` : ''}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <PendingBlock title="Data sheets not yet published">Catalogues and performance curves will be added here once supplied. Request them through the enquiry form.</PendingBlock>
              )}
            </div>
          </div>
          <div className="table-scroll" tabIndex={0} role="region" aria-labelledby="spec-title">
            <table className="spec-table">
              <thead>
                <tr>
                  <th scope="col">Parameter</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                {p.specs.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">
                      {row.label}
                      {row.hint && <span className="hint">{row.hint}</span>}
                    </th>
                    <td>{row.value ?? <Pending />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Construction and features */}
      <section id="construction" className="section" aria-labelledby="cons-title">
        <div className="container">
          <div className="section-head">
            <p className="label">Construction</p>
            <h2 id="cons-title">Main components</h2>
            <p className="section-intro">The arrangement common to this pump type. Materials and construction details for each model are listed in the specification table.</p>
          </div>
          <ol className="spec-list">
            {p.construction.map((c) => (
              <li key={c.title}>
                <div>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className={s.features}>
            <h2 className={s.subhead}>{p.slug === 'agriculture-pumps' ? 'Duty by irrigation method' : 'Characteristics of this pump type'}</h2>
            <dl className={s.featureGrid}>
              {p.features.map((f) => (
                <div key={f.title}>
                  <dt>{f.title}</dt>
                  <dd>{f.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Applications and selection */}
      <section id="applications" className="section section--dark" aria-labelledby="apps-title">
        <div className={`container ${s.apps}`}>
          <div>
            <p className="label">Applications</p>
            <h2 id="apps-title" className={s.appsTitle}>
              Where {p.name.toLowerCase()} are used
            </h2>
            <ul className={s.appList}>
              {apps.map((a) => {
                const sector = sectors.find((sec) => sec.applications.some((x) => x.slug === a.slug));
                const reason = a.categories.find((c) => c.slug === p.slug)?.reason;
                return (
                  <li key={a.slug}>
                    <Link href={`/applications#${a.slug}`}>
                      <span className={s.appSector}>{sector?.name}</span>
                      <span className={s.appName}>{a.name}</span>
                      {reason && <span className={s.appReason}>{reason}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={s.inputs}>
            <h3>Information needed for selection</h3>
            <ol>
              {p.selectionInputs.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ol>
            <p>Installation and operating guidance for a specific model is provided with the product documentation.</p>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="section section--tight" aria-labelledby="related-title">
        <div className="container">
          <h2 id="related-title" className={s.subhead}>
            Related categories
          </h2>
          <ul className={s.related}>
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/products/${r.slug}`}>
                  <span className={s.relFig}>
                    <CategorySchematic kind={r.schematic} title={`${r.name} schematic`} compact />
                  </span>
                  <span className={s.relNo}>{r.index}</span>
                  <span className={s.relName}>{r.name}</span>
                  <span className={s.relSum}>{r.summary}</span>
                  <span className={s.relGo}>
                    View category <ArrowRight />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquiry" className="section section--paper2" aria-labelledby="enq-title">
        <div className={`container ${s.enquiry}`}>
          <div>
            <p className="label">Enquiry</p>
            <h2 id="enq-title" className={s.enqTitle}>
              Enquire about {p.name.toLowerCase()}
            </h2>
            <p className={s.enqLead}>Send the details you have. If you are unsure about any of them, describe the installation and we will ask for the rest.</p>
            <div className={s.enqContact}>
              <ContactList compact />
            </div>
          </div>
          <EnquiryForm defaultProduct={p.slug} title={`Enquiry about ${p.name}`} />
        </div>
      </section>
    </>
  );
}
