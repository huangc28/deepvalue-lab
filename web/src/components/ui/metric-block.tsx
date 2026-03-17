import { cx } from '../../lib/cx'

export function MetricBlock({
  label,
  value,
  detail,
  tone,
  className,
}: {
  label: string
  value: string
  detail?: string
  tone?: 'positive' | 'negative'
  className?: string
}) {
  return (
    <div
      className={cx(
        'rounded-[1.25rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] px-4 py-4',
        className,
      )}
    >
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
        {label}
      </p>
      <p
        className={cx(
          'mt-3 font-mono text-[1.55rem] font-semibold tracking-[-0.03em]',
          tone === 'positive' && 'text-[var(--signal-positive)]',
          tone === 'negative' && 'text-[var(--signal-negative,#e5534b)]',
          !tone && 'text-[var(--ink-primary)]',
        )}
      >
        {value}
      </p>
      {detail ? (
        <p className="mt-2 text-xs leading-5 text-[var(--ink-secondary)]">
          {detail}
        </p>
      ) : null}
    </div>
  )
}
