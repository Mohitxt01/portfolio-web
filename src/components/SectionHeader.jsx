/* =========================================================
   SECTION HEADER — the repeating editorial device.
   Index number, rule, label. Used by every section so the
   page reads as one document rather than stacked widgets.
   ========================================================= */

export default function SectionHeader({ num, label, align = 'left' }) {
  return (
    <div className={`sec-head sec-head--${align}`}>
      <span className="sec-head__num mono">{num}</span>
      <span className="sec-head__rule" aria-hidden="true" />
      <span className="sec-head__label label">{label}</span>
    </div>
  );
}

/**
 * Section title. Pass plain text plus an optional italic serif accent
 * so the "serif word inside a display headline" treatment stays
 * identical everywhere instead of being re-marked-up per section.
 */
export function SectionTitle({ children, className = '', as: Tag = 'h2' }) {
  return <Tag className={`sec-title display ${className}`}>{children}</Tag>;
}

/** The italic-serif accent word used inside SectionTitle. */
export function Accent({ children, volt = false }) {
  return <em className={`serif${volt ? ' volt' : ''}`}>{children}</em>;
}
