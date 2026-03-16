import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cx } from '../../lib/cx'

export function Panel({
  className,
  ...props
}: ComponentPropsWithoutRef<'section'>) {
  return (
    <section
      className={cx(
        'rounded-[1.6rem] border border-[var(--line-subtle)] bg-[var(--surface-panel)] shadow-[0_18px_48px_rgba(1,4,9,0.24)]',
        className,
      )}
      {...props}
    />
  )
}

export function PanelChrome({
  label,
  status,
  className,
}: {
  label: string
  status?: string
  className?: string
}) {
  return (
    <div
      className={cx(
        'flex items-center justify-between gap-4 border-b border-[var(--line-subtle)] px-5 py-3',
        className,
      )}
    >
      <span className="font-mono text-[0.78rem] tracking-[0.14em] text-[var(--ink-muted)]">
        {label}
      </span>
      {status ? (
        <span className="font-mono text-[0.75rem] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
          {status}
        </span>
      ) : null}
    </div>
  )
}

export function PanelBody({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx('p-6', className)} {...props} />
}

export function PanelLead({
  label,
  title,
  description,
  aside,
}: {
  label?: string
  title: ReactNode
  description?: ReactNode
  aside?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {label ? (
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-[var(--accent-copper)]">
            {label}
          </p>
        ) : null}
        <h2 className="mt-2 font-serif text-[2.35rem] leading-[1.08] tracking-[-0.04em] text-[var(--ink-primary)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-secondary)]">
            {description}
          </p>
        ) : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  )
}
