import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { EnquiryForm } from '@/components/EnquiryForm';
import { ContactList } from '@/components/ContactLinks';
import { contact, whatsappHref } from '@/content/site';
import { getProduct } from '@/content/products';
import { getApplication } from '@/content/applications';
import s from '../inner.module.css';

export const metadata: Metadata = {
  title: 'Contact and enquiry',
  description: 'Request a quotation or technical advice for submersible, borewell, openwell, agricultural and monoblock pumps.',
  alternates: { canonical: '/contact' },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const product = typeof sp.product === 'string' && getProduct(sp.product) ? sp.product : '';
  const application = typeof sp.application === 'string' && getApplication(sp.application) ? sp.application : '';

  return (
    <>
      <PageHero
        label="Contact"
        title="Request a quote or technical advice."
        lead="Tell us about the water source, the installation and what the pump needs to deliver. An engineer will review the details and respond."
        crumbs={[{ label: 'Contact' }]}
      />

      <section id="enquiry" className="section" aria-labelledby="enq-title">
        <div className={`container ${s.contactGrid}`}>
          <aside className={s.contactSide} aria-labelledby="direct-title">
            <h2 id="direct-title">Direct contact</h2>
            <ContactList />
            {contact.whatsapp && (
              <a
                className={`btn btn--ghost ${s.whatsapp}`}
                href={whatsappHref(contact.whatsapp, 'Hello, I would like to enquire about a pump.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                Enquire on WhatsApp
              </a>
            )}
            <p className={s.contactNote}>For an existing installation that needs repair or maintenance, use the service request form on the Service page.</p>
          </aside>
          <div>
            <div className={s.formHead}>
              <p className="label">Enquiry form</p>
              <h2 id="enq-title">Send an enquiry</h2>
              <p>Fields marked with an asterisk are required. Everything else helps us answer more precisely.</p>
            </div>
            <EnquiryForm defaultProduct={product} defaultApplication={application} title="Quotation enquiry form" />
          </div>
        </div>
      </section>
    </>
  );
}
