import { contact, telHref, whatsappHref } from '@/content/site';
import { Pending } from './Pending';

/** Contact details. Only verified values render as links; missing values show a pending marker. */
export function ContactList({ compact = false }: { compact?: boolean }) {
  return (
    <dl className={`contact-list ${compact ? 'contact-list--compact' : ''}`}>
      <div>
        <dt>Phone</dt>
        <dd>
          {contact.phone ? <a href={telHref(contact.phone)}>{contact.phone}</a> : <Pending />}
          {contact.phoneAlt && (
            <>
              <br />
              <a href={telHref(contact.phoneAlt)}>{contact.phoneAlt}</a>
            </>
          )}
        </dd>
      </div>
      <div>
        <dt>Email</dt>
        <dd>{contact.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : <Pending />}</dd>
      </div>
      {contact.whatsapp && (
        <div>
          <dt>WhatsApp</dt>
          <dd>
            <a href={whatsappHref(contact.whatsapp)} target="_blank" rel="noopener noreferrer">
              Message on WhatsApp
            </a>
          </dd>
        </div>
      )}
      {!compact && (
        <>
          <div>
            <dt>Address</dt>
            <dd>
              {contact.addressLines ? (
                <address>
                  {contact.addressLines.map((l) => (
                    <span key={l}>
                      {l}
                      <br />
                    </span>
                  ))}
                  {contact.mapUrl && (
                    <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer">
                      View on map
                    </a>
                  )}
                </address>
              ) : (
                <Pending />
              )}
            </dd>
          </div>
          <div>
            <dt>Hours</dt>
            <dd>{contact.hours ?? <Pending />}</dd>
          </div>
        </>
      )}
    </dl>
  );
}
