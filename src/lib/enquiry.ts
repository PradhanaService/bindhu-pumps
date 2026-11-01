/**
 * Enquiry schema and validation, shared by the form (client) and the API route (server).
 */
import { productOptions } from '@/content/products';
import { allApplications } from '@/content/applications';

export type EnquiryType = 'quote' | 'service' | 'general';

export type EnquiryInput = {
  type: EnquiryType;
  name: string;
  company: string;
  phone: string;
  email: string;
  product: string;
  application: string;
  requirement: string;
  message: string;
  consent: boolean;
  /** Honeypot. Must stay empty. */
  website?: string;
};

export type EnquiryErrors = Partial<Record<keyof EnquiryInput, string>>;

export const LIMITS = {
  name: 100,
  company: 120,
  phone: 25,
  email: 160,
  requirement: 300,
  message: 3000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{7,25}$/;

const productValues = new Set(productOptions.map((p) => p.value).concat(['not-sure']));
const applicationValues = new Set(allApplications.map((a) => a.slug).concat(['other']));

export function normalise(raw: Record<string, unknown>): EnquiryInput {
  const str = (k: string) => (typeof raw[k] === 'string' ? (raw[k] as string).trim() : '');
  const type = str('type');
  return {
    type: type === 'service' || type === 'general' ? type : 'quote',
    name: str('name'),
    company: str('company'),
    phone: str('phone'),
    email: str('email').toLowerCase(),
    product: str('product'),
    application: str('application'),
    requirement: str('requirement'),
    message: str('message'),
    consent: raw.consent === true || raw.consent === 'on' || raw.consent === 'true',
    website: str('website'),
  };
}

export function validate(e: EnquiryInput): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (e.name.length < 2) errors.name = 'Enter your name.';
  else if (e.name.length > LIMITS.name) errors.name = `Keep the name under ${LIMITS.name} characters.`;

  if (e.company.length > LIMITS.company) errors.company = `Keep this under ${LIMITS.company} characters.`;

  if (!e.phone) errors.phone = 'Enter a phone number so we can call you back.';
  else if (!PHONE_RE.test(e.phone) || e.phone.replace(/\D/g, '').length < 7) errors.phone = 'Enter a valid phone number, including area or country code.';

  if (!e.email) errors.email = 'Enter your email address.';
  else if (!EMAIL_RE.test(e.email) || e.email.length > LIMITS.email) errors.email = 'Enter a valid email address, for example name@company.com.';

  if (!e.product) errors.product = 'Select a product category, or choose "Not sure".';
  else if (!productValues.has(e.product)) errors.product = 'Select a product category from the list.';

  if (e.application && !applicationValues.has(e.application)) errors.application = 'Select an application from the list.';

  if (e.requirement.length > LIMITS.requirement) errors.requirement = `Keep this under ${LIMITS.requirement} characters.`;

  if (e.message.length < 10) errors.message = 'Describe your requirement in a few words (at least 10 characters).';
  else if (e.message.length > LIMITS.message) errors.message = `Keep the message under ${LIMITS.message} characters.`;

  if (!e.consent) errors.consent = 'Confirm that we may use these details to respond to your enquiry.';
  return errors;
}

export type EnquiryResponse =
  | { ok: true; reference: string }
  | { ok: false; code: 'validation'; errors: EnquiryErrors }
  | { ok: false; code: 'not_configured' | 'delivery_failed' | 'rate_limited' | 'bad_request'; message: string };
