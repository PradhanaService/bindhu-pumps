import Link from 'next/link';
import { brand } from '@/content/site';

/** Temporary text wordmark. Replace with the final logo when available. */
export function Wordmark({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link href="/" className={`wordmark ${onDark ? 'wordmark--dark' : ''}`} aria-label={`${brand.name} ${brand.descriptor}, home`}>
      <svg viewBox="0 0 28 28" aria-hidden="true" className="wordmark__mark">
        <circle cx="14" cy="14" r="12.5" fill="none" strokeWidth="2" className="wordmark__ring" />
        <circle cx="14" cy="14" r="5" />
      </svg>
      <span className="wordmark__name">{brand.name}</span>
      <span className="wordmark__desc">{brand.descriptor}</span>
    </Link>
  );
}
