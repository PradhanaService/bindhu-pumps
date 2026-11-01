import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './globals.css';
import './chrome.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { RevealObserver } from '@/components/RevealObserver';
import { brand, siteDescription, siteUrl } from '@/content/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brand.name} ${brand.descriptor} | Submersible, Borewell and Monoblock Pumps`,
    template: `%s | ${brand.name} ${brand.descriptor}`,
  },
  description: siteDescription,
  openGraph: {
    type: 'website',
    siteName: `${brand.name} ${brand.descriptor}`,
    description: siteDescription,
    images: [{ url: '/images/reference-pump-iso.webp', width: 1600, height: 1100, alt: 'Reference submersible pump model' }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
  // Keep the placeholder build out of search indexes until the business content is confirmed.
  robots: brand.isPlaceholder ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0d1824',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <RevealObserver />
      </body>
    </html>
  );
}
