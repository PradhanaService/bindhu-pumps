import { NextResponse } from 'next/server';
import { normaliseOrder, validateOrder, type OrderResponse } from '@/lib/order';
import { clientIp, deliver, makeReference, rateLimited } from '@/lib/delivery';
import { formatPrice, getItem } from '@/content/catalogue';

/**
 * Order request endpoint. Prices are recalculated here from the catalogue;
 * prices sent by the browser are ignored. Uses the same delivery configuration
 * as enquiries. Returns 503 `not_configured` until delivery is set up, and the
 * cart page then tells the customer the order was NOT sent.
 */

export const runtime = 'nodejs';

function json(body: OrderResponse, status: number) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: Request) {
  if (rateLimited('order:' + clientIp(req))) {
    return json({ ok: false, code: 'rate_limited', message: 'Too many order requests from this connection. Please wait a few minutes or call us.' }, 429);
  }
  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return json({ ok: false, code: 'bad_request', message: 'The order request could not be read. Please try again.' }, 400);
  }

  const order = normaliseOrder(raw);
  const errors = validateOrder(order);
  if (Object.keys(errors).length) return json({ ok: false, code: 'validation', errors }, 422);

  const ref = makeReference('ORD');
  if (order.website) return json({ ok: true, reference: ref }, 200);

  const lines = order.items.map((l) => {
    const item = getItem(l.slug)!;
    return { slug: item.slug, sku: item.sku, name: item.name, qty: l.qty, unitPrice: item.price, lineTotal: item.price * l.qty, samplePrice: item.isSample };
  });
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);

  const text = [
    `Order request ${ref}`,
    `Name: ${order.name}`,
    `Company: ${order.company || '-'}`,
    `Phone: ${order.phone}`,
    `Email: ${order.email}`,
    `Delivery location: ${order.location}`,
    '',
    'Items:',
    ...lines.map((l) => `  ${l.qty} × ${l.name} (${l.sku}) @ ${formatPrice(l.unitPrice)} = ${formatPrice(l.lineTotal)}${l.samplePrice ? ' [sample price]' : ''}`),
    '',
    `Subtotal at listed prices: ${formatPrice(subtotal)}`,
    '',
    order.message ? `Note: ${order.message}` : 'Note: -',
  ].join('\n');

  const result = await deliver({
    subject: `Order request ${ref}: ${order.name}, ${lines.length} item${lines.length > 1 ? 's' : ''}`,
    text,
    replyTo: order.email,
    payload: {
      kind: 'order',
      reference: ref,
      receivedAt: new Date().toISOString(),
      customer: { name: order.name, company: order.company, phone: order.phone, email: order.email, location: order.location },
      lines,
      subtotal,
      currency: 'INR',
      message: order.message,
    },
  });

  if (!result.ok && result.code === 'not_configured') {
    return json({ ok: false, code: 'not_configured', message: 'Online ordering is not connected yet, so your order request has not been sent. Please call or email us with the items in your cart.' }, 503);
  }
  if (!result.ok) {
    return json({ ok: false, code: 'delivery_failed', message: 'Your order request could not be delivered because of a server problem. It has not been sent. Please try again or contact us directly.' }, 502);
  }
  return json({ ok: true, reference: ref }, 200);
}

export function GET() {
  return NextResponse.json({ ok: false, message: 'Method not allowed' }, { status: 405, headers: { Allow: 'POST' } });
}
