import type { MetadataRoute } from 'next';
import { brand, siteUrl } from '@/content/site';

export default function robots(): MetadataRoute.Robots {
  // Block indexing while the placeholder brand and unverified content are in place.
  if (brand.isPlaceholder) return { rules: { userAgent: '*', disallow: '/' } };
  return { rules: { userAgent: '*', allow: '/', disallow: '/api/' }, sitemap: `${siteUrl}/sitemap.xml` };
}
