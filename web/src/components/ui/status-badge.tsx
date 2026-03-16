import { cx } from '../../lib/cx'
import type {
  ActionState,
  NewsImpactStatus,
  TechnicalEntryStatus,
  ThesisStatus,
  ValuationStatus,
} from '../../types/stocks'

type StatusTone = 'positive' | 'neutral' | 'watch' | 'risk' | 'accent'

const valuationTone: Record<ValuationStatus, StatusTone> = {
  cheap: 'positive',
  fair: 'neutral',
  rich: 'risk',
}

const newsTone: Record<NewsImpactStatus, StatusTone> = {
  improving: 'positive',
  unchanged: 'neutral',
  deteriorating: 'risk',
}

const thesisTone: Record<ThesisStatus, StatusTone> = {
  intact: 'positive',
  watch: 'watch',
  broken: 'risk',
}

const technicalTone: Record<TechnicalEntryStatus, StatusTone> = {
  favorable: 'positive',
  neutral: 'neutral',
  stretched: 'risk',
}

const actionTone: Record<ActionState, StatusTone> = {
  'strong accumulation': 'positive',
  'watch for confirmation': 'watch',
  'fairly valued': 'neutral',
  'trim zone': 'risk',
  'thesis at risk': 'risk',
  'needs review': 'watch',
}

const toneClass: Record<StatusTone, string> = {
  positive:
    'border-[color:rgba(46,160,67,0.36)] bg-[color:rgba(46,160,67,0.14)] text-[var(--signal-positive-soft)]',
  neutral:
    'border-[color:rgba(110,118,129,0.34)] bg-[color:rgba(110,118,129,0.14)] text-[var(--ink-secondary)]',
  watch:
    'border-[color:rgba(227,179,65,0.34)] bg-[color:rgba(158,106,3,0.16)] text-[var(--signal-watch-soft)]',
  risk: 'border-[color:rgba(218,54,51,0.32)] bg-[color:rgba(218,54,51,0.14)] text-[var(--signal-danger-soft)]',
  accent:
    'border-[color:rgba(88,166,255,0.28)] bg-[color:rgba(56,139,253,0.14)] text-[var(--accent-copper)]',
}

export function ValuationBadge({ value }: { value: ValuationStatus }) {
  return <Badge label={`valuation · ${value}`} tone={valuationTone[value]} />
}

export function NewsImpactBadge({ value }: { value: NewsImpactStatus }) {
  return <Badge label={`news · ${value}`} tone={newsTone[value]} />
}

export function ThesisBadge({ value }: { value: ThesisStatus }) {
  return <Badge label={`thesis · ${value}`} tone={thesisTone[value]} />
}

export function TechnicalBadge({ value }: { value: TechnicalEntryStatus }) {
  return <Badge label={`entry · ${value}`} tone={technicalTone[value]} />
}

export function ActionBadge({ value }: { value: ActionState }) {
  return <Badge label={value} tone={actionTone[value]} />
}

export function AccentBadge({ label }: { label: string }) {
  return <Badge label={label} tone="accent" />
}

function Badge({ label, tone }: { label: string; tone: StatusTone }) {
  return (
    <span
      className={cx(
        'inline-flex rounded-full border px-3 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em]',
        toneClass[tone],
      )}
    >
      {label}
    </span>
  )
}
