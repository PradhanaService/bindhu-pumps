import type { MetadataRoute } from 'next';
import { products } from '@/content/products';
import { catalogue } from '@/content/catalogue';
import { siteUrl } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/shop', '/products', '/applications', '/company', '/service', '/contact', '/privacy', '/terms'];
  return [
    ...pages.map((p) => ({ url: `${siteUrl}${p}`, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.7 })),
    ...products.map((p) => ({ url: `${siteUrl}/products/${p.slug}`, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...catalogue.map((i) => ({ url: `${siteUrl}/shop/${i.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
  ];
}
