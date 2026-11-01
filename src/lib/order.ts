/**
 * Order request schema, shared by the cart page (client) and /api/order (server).
 * An order request is not a payment: the business confirms price, delivery and
 * payment with the customer after receiving it.
 */
import { getItem } from '@/content/catalogue';
import { EMAIL_RE, PHONE_RE } from './enquiry';

export type OrderLineInput = { slug: string; qty: number };

export type OrderInput = {
  name: string;
  company: string;
  phone: string;
  email: string;
  location: string;
  message: string;
  consent: boolean;
  items: OrderLineInput[];
  website?: string;
};

export type OrderErrors = Partial<Record<keyof OrderInput, string>>;

export const ORDER_LIMITS = { name: 100, company: 120, phone: 25, email: 160, location: 200, message: 2000, lines: 50, qty: 99 } as const;

export function normaliseOrder(raw: Record<string, unknown>): OrderInput {
  const str = (k: string) => (typeof raw[k] === 'string' ? (raw[k] as string).trim() : '');
  const items = Array.isArray(raw.items)
    ? (raw.items as unknown[])
        .map((l) => (l && typeof l === 'object' ? (l as Record<string, unknown>) : {}))
        .map((l) => ({ slug: typeof l.slug === 'string' ? l.slug : '', qty: typeof l.qty === 'number' ? Math.floor(l.qty) : 0 }))
    : [];
  return {
    name: str('name'),
    company: str('company'),
    phone: str('phone'),
    email: str('email').toLowerCase(),
    location: str('location'),
    message: str('message'),
    consent: raw.consent === true || raw.consent === 'on' || raw.consent === 'true',
    items,
    website: str('website'),
  };
}

export function validateOrder(o: OrderInput): OrderErrors {
  const e: OrderErrors = {};
  if (o.name.length < 2) e.name = 'Enter your name.';
  else if (o.name.length > ORDER_LIMITS.name) e.name = `Keep the name under ${ORDER_LIMITS.name} characters.`;
  if (o.company.length > ORDER_LIMITS.company) e.company = `Keep this under ${ORDER_LIMITS.company} characters.`;
  if (!o.phone) e.phone = 'Enter a phone number so we can confirm the order.';
  else if (!PHONE_RE.test(o.phone) || o.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a valid phone number, including area or country code.';
  if (!o.email) e.email = 'Enter your email address.';
  else if (!EMAIL_RE.test(o.email) || o.email.length > ORDER_LIMITS.email) e.email = 'Enter a valid email address, for example name@company.com.';
  if (o.location.length < 3) e.location = 'Enter the town or PIN code for delivery.';
  else if (o.location.length > ORDER_LIMITS.location) e.location = `Keep this under ${ORDER_LIMITS.location} characters.`;
  if (o.message.length > ORDER_LIMITS.message) e.message = `Keep the note under ${ORDER_LIMITS.message} characters.`;
  if (!o.items.length) e.items = 'Your cart is empty.';
  else if (o.items.length > ORDER_LIMITS.lines || o.items.some((l) => !getItem(l.slug) || l.qty < 1 || l.qty > ORDER_LIMITS.qty)) e.items = 'Some items in your cart are no longer available. Refresh the page and try again.';
  if (!o.consent) e.consent = 'Confirm that we may use these details to process your order request.';
  return e;
}

export type OrderResponse =
  | { ok: true; reference: string }
  | { ok: false; code: 'validation'; errors: OrderErrors }
  | { ok: false; code: 'not_configured' | 'delivery_failed' | 'rate_limited' | 'bad_request'; message: string };
