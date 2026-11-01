/**
 * Site-wide business configuration.
 *
 * CONTENT STATUS
 * The reference website (bindhupumps.com) could not be reached from the build
 * environment, so business facts could not be verified. Every value that must
 * come from the business is `null` here. `null` values render as a visible
 * "To be confirmed" marker (see components/Pending.tsx) instead of invented data.
 * Fill these in from verified sources before launch. See CONTENT-AUDIT.md.
 *
 * BRAND
 * "Ferrovane" is a temporary working name and text wordmark. Replace `brand`
 * below; it is the only place the name is defined.
 */

export const brand = {
  name: 'Ferrovane',
  descriptor: 'Pump Engineering',
  /** Set to false once the final company name replaces the placeholder. */
  isPlaceholder: true,
} as const;

export type ContactDetails = {
  /** E.164 format preferred, e.g. "+91XXXXXXXXXX". Rendered as a tel: link. */
  phone: string | null;
  /** Secondary phone, optional. */
  phoneAlt: string | null;
  email: string | null;
  /** Number registered on WhatsApp, digits only with country code. Leave null if the business does not use WhatsApp. */
  whatsapp: string | null;
  addressLines: string[] | null;
  hours: string | null;
  /** Google Maps or similar link for the address. */
  mapUrl: string | null;
};

export const contact: ContactDetails = {
  phone: null,
  phoneAlt: null,
  email: null,
  whatsapp: null,
  addressLines: null,
  hours: null,
  mapUrl: null,
};

/** Facts about the company. All require confirmation from the business. */
export const companyFacts: { label: string; value: string | null }[] = [
  { label: 'Established', value: null },
  { label: 'Registered office', value: null },
  { label: 'Service area', value: null },
  { label: 'Pump brands supplied', value: null },
  { label: 'Manufacturing or assembly', value: null },
  { label: 'Certifications and approvals', value: null },
];

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export const siteDescription =
  'Engineering, supply and service of submersible, borewell, openwell, agricultural and monoblock water pumps for farms, homes, buildings and industry.';

export const nav = {
  primary: [
    { href: '/products', label: 'Products' },
    { href: '/applications', label: 'Applications' },
    { href: '/#explorer', label: '3D Explorer' },
    { href: '/company', label: 'Company' },
    { href: '/service', label: 'Service' },
    { href: '/contact', label: 'Contact' },
  ],
};

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function whatsappHref(number: string, text?: string) {
  const digits = number.replace(/\D/g, '');
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
