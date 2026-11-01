/** Visible marker for placeholder catalogue data. */
export function SampleTag({ label = 'Sample' }: { label?: string }) {
  return (
    <span className="pending" title="Placeholder data. Replace in src/content/catalogue.ts">
      {label}
    </span>
  );
}
