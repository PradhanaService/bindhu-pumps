/**
 * Server-side delivery of enquiries and order requests.
 * Configure one method with environment variables (see .env.example):
 *   ENQUIRY_WEBHOOK_URL (+ optional ENQUIRY_WEBHOOK_SECRET)
 *   RESEND_API_KEY + ENQUIRY_EMAIL_TO + ENQUIRY_EMAIL_FROM
 */

export type DeliveryResult = { ok: true } | { ok: false; code: 'not_configured' | 'delivery_failed' };

export async function deliver(msg: { subject: string; text: string; replyTo: string; payload: Record<string, unknown> }): Promise<DeliveryResult> {
  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_EMAIL_TO;
  const from = process.env.ENQUIRY_EMAIL_FROM;

  if (!webhook && !(resendKey && to && from)) {
    console.warn('[delivery] No delivery method configured; message not delivered.');
    return { ok: false, code: 'not_configured' };
  }

  try {
    if (webhook) {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.ENQUIRY_WEBHOOK_SECRET ? { 'X-Enquiry-Secret': process.env.ENQUIRY_WEBHOOK_SECRET } : {}),
        },
        body: JSON.stringify({ ...msg.payload, subject: msg.subject, text: msg.text }),
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } else {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to: to!.split(',').map((s) => s.trim()), reply_to: msg.replyTo, subject: msg.subject, text: msg.text }),
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    }
  } catch (err) {
    console.error('[delivery] failed', err);
    return { ok: false, code: 'delivery_failed' };
  }
  return { ok: true };
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

/** Simple per-instance rate limit. Use a shared store if running several instances. */
export function rateLimited(key: string) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return list.length > MAX_PER_WINDOW;
}

export function makeReference(prefix: string) {
  const d = new Date();
  const date = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  return `${prefix}-${date}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export function clientIp(req: Request) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}
