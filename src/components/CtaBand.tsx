import Link from 'next/link';
import { ArrowRight } from './Icons';
import { ContactList } from './ContactLinks';

export function CtaBand({
  title = 'Tell us about the water source and where the water needs to go.',
  body = 'With the source, depth, distance and supply details, our engineers can recommend a pump category and model and prepare a quotation.',
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="cta-band on-dark" aria-labelledby="cta-title">
      <div className="container cta-band__grid">
        <div>
          <p className="label">Enquiries</p>
          <h2 id="cta-title">{title}</h2>
          <p>{body}</p>
          <div className="cta-band__actions">
            <Link href="/contact#enquiry" className="btn btn--primary">
              Request a quote <ArrowRight />
            </Link>
            <Link href="/service#request" className="btn btn--ghost">
              Request service
            </Link>
          </div>
        </div>
        <div className="cta-band__contact">
          <ContactList compact />
        </div>
      </div>
    </section>
  );
}
