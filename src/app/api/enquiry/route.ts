import { NextResponse } from 'next/server';
import { normalise, validate, type EnquiryInput, type EnquiryResponse } from '@/lib/enquiry';
import { getProduct } from '@/content/products';
import { getApplication } from '@/content/applications';

/**
 * Enquiry endpoint.
 *
 * Delivery is configured with environment variables (see .env.example):
 *   ENQUIRY_WEBHOOK_URL (+ optional ENQUIRY_WEBHOOK_SECRET)  POSTs JSON to a webhook
 *   RESEND_API_KEY + ENQUIRY_EMAIL_TO + ENQUIRY_EMAIL_FROM    sends an email via Resend
 *
 * When neither is configured the endpoint returns 503 `not_configured`, and the
 * form tells the visitor their enquiry was NOT sent. Success is only reported
 * after the delivery target accepts the enquiry.
 */

export const runtime = 'nodejs';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > MAX_PER_WINDOW;
}

function json(body: EnquiryResponse, status: number) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function reference() {
  const d = new Date();
  const date = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  return `ENQ-${date}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function summary(e: EnquiryInput, ref: string) {
  const product = e.product === 'not-sure' ? 'Not sure' : getProduct(e.product)?.name ?? e.product;
  const application = e.application ? (e.application === 'other' ? 'Other' : getApplication(e.application)?.name ?? e.application) : 'Not specified';
  return [
    `Reference: ${ref}`,
    `Type: ${e.type}`,
    `Name: ${e.name}`,
    `Company: ${e.company || '-'}`,
    `Phone: ${e.phone}`,
    `Email: ${e.email}`,
    `Product category: ${product}`,
    `Application: ${application}`,
    `Requirement: ${e.requirement || '-'}`,
    '',
    e.message,
  ].join('\n');
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) {
    return json({ ok: false, code: 'rate_limited', message: 'Too many enquiries from this connection. Please wait a few minutes or contact us by phone.' }, 429);
  }

  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return json({ ok: false, code: 'bad_request', message: 'The enquiry could not be read. Please try again.' }, 400);
  }

  const enquiry = normalise(raw);
  const errors = validate(enquiry);
  if (Object.keys(errors).length) return json({ ok: false, code: 'validation', errors }, 422);

  const ref = reference();

  // Honeypot filled: treat as spam. Respond like a success so bots learn nothing, but deliver nothing.
  if (enquiry.website) return json({ ok: true, reference: ref }, 200);

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_EMAIL_TO;
  const from = process.env.ENQUIRY_EMAIL_FROM;

  if (!webhook && !(resendKey && to && from)) {
    console.warn('[enquiry] No delivery method configured; enquiry not delivered.');
    return json(
      {
        ok: false,
        code: 'not_configured',
        message: 'Online enquiries are not connected yet, so your enquiry has not been sent. Please contact us directly using the details on this page.',
      },
      503,
    );
  }

  const { website: _hp, ...payload } = enquiry;
  void _hp;

  try {
    if (webhook) {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.ENQUIRY_WEBHOOK_SECRET ? { 'X-Enquiry-Secret': process.env.ENQUIRY_WEBHOOK_SECRET } : {}),
        },
        body: JSON.stringify({ reference: ref, receivedAt: new Date().toISOString(), ...payload, text: summary(enquiry, ref) }),
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } else {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from,
          to: to!.split(',').map((s) => s.trim()),
          reply_to: enquiry.email,
          subject: `${enquiry.type === 'service' ? 'Service request' : 'Enquiry'} ${ref}: ${enquiry.name}${enquiry.company ? `, ${enquiry.company}` : ''}`,
          text: summary(enquiry, ref),
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    }
  } catch (err) {
    console.error('[enquiry] delivery failed', err);
    return json(
      { ok: false, code: 'delivery_failed', message: 'Your enquiry could not be delivered because of a server problem. It has not been sent. Please try again, or contact us directly.' },
      502,
    );
  }

  return json({ ok: true, reference: ref }, 200);
}

export function GET() {
  return NextResponse.json({ ok: false, message: 'Method not allowed' }, { status: 405, headers: { Allow: 'POST' } });
}
