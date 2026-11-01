import { NextResponse } from 'next/server';
import { normalise, validate, type EnquiryInput, type EnquiryResponse } from '@/lib/enquiry';
import { clientIp, deliver, makeReference, rateLimited } from '@/lib/delivery';
import { getProduct } from '@/content/products';
import { getApplication } from '@/content/applications';

/**
 * Enquiry endpoint. Delivery is configured in lib/delivery.ts (see .env.example).
 * When no delivery method is configured it returns 503 `not_configured`, and the
 * form tells the visitor their enquiry was NOT sent.
 */

export const runtime = 'nodejs';

function json(body: EnquiryResponse, status: number) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
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
  if (rateLimited('enquiry:' + clientIp(req))) {
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

  const ref = makeReference('ENQ');

  // Honeypot filled: treat as spam. Respond like a success so bots learn nothing, but deliver nothing.
  if (enquiry.website) return json({ ok: true, reference: ref }, 200);

  const { website: _hp, ...fields } = enquiry;
  void _hp;

  const result = await deliver({
    subject: `${enquiry.type === 'service' ? 'Service request' : 'Enquiry'} ${ref}: ${enquiry.name}${enquiry.company ? `, ${enquiry.company}` : ''}`,
    text: summary(enquiry, ref),
    replyTo: enquiry.email,
    payload: { kind: 'enquiry', reference: ref, receivedAt: new Date().toISOString(), ...fields },
  });

  if (!result.ok && result.code === 'not_configured') {
    return json(
      { ok: false, code: 'not_configured', message: 'Online enquiries are not connected yet, so your enquiry has not been sent. Please contact us directly using the details on this page.' },
      503,
    );
  }
  if (!result.ok) {
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
