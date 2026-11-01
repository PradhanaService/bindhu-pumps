/**
 * Visible marker for business content that has not been verified.
 * Replace the source value in src/content/* to remove it.
 */
export function Pending({ label = 'To be confirmed', className }: { label?: string; className?: string }) {
  return (
    <span className={`pending ${className ?? ''}`} title="Awaiting verified information from the business">
      {label}
    </span>
  );
}

export function PendingBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pending-block" role="note">
      <strong>{title}</strong>
      {children}
    </div>
  );
}
