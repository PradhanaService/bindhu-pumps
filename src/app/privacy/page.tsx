import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { PendingBlock } from '@/components/Pending';
import { brand } from '@/content/site';
import s from '../inner.module.css';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How enquiry information submitted through this website is used.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero label="Legal" title="Privacy policy" crumbs={[{ label: 'Privacy policy' }]} />
      <section className="section">
        <div className={`container ${s.legal}`}>
          <div className={s.legalStatus}>
            <PendingBlock title="Draft for review">
              This draft describes how this website handles enquiry data. It must be reviewed and approved by the business, and the business name, address and contact for privacy
              requests added, before the site is published.
            </PendingBlock>
          </div>
          <div className="prose">
            <h2>What this policy covers</h2>
            <p>
              This policy explains what information {brand.name} collects through this website and how it is used. It applies to the enquiry and service request forms and to visits to the
              site.
            </p>
            <h2>Information you provide</h2>
            <p>When you submit an enquiry or service request, we receive the details you enter:</p>
            <ul>
              <li>Name, company, phone number and email address</li>
              <li>Product category, application and requirement details</li>
              <li>Your message, including any description of your installation</li>
            </ul>
            <h2>How it is used</h2>
            <p>
              These details are used only to respond to your enquiry: to contact you, prepare a recommendation or quotation, and arrange service. They are not sold and are not used for
              unrelated marketing.
            </p>
            <h2>How it is processed</h2>
            <p>
              Form submissions are passed from this website to the business by a delivery service (email or a business system). The services used, and where they store data, will be listed
              here.
            </p>
            <h2>Retention</h2>
            <p>Enquiry details are kept for as long as needed to respond and to maintain records of quotations and service work. The retention period will be stated here.</p>
            <h2>Cookies and analytics</h2>
            <p>This website does not set advertising or tracking cookies. If analytics are added, this section will be updated before they are enabled.</p>
            <h2>Your choices</h2>
            <p>
              You can ask for a copy of the information we hold about you, or ask for it to be corrected or deleted, using the details on the <Link href="/contact">contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
