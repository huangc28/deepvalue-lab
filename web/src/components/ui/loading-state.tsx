import { Panel, PanelBody, PanelChrome } from './panel'

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <Panel className="overflow-hidden">
      <PanelChrome label={label} status="loading" />
      <PanelBody>
        <p className="py-12 text-center font-mono text-sm uppercase tracking-[0.16em] text-[var(--ink-muted)]">
          Loading data...
        </p>
      </PanelBody>
    </Panel>
  )
}
