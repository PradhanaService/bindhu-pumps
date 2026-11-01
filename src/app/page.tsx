import Link from 'next/link';
import PumpViewer from '@/components/viewer/PumpViewer';
import { CategorySchematic } from '@/components/schematics/CategorySchematic';
import { CtaBand } from '@/components/CtaBand';
import { ProductCard } from '@/components/shop/ProductCard';
import { catalogue } from '@/content/catalogue';
import { ArrowRight } from '@/components/Icons';
import { products } from '@/content/products';
import { services } from '@/content/services';
import { brand, siteUrl, siteDescription } from '@/content/site';
import s from './home.module.css';

const selectionInputs = [
  { title: 'Water source', body: 'Borewell, open well, sump, tank, canal or pond. This decides the pump type before anything else.' },
  { title: 'Depth to water', body: 'Static and pumping water level, measured from ground. For surface pumps, the height of the pump above the water.' },
  { title: 'Delivery point', body: 'Height of the tank or outlet above ground and the pipe distance to it. Together with depth, this sets the total head.' },
  { title: 'Required flow', body: 'How much water is needed and over what time, or the irrigation method and area to be covered.' },
  { title: 'Power supply', body: 'Single phase or three phase, and the hours supply is available. This sets the motor and the starter.' },
  { title: 'Water quality', body: 'Clear, sandy, or carrying solids. This affects the pump construction and materials.' },
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
      <section className={`${s.hero} on-dark`} aria-labelledby="hero-title">
        <div className={`container ${s.heroGrid}`}>
          <div className={s.heroCopy}>
            <p className="label">Water pump engineering, sales and service</p>
            <h1 id="hero-title" className={s.heroTitle}>
              Pumps for borewells, open wells, farms and buildings.
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
          <div className={s.heroShop} aria-labelledby="hero-shop-title">
            <div className={s.heroShopHead}>
              <h2 id="hero-shop-title" className={s.heroShopTitle}>
                Products for sale
              </h2>
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

      {/* ---------- Product range ---------- */}
      <section className="section" aria-labelledby="range-title">
        <div className="container">
          <div className="section-head">
            <p className="label">Product range</p>
            <h2 id="range-title">Five categories, defined by where the pump sits and what it draws from.</h2>
            <p className="section-intro">
              A pump that suits a borewell will not suit a canal bank. The range is organised by installation, so the right category is clear before power and head are discussed.
            </p>
          </div>

          <div className={s.rangeHead} aria-hidden="true">
            <span>Category</span>
            <span>Installed</span>
            <span>Water source</span>
            <span>Priming</span>
            <span />
          </div>
          <ol className={s.range}>
            {products.map((p) => (
              <li key={p.slug} className={`${s.rangeRow} reveal`}>
                <Link href={`/products/${p.slug}`} className={s.rangeLink}>
                  <span className={s.rangeNo}>{p.index}</span>
                  <span className={s.rangeMain}>
                    <span className={s.rangeName}>{p.name}</span>
                    <span className={s.rangeSum}>{p.summary}</span>
                  </span>
                  <span className={s.rangeCell} data-label="Installed">
                    {p.position}
                  </span>
                  <span className={s.rangeCell} data-label="Water source">
                    {p.waterSource}
                  </span>
                  <span className={s.rangeCell} data-label="Priming">
                    {p.priming}
                  </span>
                  <span className={s.rangeFig}>
                    <CategorySchematic kind={p.schematic} title={`${p.name} installation schematic`} compact />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <div className={s.rangeFoot}>
            <Link href="/products" className="link-arrow">
              Compare categories and specifications <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- 3D explorer ---------- */}
      <section id="explorer" className="section section--dark" aria-labelledby="explorer-title">
        <div className="container">
          <div className="section-head">
            <p className="label">Interactive 3D model</p>
            <h2 id="explorer-title">How a compact submersible pump is put together.</h2>
            <p className="section-intro">
              Built from supplied engineering CAD, not an illustration. Rotate the model, separate its bodies, cut a section and select each component for an explanation. This is a
              representative reference model, not a catalogue item.
            </p>
          </div>
          <PumpViewer variant="full" label="3D pump explorer" />
        </div>
      </section>

      {/* ---------- Selection ---------- */}
      <section className="section" aria-labelledby="select-title">
        <div className={`container ${s.select}`}>
          <div className={s.selectHead}>
            <p className="label">Pump selection</p>
            <h2 id="select-title">Six facts decide the right pump.</h2>
            <p className="lead">
              Power rating alone does not describe a pump duty. Bring these details to an enquiry and the recommendation can be made against the actual installation.
            </p>
            <Link href="/contact#enquiry" className="btn btn--dark">
              Start an enquiry <ArrowRight />
            </Link>
          </div>
          <ol className="spec-list">
            {selectionInputs.map((i) => (
              <li key={i.title}>
                <div>
                  <h3>{i.title}</h3>
                  <p>{i.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Service ---------- */}
      <section className={`section ${s.serviceSection}`} aria-labelledby="service-title">
        <div className={`container ${s.service}`}>
          <div>
            <p className="label">Service and support</p>
            <h2 id="service-title" className={s.serviceTitle}>
              Support continues after the pump is installed.
            </h2>
            <Link href="/service" className="btn btn--dark" style={{ marginTop: 32 }}>
              Service and support <ArrowRight />
            </Link>
          </div>
          <ul className={s.serviceList}>
            {services.map((sv) => (
              <li key={sv.id}>
                <Link href={`/service#${sv.id}`}>
                  <span className={s.serviceName}>{sv.name}</span>
                  <span className={s.serviceSum}>{sv.summary}</span>
                  <ArrowRight />
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
