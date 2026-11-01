import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { Pending, PendingBlock } from '@/components/Pending';
import { ArrowRight } from '@/components/Icons';
import { companyFacts, brand } from '@/content/site';
import { products } from '@/content/products';
import s from '../inner.module.css';

export const metadata: Metadata = {
  title: 'Company and capabilities',
  description: 'Water pump engineering, sales and service: pump selection, supply and after-sales support for agricultural, residential and industrial installations.',
  alternates: { canonical: '/company' },
};

const capabilities = [
  {
    title: 'Experience and expertise',
    body: 'The business works across the full life of a pump installation: selecting the pump for the duty, supplying it, and servicing it afterwards. That combination keeps selection decisions grounded in how pumps perform in the field.',
    pending: 'Years in operation and team experience',
  },
  {
    title: 'Product quality approach',
    body: 'Quality starts with fitting the pump to the duty. A pump operating close to its design point runs cooler, wears more slowly and uses less energy than one that is oversized or undersized for the installation.',
    pending: 'Brands, sourcing and inspection practice',
  },
  {
    title: 'Engineering and technical support',
    body: 'Pump selection is based on the water source, total head, required flow and power supply. Engineering support covers head and flow calculation, category selection and review of installations that are not performing.',
    pending: null,
  },
  {
    title: 'Service capabilities',
    body: 'Inspection, repair and preventive maintenance of installed pumps, with annual maintenance contracts available for installations that need scheduled care.',
    pending: 'Service area and facilities',
  },
  {
    title: 'Distribution and delivery',
    body: 'Details of stock, delivery coverage and lead times will be published once confirmed.',
    pending: 'Delivery coverage and lead times',
  },
];

export default function CompanyPage() {
  return (
    <>
      <PageHero
        label="Company"
        title="A water pump engineering, sales and service business."
        lead="We supply submersible, borewell, openwell, agricultural and monoblock pumps and support them after installation. The work is practical: understand the site, select the right pump, and keep it running."
        crumbs={[{ label: 'Company' }]}
      />

      <section className="section" aria-labelledby="bg-title">
        <div className={`container ${s.split}`}>
          <div>
            <p className="label">Background</p>
            <h2 id="bg-title">What the business does</h2>
          </div>
          <div className={s.splitBody}>
            <p>
              The business covers three connected activities. Engineering: working out the duty a pump has to meet from the water source, depth, distance and supply. Sales: supplying the
              pump category and model that meets that duty. Service: maintaining and repairing pumps once they are installed, including annual maintenance contracts.
            </p>
            <p>
              The customers are farms drawing water for irrigation, homes and residential buildings lifting water to overhead tanks, and industrial and construction sites that need water
              moved reliably.
            </p>
            <div style={{ marginTop: 32 }}>
              <PendingBlock title="Company history to be confirmed">
                Founding year, location and company history will be added from verified information supplied by the business.
              </PendingBlock>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--paper2" aria-labelledby="facts-title">
        <div className={`container ${s.split}`}>
          <div>
            <p className="label">Company facts</p>
            <h2 id="facts-title">At a glance</h2>
            <p className={s.splitBody} style={{ marginTop: 18, fontSize: '0.9375rem' }}>
              Only verified facts are published here. Items marked as pending are awaiting confirmation from {brand.isPlaceholder ? 'the business' : brand.name}.
            </p>
          </div>
          <dl className={s.facts}>
            {companyFacts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value ?? <Pending />}</dd>
              </div>
            ))}
            <div>
              <dt>Product categories</dt>
              <dd>
                {products.map((p, i) => (
                  <span key={p.slug}>
                    <Link href={`/products/${p.slug}`}>{p.name}</Link>
                    {i < products.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt>Services</dt>
              <dd>
                <Link href="/service">Product support, warranty, service and maintenance, AMC plans, technical assistance</Link>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section section--dark" aria-labelledby="cap-title">
        <div className="container">
          <div className="section-head">
            <p className="label">Capabilities</p>
            <h2 id="cap-title">From selection to service</h2>
            <p className="section-intro">How the business approaches each stage of a pump installation.</p>
          </div>
          <div className={s.caps}>
            {capabilities.map((c, i) => (
              <article key={c.title} className={s.cap}>
                <span className={s.capNo}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{c.title}</h3>
                <div>
                  <p>{c.body}</p>
                  {c.pending && <Pending label={`${c.pending}: to be confirmed`} />}
                </div>
              </article>
            ))}
          </div>
          <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/products" className="btn btn--primary">
              View the product range <ArrowRight />
            </Link>
            <Link href="/service" className="btn btn--ghost">
              Service and support
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
