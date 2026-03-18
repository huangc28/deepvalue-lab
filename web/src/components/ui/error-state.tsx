import { Panel, PanelBody, PanelChrome } from './panel'

export function ErrorState({
  label = 'Error',
  message = 'Failed to load data. Please try again.',
}: {
  label?: string
  message?: string
}) {
  return (
    <Panel className="overflow-hidden">
      <PanelChrome label={label} status="error" />
      <PanelBody>
        <p className="py-12 text-center font-mono text-sm uppercase tracking-[0.16em] text-[var(--ink-muted)]">
          {message}
        </p>
      </PanelBody>
    </Panel>
  )
}
