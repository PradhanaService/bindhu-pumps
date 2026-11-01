import Link from 'next/link';
import { brand } from '@/content/site';

/** Temporary text wordmark. Replace with the final logo when available. */
export function Wordmark({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link href="/" className={`wordmark ${onDark ? 'wordmark--dark' : ''}`} aria-label={`${brand.name} ${brand.descriptor}, home`}>
      <svg viewBox="0 0 28 28" aria-hidden="true" className="wordmark__mark">
        <rect x="0.75" y="0.75" width="26.5" height="26.5" fill="none" strokeWidth="1.5" />
        <path d="M14 5.5v6.2M14 16.3v6.2M5.5 14h6.2M16.3 14h6.2" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="2.3" />
      </svg>
      <span className="wordmark__name">{brand.name}</span>
      <span className="wordmark__desc">{brand.descriptor}</span>
    </Link>
  );
}
