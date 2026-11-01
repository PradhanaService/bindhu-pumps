'use client';

import Link from 'next/link';
import { useId, useRef, useState, type FormEvent } from 'react';
import { useCart, MAX_QTY } from './CartProvider';
import { ProductImage } from './ProductImage';
import { SampleTag } from './SampleTag';
import { formatPrice } from '@/content/catalogue';
import { contact, telHref, whatsappHref } from '@/content/site';
import { ORDER_LIMITS, normaliseOrder, validateOrder, type OrderErrors, type OrderResponse } from '@/lib/order';
import { ArrowRight } from '@/components/Icons';
import styles from './cart.module.css';

type State = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'success'; reference: string } | { kind: 'error'; message: string };
const ORDER = ['name', 'phone', 'email', 'location', 'company', 'message', 'consent'] as const;

export function CartView() {
  const { lines, subtotal, count, setQty, remove, clear, ready } = useCart();
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<OrderErrors>({});
  const [state, setState] = useState<State>({ kind: 'idle' });
  const anySample = lines.some((l) => l.item.isSample);

  const collect = () => {
    const fd = new FormData(formRef.current!);
    const raw: Record<string, unknown> = Object.fromEntries(fd.entries());
    raw.consent = fd.get('consent') === 'on';
    raw.items = lines.map((l) => ({ slug: l.slug, qty: l.qty }));
    return normaliseOrder(raw);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (state.kind === 'submitting') return;
    const data = collect();
    const errs = validateOrder(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = ORDER.find((f) => errs[f]);
      if (first) document.getElementById(id(first))?.focus();
      return;
    }
    setState({ kind: 'submitting' });
    try {
      const res = await fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      let body: OrderResponse | null = null;
      try {
        body = (await res.json()) as OrderResponse;
      } catch {
        body = null;
      }
      if (res.ok && body?.ok) {
        setState({ kind: 'success', reference: body.reference });
        clear();
      } else if (body && !body.ok && body.code === 'validation') {
        setErrors(body.errors);
        setState({ kind: 'idle' });
        return;
      } else {
        setState({ kind: 'error', message: body && !body.ok && 'message' in body ? body.message : 'The order request could not be sent. It has not been delivered.' });
      }
    } catch {
      setState({ kind: 'error', message: 'No connection to the server. Your order request has not been sent. Check your connection and try again.' });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const err = (f: keyof OrderErrors) =>
    errors[f] ? (
      <p className="field-error" id={id(f) + '-err'}>
        {errors[f]}
      </p>
    ) : null;
  // Re-check a field while the visitor edits it, so a fixed field loses its error straight away.
  // (Done on change, not blur: clearing on blur shifts the layout under a click in progress.)
  const recheck = (f: keyof OrderErrors) => {
    if (!errors[f]) return;
    const next = validateOrder(collect());
    if (!next[f]) setErrors((prev) => ({ ...prev, [f]: undefined }));
  };
  const aria = (f: keyof OrderErrors) => ({
    id: id(f),
    name: f,
    'aria-invalid': errors[f] ? (true as const) : undefined,
    'aria-describedby': errors[f] ? id(f) + '-err' : undefined,
    onChange: () => recheck(f),
  });

  const whatsappText = `Hello, I would like to order:\n${lines.map((l) => `${l.qty} × ${l.item.name} (${l.item.sku})`).join('\n')}`;

  return (
    <section className={`section ${styles.wrap}`} aria-labelledby="cart-title">
      <div className="container">
        <p className="label">Cart</p>
        <h1 id="cart-title" className={styles.title}>
          {state.kind === 'success' ? 'Order request sent' : 'Your cart'}
        </h1>

        {state.kind === 'success' ? (
          <div className={styles.success} role="status" tabIndex={-1} ref={statusRef}>
            <p>
              Thank you. Your order request has been sent with reference <span className="mono">{state.reference}</span>.
            </p>
            <p>We will contact you to confirm the price, delivery and payment. Nothing is charged until you confirm.</p>
            <Link href="/shop" className="btn btn--dark">
              Continue browsing <ArrowRight />
            </Link>
          </div>
        ) : !ready ? (
          <p className={styles.muted}>Loading your cart</p>
        ) : lines.length === 0 ? (
          <div className={styles.empty}>
            <p>Your cart is empty.</p>
            <Link href="/shop" className="btn btn--primary">
              Browse products <ArrowRight />
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            <div>
              <ul className={styles.lines} aria-label="Items in cart">
                {lines.map((l) => (
                  <li key={l.slug} className={styles.line}>
                    <Link href={`/shop/${l.slug}`} className={styles.lineImg} tabIndex={-1} aria-hidden="true">
                      <ProductImage item={l.item} sizes="120px" />
                    </Link>
                    <div className={styles.lineInfo}>
                      <Link href={`/shop/${l.slug}`} className={styles.lineName}>
                        {l.item.name}
                      </Link>
                      <p className={styles.lineMeta}>
                        <span className="mono">{l.item.sku}</span> · {formatPrice(l.item.price)} each {l.item.isSample && <SampleTag label="Sample price" />}
                      </p>
                      <div className={styles.lineActions}>
                        <div className={styles.qty} role="group" aria-label={`Quantity for ${l.item.name}`}>
                          <button type="button" onClick={() => setQty(l.slug, l.qty - 1)} aria-label="Decrease quantity">
                            −
                          </button>
                          <span aria-live="polite">{l.qty}</span>
                          <button type="button" onClick={() => setQty(l.slug, l.qty + 1)} aria-label="Increase quantity" disabled={l.qty >= MAX_QTY}>
                            +
                          </button>
                        </div>
                        <button type="button" className={styles.remove} onClick={() => remove(l.slug)}>
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className={styles.lineTotal}>{formatPrice(l.item.price * l.qty)}</p>
                  </li>
                ))}
              </ul>
              <dl className={styles.totals}>
                <div>
                  <dt>
                    Subtotal, {count} {count === 1 ? 'item' : 'items'}
                  </dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
              </dl>
              <p className={styles.muted}>Taxes and delivery are confirmed with you before the order is accepted. No payment is taken on this website.</p>
              {anySample && (
                <p className={styles.sampleNote}>
                  <SampleTag label="Sample prices" /> Items in this cart use example prices from the sample catalogue.
                </p>
              )}
            </div>

            <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate aria-labelledby="order-title">
              <h2 id="order-title" className={styles.formTitle}>
                Send order request
              </h2>
              <p className={styles.muted}>We reply to confirm stock, final price and delivery.</p>

              {state.kind === 'error' && (
                <div className={styles.error} role="alert" tabIndex={-1} ref={statusRef}>
                  <p className={styles.errorTitle}>Order request not sent</p>
                  <p>{state.message}</p>
                  <ul>
                    {contact.phone && (
                      <li>
                        <a href={telHref(contact.phone)}>Call {contact.phone}</a>
                      </li>
                    )}
                    {contact.email && (
                      <li>
                        <a href={`mailto:${contact.email}`}>Email {contact.email}</a>
                      </li>
                    )}
                    {contact.whatsapp && (
                      <li>
                        <a href={whatsappHref(contact.whatsapp, whatsappText)} target="_blank" rel="noopener noreferrer">
                          Send this order on WhatsApp
                        </a>
                      </li>
                    )}
                    {!contact.phone && !contact.email && !contact.whatsapp && <li>Direct contact details are being confirmed and will be published here.</li>}
                  </ul>
                </div>
              )}

              <div className={styles.fields}>
                <div className="field">
                  <label htmlFor={id('name')}>
                    Name<span className="req" aria-hidden="true">*</span>
                  </label>
                  <input className="input" autoComplete="name" maxLength={ORDER_LIMITS.name} {...aria('name')} />
                  {err('name')}
                </div>
                <div className="field">
                  <label htmlFor={id('phone')}>
                    Phone<span className="req" aria-hidden="true">*</span>
                  </label>
                  <input className="input" type="tel" autoComplete="tel" maxLength={ORDER_LIMITS.phone} {...aria('phone')} />
                  {err('phone')}
                </div>
                <div className="field">
                  <label htmlFor={id('email')}>
                    Email<span className="req" aria-hidden="true">*</span>
                  </label>
                  <input className="input" type="email" autoComplete="email" maxLength={ORDER_LIMITS.email} {...aria('email')} />
                  {err('email')}
                </div>
                <div className="field">
                  <label htmlFor={id('location')}>
                    Delivery town or PIN code<span className="req" aria-hidden="true">*</span>
                  </label>
                  <input className="input" autoComplete="postal-code" maxLength={ORDER_LIMITS.location} {...aria('location')} />
                  {err('location')}
                </div>
                <div className="field">
                  <label htmlFor={id('company')}>
                    Company<span className="opt">Optional</span>
                  </label>
                  <input className="input" autoComplete="organization" maxLength={ORDER_LIMITS.company} {...aria('company')} />
                  {err('company')}
                </div>
                <div className="field">
                  <label htmlFor={id('message')}>
                    Note<span className="opt">Optional</span>
                  </label>
                  <textarea className="input" rows={3} maxLength={ORDER_LIMITS.message} placeholder="Installation details, preferred delivery date" {...aria('message')} />
                  {err('message')}
                </div>
                <div className={styles.hp} aria-hidden="true">
                  <label htmlFor={id('website')}>Leave this field empty</label>
                  <input id={id('website')} name="website" tabIndex={-1} autoComplete="off" />
                </div>
                <div className={styles.consent}>
                  <input type="checkbox" {...aria('consent')} />
                  <label htmlFor={id('consent')}>
                    I agree that these details may be used to process my order request, as described in the <Link href="/privacy">privacy policy</Link>.
                  </label>
                  {err('consent')}
                </div>
                {errors.items && (
                  <p className="field-error" role="alert">
                    {errors.items}
                  </p>
                )}
              </div>
              <button type="submit" className={`btn btn--primary ${styles.submit}`} disabled={state.kind === 'submitting'} aria-busy={state.kind === 'submitting'}>
                {state.kind === 'submitting' ? 'Sending' : 'Send order request'}
              </button>
              {contact.whatsapp && (
                <a href={whatsappHref(contact.whatsapp, whatsappText)} className={`btn btn--ghost ${styles.submit}`} target="_blank" rel="noopener noreferrer">
                  Order on WhatsApp instead
                </a>
              )}
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
