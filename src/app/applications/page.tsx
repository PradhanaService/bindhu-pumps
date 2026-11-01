import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { sectors } from '@/content/applications';
import { getProduct } from '@/content/products';
import s from '../inner.module.css';

export const metadata: Metadata = {
  title: 'Applications',
  description: 'Pump categories considered for irrigation, residential water supply, industrial process water, cooling, construction and firefighting applications.',
  alternates: { canonical: '/applications' },
};

export default function ApplicationsPage() {
  return (
    <>
      <PageHero
        label="Applications"
        accent="Pumps for farms," title="buildings and industrial sites."
        lead="Each application below lists the pump categories usually considered and why. These are starting points: the final recommendation is made against the depth, head, flow and power supply of the actual site."
        crumbs={[{ label: 'Applications' }]}
        aside={
          <nav aria-label="Sectors">
            <ul className={s.jump}>
              {sectors.map((sec, i) => (
                <li key={sec.slug}>
                  <a href={`#${sec.slug}`}>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {sec.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
      />

      {sectors.map((sec, i) => (
        <section key={sec.slug} id={sec.slug} className={`section ${i % 2 ? 'section--paper2' : ''}`} aria-labelledby={`${sec.slug}-title`}>
          <div className={`container ${s.sector}`}>
            <header className={s.sectorHead}>
              <p className="label">Sector {String(i + 1).padStart(2, '0')}</p>
              <h2 id={`${sec.slug}-title`}>{sec.name}</h2>
              <p>{sec.intro}</p>
            </header>
            <div className={s.appRows}>
              {sec.applications.map((a) => (
                <article key={a.slug} id={a.slug} className={s.appRow}>
                  <h3>{a.name}</h3>
                  <p className={s.appDuty}>{a.duty}</p>
                  <div className={s.appCats}>
                    <p className={s.appCatsLabel}>Categories considered</p>
                    <ul>
                      {a.categories.map((c) => {
                        const prod = getProduct(c.slug);
                        if (!prod) return null;
                        return (
                          <li key={c.slug}>
                            <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
                            <span>{c.reason}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  {a.note && (
                    <p className={s.appNote} role="note">
                      {a.note}
                    </p>
                  )}
                  <Link href={`/contact?application=${a.slug}#enquiry`} className={s.appEnquire}>
                    Enquire about {a.name.toLowerCase()}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <CtaBand title="Describe the duty and we will match the pump." />
    </>
  );
}
