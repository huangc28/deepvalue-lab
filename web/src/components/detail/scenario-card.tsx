import { useI18n } from '../../i18n/context'
import type { Scenario } from '../../types/stocks'
import { Panel, PanelBody, PanelChrome } from '../ui/panel'

export function ScenarioCard({ scenario }: { scenario: Scenario }) {
  const { m, text } = useI18n()
  const km = scenario.keyMetrics

  return (
    <Panel className="h-full overflow-hidden">
      <PanelChrome label={`${scenario.label.toLowerCase()}.scenario`} />
      <PanelBody className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-serif text-[1.9rem] tracking-[-0.04em] text-[var(--ink-primary)]">
            {m.detail.scenario[scenario.label]}
          </p>
          <p className="font-mono text-[1.55rem] font-semibold tracking-[-0.03em] text-[var(--ink-primary)]">
            {text(scenario.fairValue)}
          </p>
        </div>
        {km ? (
          <div className="grid grid-cols-3 gap-2 rounded-[0.75rem] border border-[var(--line-subtle)] bg-[var(--surface-panel)] px-3 py-2.5">
            <KeyMetric label={m.detail.scenario.revenue} value={km.revenue} />
            <KeyMetric label={m.detail.scenario.eps} value={km.eps} />
            <KeyMetric label={m.detail.scenario.targetPE} value={km.targetPE} />
          </div>
        ) : null}
        <ScenarioField
          label={m.detail.scenario.operatingAssumption}
          value={text(scenario.operatingAssumption)}
        />
        <ScenarioField
          label={m.detail.scenario.whatMustBeTrue}
          value={text(scenario.whatMustBeTrue)}
        />
      </PanelBody>
    </Panel>
  )
}

function KeyMetric({
  label,
  value,
}: {
  label: string
  value: string | undefined
}) {
  if (!value) return null
  return (
    <div className="text-center">
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
        {label}
      </p>
      <p className="mt-1 font-mono text-sm font-semibold text-[var(--ink-primary)]">
        {value}
      </p>
    </div>
  )
}

function ScenarioField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-secondary)]">
        {value}
      </p>
    </div>
  )
}
