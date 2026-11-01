import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { PendingBlock } from '@/components/Pending';
import { brand } from '@/content/site';
import s from '../inner.module.css';

export const metadata: Metadata = {
  title: 'Terms of use',
  description: 'Terms that apply to the use of this website.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <>
      <PageHero label="Legal" title="Terms of use" crumbs={[{ label: 'Terms of use' }]} />
      <section className="section">
        <div className={`container ${s.legal}`}>
          <div className={s.legalStatus}>
            <PendingBlock title="Draft for review">
              These terms must be reviewed and approved by the business, with its legal name and governing jurisdiction added, before the site is published.
            </PendingBlock>
          </div>
          <div className="prose">
            <h2>Use of this website</h2>
            <p>
              This website provides general information about water pumps and the products and services of {brand.name}. By using it, you accept these terms.
            </p>
            <h2>Product information</h2>
            <p>
              Descriptions of pump types on this site are general. Specifications, performance and availability of individual models must be confirmed in a written quotation or the
              manufacturer&apos;s documentation before purchase. Pump selection depends on site conditions, and recommendations are made only after the details of an installation are reviewed.
            </p>
            <h2>3D reference model</h2>
            <p>
              The interactive 3D model is a representative reference built from supplied CAD data. It illustrates the construction of a compact submersible pump and is not a specific
              product offered for sale. Internal components that are not part of the CAD data are described in text and are not drawn.
            </p>
            <h2>Enquiries</h2>
            <p>
              Submitting an enquiry does not create a contract. Quotations, prices and warranty terms apply only when confirmed in writing. See the{' '}
              <Link href="/privacy">privacy policy</Link> for how enquiry details are used.
            </p>
            <h2>Intellectual property</h2>
            <p>Text, diagrams and design on this website may not be reproduced for commercial use without permission.</p>
            <h2>Changes</h2>
            <p>These terms may be updated. The version published on this page applies.</p>
          </div>
        </div>
      </section>
    </>
  );
}
