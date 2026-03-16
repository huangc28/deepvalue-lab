import { useI18n } from '../../i18n/context'
import type { Scenario } from '../../types/stocks'
import { Panel, PanelBody, PanelChrome } from '../ui/panel'

export function ScenarioCard({ scenario }: { scenario: Scenario }) {
  const { m, text } = useI18n()

  return (
    <Panel className="h-full overflow-hidden">
      <PanelChrome label={`${scenario.label.toLowerCase()}.scenario`} />
      <PanelBody className="space-y-4">
        <p className="font-serif text-[1.9rem] tracking-[-0.04em] text-[var(--ink-primary)]">
          {m.detail.scenario[scenario.label]}
        </p>
        <ScenarioField
          label={m.detail.scenario.operatingAssumption}
          value={text(scenario.operatingAssumption)}
        />
        <ScenarioField
          label={m.detail.scenario.valuationAssumption}
          value={text(scenario.valuationAssumption)}
        />
        <ScenarioField
          label={m.detail.scenario.fairValue}
          value={text(scenario.fairValue)}
        />
        <ScenarioField
          label={m.detail.scenario.whatMustBeTrue}
          value={text(scenario.whatMustBeTrue)}
        />
      </PanelBody>
    </Panel>
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
