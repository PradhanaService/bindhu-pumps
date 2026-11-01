import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { EnquiryForm } from '@/components/EnquiryForm';
import { ContactList } from '@/components/ContactLinks';
import { Pending } from '@/components/Pending';
import { services } from '@/content/services';
import s from '../inner.module.css';

export const metadata: Metadata = {
  title: 'Service and support',
  description: 'Product support, warranty, service and maintenance, annual maintenance contracts (AMC) and technical assistance for water pumps.',
  alternates: { canonical: '/service' },
};

const requestChecklist = [
  'Pump make, model and serial number from the nameplate',
  'Date of installation and the invoice, if available',
  'Pump category and where it is installed',
  'What has changed: no water, low flow, noise, tripping, leakage',
  'Power supply details and any recent electrical work',
];

export default function ServicePage() {
  return (
    <>
      <PageHero
        label="Service and support"
        accent="Service, maintenance" title="and technical support for installed pumps."
        lead="Pumps last longer and use less energy when they are looked after. Support covers advice before purchase, warranty claims, repairs, scheduled maintenance under AMC plans and engineering assistance."
        crumbs={[{ label: 'Service and support' }]}
        aside={
          <nav aria-label="Services">
            <ul className={s.jump}>
              {services.map((sv, i) => (
                <li key={sv.id}>
                  <a href={`#${sv.id}`}>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {sv.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
      />

      <section id="offerings" className="section" aria-labelledby="offer-title">
        <div className="container">
          <div className="section-head">
            <p className="label">Offerings</p>
            <h2 id="offer-title">What support covers</h2>
            <p className="section-intro">
              Terms, durations, coverage areas and pricing are published only once confirmed. No response times or warranty periods are promised on this page until then.
            </p>
          </div>
          <div className={s.services}>
            {services.map((sv, i) => (
              <article key={sv.id} id={sv.id} className={s.serviceRow} aria-labelledby={`${sv.id}-t`}>
                <span className={s.serviceNo}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 id={`${sv.id}-t`}>{sv.name}</h3>
                  <p className={s.serviceSum}>{sv.summary}</p>
                </div>
                <p className={s.serviceBody}>{sv.body}</p>
                <div className={s.servicePending}>
                  <p>Details pending</p>
                  <ul>
                    {sv.pending.map((x) => (
                      <li key={x}>
                        <Pending label={x} />
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="request" className="section section--paper2" aria-labelledby="req-title">
        <div className={`container ${s.contactGrid}`}>
          <div className={s.contactSide}>
            <h2>Before you request service</h2>
            <ol className={s.checklist}>
              {requestChecklist.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
            <div style={{ marginTop: 36 }}>
              <h2>Contact service</h2>
              <ContactList compact />
            </div>
          </div>
          <div>
            <div className={s.formHead}>
              <p className="label">Service request</p>
              <h2 id="req-title">Request service or maintenance</h2>
              <p>Describe the installation and the problem. For an AMC enquiry, include the number of pumps and where they are installed.</p>
            </div>
            <EnquiryForm type="service" title="Service request form" />
          </div>
        </div>
      </section>
    </>
  );
}
