import Link from 'next/link';
import { products } from '@/content/products';
import { sectors } from '@/content/applications';
import { brand } from '@/content/site';
import { Wordmark } from './Wordmark';
import { ContactList } from './ContactLinks';

export function SiteFooter() {
  return (
    <footer className="site-footer on-dark">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Wordmark onDark />
            <p>Engineering, supply and service of water pumps for agriculture, residential buildings and industry.</p>
          </div>
          <nav className="site-footer__nav" aria-label="Footer">
            <div>
              <h2 className="label label--plain">Products</h2>
              <ul>
                {products.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/products/${p.slug}`}>{p.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="label label--plain">Applications</h2>
              <ul>
                {sectors.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/applications#${s.slug}`}>{s.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="label label--plain">Company</h2>
              <ul>
                <li>
                  <Link href="/company">About and capabilities</Link>
                </li>
                <li>
                  <Link href="/#explorer">3D pump explorer</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="label label--plain">Service and support</h2>
              <ul>
                <li>
                  <Link href="/service#offerings">Service and maintenance</Link>
                </li>
                <li>
                  <Link href="/service#amc">AMC plans</Link>
                </li>
                <li>
                  <Link href="/service#warranty">Warranty</Link>
                </li>
                <li>
                  <Link href="/service#request">Service request</Link>
                </li>
              </ul>
            </div>
          </nav>
          <div className="site-footer__contact">
            <h2 className="label label--plain">Contact</h2>
            <ContactList compact />
          </div>
        </div>
        <div className="site-footer__base">
          <p>
            © {new Date().getFullYear()} {brand.name}
            {brand.isPlaceholder && <span className="site-footer__note"> (working name)</span>}
          </p>
          <ul>
            <li>
              <Link href="/privacy">Privacy policy</Link>
            </li>
            <li>
              <Link href="/terms">Terms of use</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
