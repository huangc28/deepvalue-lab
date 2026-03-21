import { useI18n } from '../../i18n/context'

export function ProjectConfessionCard() {
  const { m } = useI18n()

  return (
    <div className="rounded-2xl border border-[var(--line-subtle)] bg-[var(--surface-panel)] px-6 py-5">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
        {m.confession.label}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-secondary)]">
        {m.confession.body}
      </p>
      <p className="mt-3 text-sm leading-6 text-[var(--ink-secondary)]">
        {m.confession.ctaRequest}{' '}
        <a
          href="mailto:huangchiheng@gmail.com"
          className="text-[var(--ink-primary)] underline underline-offset-2 transition hover:opacity-70"
        >
          {m.confession.ctaEmail}
        </a>
        {' ·'} {m.confession.ctaFuture}
      </p>
    </div>
  )
}
