import { cx } from '../../lib/cx'
import { useI18n } from '../../i18n/context'
import type { FactItem } from '../../types/stocks'

export function ExpectationBridge({
  items,
  currentPrice,
  bearFairValue,
  baseFairValue,
  bullFairValue,
}: {
  items: FactItem[]
  currentPrice: number
  bearFairValue: number
  baseFairValue: number
  bullFairValue: number
}) {
  const { m, text } = useI18n()
  const currentPricePosition = toRailPosition(
    currentPrice,
    bearFairValue,
    bullFairValue,
  )
  const basePosition = toRailPosition(
    baseFairValue,
    bearFairValue,
    bullFairValue,
  )

  return (
    <div className="space-y-5">
      <div className="grid gap-3 xl:grid-cols-[repeat(4,minmax(0,1fr))]">
        {items.map((item, index) => (
          <div
            key={`${text(item.label)}-${index}`}
            className="flex items-center gap-3"
          >
            <StepCard
              label={text(item.label)}
              value={text(item.value)}
              step={index + 1}
              className="flex-1"
            />
            {index < items.length - 1 ? (
              <div className="hidden h-px flex-1 bg-[var(--line-strong)] xl:block" />
            ) : null}
          </div>
        ))}
      </div>

      <div className="rounded-[1.15rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] px-4 py-5">
        <div className="flex items-center justify-between gap-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
          <span>{m.detail.expectationBridge.range}</span>
          <span>{m.detail.expectationBridge.currentPriceInContext}</span>
        </div>

        <div className="relative mt-8 pb-8">
          <div className="h-2 rounded-full bg-[rgba(240,246,252,0.08)]" />
          <div
            className="absolute top-0 h-2 rounded-full bg-[rgba(46,160,67,0.18)]"
            style={{
              left: `${Math.min(currentPricePosition, basePosition)}%`,
              width: `${Math.abs(basePosition - currentPricePosition)}%`,
            }}
          />

          <Marker
            label={m.detail.scenario.Bear}
            value={formatCurrency(bearFairValue)}
            left={0}
            tone="muted"
          />
          <Marker
            label={m.detail.expectationBridge.current}
            value={formatCurrency(currentPrice)}
            left={currentPricePosition}
            tone="accent"
          />
          <Marker
            label={m.detail.scenario.Base}
            value={formatCurrency(baseFairValue)}
            left={basePosition}
            tone="positive"
          />
          <Marker
            label={m.detail.scenario.Bull}
            value={formatCurrency(bullFairValue)}
            left={100}
            tone="muted"
          />
        </div>
      </div>
    </div>
  )
}

function StepCard({
  label,
  value,
  step,
  className,
}: {
  label: string
  value: string
  step: number
  className?: string
}) {
  return (
    <div
      className={cx(
        'rounded-[1.15rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] px-4 py-4',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
          {label}
        </p>
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--surface-chip)] font-mono text-[0.66rem] text-[var(--ink-secondary)]">
          {step}
        </span>
      </div>
      <p className="mt-3 font-mono text-lg font-semibold text-[var(--ink-primary)]">
        {value}
      </p>
    </div>
  )
}

function Marker({
  label,
  value,
  left,
  tone,
}: {
  label: string
  value: string
  left: number
  tone: 'muted' | 'accent' | 'positive'
}) {
  return (
    <div
      className="absolute top-1.5 -translate-x-1/2"
      style={{ left: `${left}%` }}
    >
      <div
        className={cx(
          'mx-auto h-4 w-4 rounded-full border-2 bg-[var(--surface-panel)]',
          tone === 'accent' && 'border-[var(--accent-copper)]',
          tone === 'positive' && 'border-[var(--signal-positive-soft)]',
          tone === 'muted' && 'border-[var(--ink-muted)]',
        )}
      />
      <div className="mt-3 whitespace-nowrap text-center">
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
          {label}
        </p>
        <p className="mt-1 font-mono text-sm text-[var(--ink-primary)]">
          {value}
        </p>
      </div>
    </div>
  )
}

function toRailPosition(value: number, min: number, max: number) {
  if (max <= min) {
    return 50
  }

  const raw = ((value - min) / (max - min)) * 100
  return Math.max(0, Math.min(100, raw))
}

function formatCurrency(value: number) {
  return `$${value.toFixed(0)}`
}
