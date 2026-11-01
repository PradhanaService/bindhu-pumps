'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { productOptions } from '@/content/products';
import { applicationOptions } from '@/content/applications';
import { contact, telHref, whatsappHref } from '@/content/site';
import { LIMITS, normalise, validate, type EnquiryErrors, type EnquiryResponse, type EnquiryType } from '@/lib/enquiry';
import { ArrowRight } from './Icons';
import styles from './EnquiryForm.module.css';

type Props = {
  type?: EnquiryType;
  defaultProduct?: string;
  defaultApplication?: string;
  /** Heading shown above the form, for the accessible name. */
  title?: string;
  tone?: 'light' | 'dark';
};

type State =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; reference: string }
  | { kind: 'error'; code: string; message: string };

const FIELD_ORDER = ['name', 'company', 'phone', 'email', 'product', 'application', 'requirement', 'message', 'consent'] as const;

export function EnquiryForm({ type = 'quote', defaultProduct = '', defaultApplication = '', title, tone = 'light' }: Props) {
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [messageLen, setMessageLen] = useState(0);

  const collect = () => {
    const fd = new FormData(formRef.current!);
    const raw: Record<string, unknown> = Object.fromEntries(fd.entries());
    raw.consent = fd.get('consent') === 'on';
    raw.type = type;
    return normalise(raw);
  };

  const focusFirstError = (errs: EnquiryErrors) => {
    const first = FIELD_ORDER.find((f) => errs[f]);
    if (first) document.getElementById(id(first))?.focus();
  };

  const onBlur = (field: keyof EnquiryErrors) => {
    if (!errors[field]) return;
    const errs = validate(collect());
    setErrors((prev) => ({ ...prev, [field]: errs[field] }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (state.kind === 'submitting') return;
    const data = collect();
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setState({ kind: 'idle' });
      focusFirstError(errs);
      return;
    }
    setState({ kind: 'submitting' });
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      let body: EnquiryResponse | null = null;
      try {
        body = (await res.json()) as EnquiryResponse;
      } catch {
        body = null;
      }
      if (res.ok && body?.ok) {
        setState({ kind: 'success', reference: body.reference });
        formRef.current?.reset();
        setMessageLen(0);
      } else if (body && !body.ok && body.code === 'validation') {
        setErrors(body.errors);
        setState({ kind: 'idle' });
        focusFirstError(body.errors);
        return;
      } else {
        setState({
          kind: 'error',
          code: body && !body.ok ? body.code : 'unknown',
          message: body && !body.ok && 'message' in body ? body.message : 'The enquiry could not be sent. It has not been delivered. Please try again or contact us directly.',
        });
      }
    } catch {
      setState({ kind: 'error', code: 'network', message: 'No connection to the server. Your enquiry has not been sent. Check your connection and try again.' });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const err = (f: keyof EnquiryErrors) =>
    errors[f] ? (
      <p className="field-error" id={id(f) + '-err'}>
        {errors[f]}
      </p>
    ) : null;

  const aria = (f: keyof EnquiryErrors, help?: string) => ({
    id: id(f),
    name: f,
    'aria-invalid': errors[f] ? (true as const) : undefined,
    'aria-describedby': [errors[f] ? id(f) + '-err' : '', help ?? ''].filter(Boolean).join(' ') || undefined,
    onBlur: () => onBlur(f),
  });

  if (state.kind === 'success') {
    return (
      <div className={`${styles.result} ${styles.success}`} role="status" tabIndex={-1} ref={statusRef}>
        <p className="label">Enquiry received</p>
        <h3>Thank you. Your enquiry has been sent.</h3>
        <p>
          Reference <span className="mono">{state.reference}</span>. Keep this reference if you contact us about the same requirement.
        </p>
        <button type="button" className="btn btn--ghost" onClick={() => setState({ kind: 'idle' })}>
          Send another enquiry
        </button>
      </div>
    );
  }

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form ref={formRef} className={`${styles.form} ${tone === 'dark' ? styles.dark : ''}`} onSubmit={onSubmit} noValidate aria-label={title ?? 'Enquiry form'}>
      {errorCount > 0 && (
        <div className={styles.summary} role="alert">
          {errorCount === 1 ? 'One field needs attention.' : `${errorCount} fields need attention.`} Check the highlighted fields below.
        </div>
      )}

      {state.kind === 'error' && (
        <div className={`${styles.result} ${styles.error}`} role="alert" tabIndex={-1} ref={statusRef}>
          <p className={styles.errorTitle}>Enquiry not sent</p>
          <p>{state.message}</p>
          <ul className={styles.alts}>
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
                <a href={whatsappHref(contact.whatsapp, 'Hello, I would like to enquire about a pump.')} target="_blank" rel="noopener noreferrer">
                  Message on WhatsApp
                </a>
              </li>
            )}
            {!contact.phone && !contact.email && !contact.whatsapp && <li>Direct contact details are being confirmed and will be published here.</li>}
          </ul>
        </div>
      )}

      <div className={styles.grid}>
        <div className="field">
          <label htmlFor={id('name')}>
            Name<span className="req" aria-hidden="true">*</span>
          </label>
          <input className="input" type="text" autoComplete="name" maxLength={LIMITS.name} required {...aria('name')} />
          {err('name')}
        </div>
        <div className="field">
          <label htmlFor={id('company')}>
            Company<span className="opt">Optional</span>
          </label>
          <input className="input" type="text" autoComplete="organization" maxLength={LIMITS.company} {...aria('company')} />
          {err('company')}
        </div>
        <div className="field">
          <label htmlFor={id('phone')}>
            Phone<span className="req" aria-hidden="true">*</span>
          </label>
          <input className="input" type="tel" autoComplete="tel" inputMode="tel" maxLength={LIMITS.phone} required {...aria('phone')} />
          {err('phone')}
        </div>
        <div className="field">
          <label htmlFor={id('email')}>
            Email<span className="req" aria-hidden="true">*</span>
          </label>
          <input className="input" type="email" autoComplete="email" maxLength={LIMITS.email} required {...aria('email')} />
          {err('email')}
        </div>
        <div className="field">
          <label htmlFor={id('product')}>
            Product category<span className="req" aria-hidden="true">*</span>
          </label>
          <select className="input" defaultValue={defaultProduct} required {...aria('product')}>
            <option value="" disabled>
              Select a category
            </option>
            {productOptions.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
            <option value="not-sure">Not sure, advise me</option>
          </select>
          {err('product')}
        </div>
        <div className="field">
          <label htmlFor={id('application')}>
            Application<span className="opt">Optional</span>
          </label>
          <select className="input" defaultValue={defaultApplication} {...aria('application')}>
            <option value="">Select an application</option>
            {applicationOptions.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ))}
            <option value="other">Other</option>
          </select>
          {err('application')}
        </div>
        <div className={`field ${styles.wide}`}>
          <label htmlFor={id('requirement')}>
            {type === 'service' ? 'Pump model and serial number' : 'Required horsepower or specification'}
            <span className="opt">Optional</span>
          </label>
          <input
            className="input"
            type="text"
            maxLength={LIMITS.requirement}
            placeholder={type === 'service' ? 'As shown on the pump nameplate' : 'For example: power, head, flow, bore size, supply phase'}
            {...aria('requirement', id('requirement') + '-help')}
          />
          <p className="field-help" id={id('requirement') + '-help'}>
            {type === 'service' ? 'Include the installation date if you know it.' : 'If you do not know, describe the water source and where the water needs to go.'}
          </p>
          {err('requirement')}
        </div>
        <div className={`field ${styles.wide}`}>
          <label htmlFor={id('message')}>
            {type === 'service' ? 'Describe the problem' : 'Message'}
            <span className="req" aria-hidden="true">*</span>
          </label>
          <textarea className="input" maxLength={LIMITS.message} required onChange={(e) => setMessageLen(e.target.value.length)} {...aria('message', id('message') + '-count')} />
          <p className="field-help" id={id('message') + '-count'}>
            {messageLen} / {LIMITS.message} characters
          </p>
          {err('message')}
        </div>

        <div className={styles.hp} aria-hidden="true">
          <label htmlFor={id('website')}>Leave this field empty</label>
          <input type="text" id={id('website')} name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className={`${styles.wide} ${styles.consent}`}>
          <input type="checkbox" {...aria('consent')} />
          <label htmlFor={id('consent')}>
            I agree that the details I provide may be used to respond to this enquiry, as described in the <Link href="/privacy">privacy policy</Link>.
          </label>
          {err('consent')}
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className="btn btn--primary" disabled={state.kind === 'submitting'} aria-busy={state.kind === 'submitting'}>
          {state.kind === 'submitting' ? 'Sending' : type === 'service' ? 'Submit service request' : 'Send enquiry'}
          {state.kind !== 'submitting' && <ArrowRight />}
        </button>
        <p className={styles.note}>
          <span aria-hidden="true">*</span> Required fields
        </p>
      </div>
    </form>
  );
}
