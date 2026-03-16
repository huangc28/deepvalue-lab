import { cx } from '../../lib/cx'

export function MetricBlock({
  label,
  value,
  detail,
  className,
}: {
  label: string
  value: string
  detail?: string
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
      <p className="mt-3 font-mono text-2xl font-semibold tracking-[-0.03em] text-[var(--ink-primary)]">
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
