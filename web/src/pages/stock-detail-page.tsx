import type { ReactNode } from 'react'

import { Link } from '@tanstack/react-router'

import { ExpectationBridge } from '../components/detail/expectation-bridge'
import { ScenarioCard } from '../components/detail/scenario-card'
import { MetricBlock } from '../components/ui/metric-block'
import { Panel, PanelBody, PanelChrome } from '../components/ui/panel'
import {
  ActionBadge,
  NewsImpactBadge,
  TechnicalBadge,
  ThesisBadge,
  ValuationBadge,
} from '../components/ui/status-badge'
import { TerminalLabel } from '../components/ui/terminal-label'
import { getStockByTicker } from '../data/mock-stocks'
import type { FactItem } from '../types/stocks'

interface StockDetailPageProps {
  ticker: string
}

export function StockDetailPage({ ticker }: StockDetailPageProps) {
  const stock = getStockByTicker(ticker)

  if (!stock) {
    return (
      <section className="rounded-[1.75rem] border border-dashed border-[var(--line-strong)] bg-[var(--surface-panel)] p-10">
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
          Stock Not Found
        </p>
        <h2 className="mt-3 font-serif text-3xl tracking-tight text-[var(--ink-primary)]">
          There is no mock stock wired to {ticker.toUpperCase()} yet.
        </h2>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full border border-[var(--line-subtle)] bg-[var(--surface-chip)] px-4 py-2 font-mono text-sm font-medium text-[var(--ink-primary)]"
        >
          $ back /dashboard
        </Link>
      </section>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <Panel className="overflow-hidden bg-[linear-gradient(135deg,_rgba(22,27,34,1),_rgba(13,17,23,1))]">
        <PanelChrome
          label={`${stock.ticker.toLowerCase()}.analysis`}
          status={stock.lastUpdated}
        />
        <PanelBody className="space-y-8 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <Link
                to="/"
                className="font-mono text-sm text-[var(--ink-muted)] transition hover:text-[var(--ink-primary)]"
              >
                ← open /dashboard
              </Link>
              <TerminalLabel>{stock.businessType}</TerminalLabel>
              <h2 className="mt-3 font-serif text-[3.4rem] leading-[0.96] tracking-[-0.05em] text-[var(--ink-primary)] md:text-[4.2rem]">
                {stock.companyName}
              </h2>
              <p className="mt-3 font-mono text-sm uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                {stock.ticker} · updated {stock.lastUpdated}
              </p>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--ink-secondary)]">
                {stock.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:max-w-[24rem] lg:justify-end">
              <ActionBadge value={stock.actionState} />
              <ValuationBadge value={stock.valuationStatus} />
              <ThesisBadge value={stock.thesisStatus} />
              <NewsImpactBadge value={stock.newsImpactStatus} />
              <TechnicalBadge value={stock.technicalEntryStatus} />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            <MetricBlock
              label="Current Price"
              value={`$${stock.currentPrice.toFixed(1)}`}
            />
            <MetricBlock
              label="Fair Value Range"
              value={`$${stock.bearFairValue.toFixed(0)} - $${stock.bullFairValue.toFixed(0)}`}
            />
            <MetricBlock
              label="Discount To Base"
              value={`${stock.discountToBase > 0 ? '+' : ''}${stock.discountToBase.toFixed(1)}%`}
            />
            <MetricBlock
              label="What To Do Now"
              value={toTitle(stock.actionState)}
            />
          </div>
        </PanelBody>
      </Panel>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <ResearchSection
            fileLabel="conclusion.md"
            title="Provisional Conclusion"
            description={stock.provisionalConclusion ?? stock.summary}
          >
            <InfoList
              items={[
                ['Current Call', stock.provisionalConclusion ?? stock.summary],
                ['Decision Summary', stock.summary],
                [
                  'Next Step',
                  stock.monitorNext[0] ?? 'Review the next material update.',
                ],
                ['Why It Matters', stock.currentPriceImplies],
              ]}
            />
          </ResearchSection>

          <div className="grid gap-6 lg:grid-cols-2">
            <ResearchSection
              fileLabel="business-classification.ts"
              title="Business Classification"
              description="Business type should remain visible because valuation method depends on it."
            >
              <InfoList
                items={[
                  ['Business Type', stock.businessType],
                  ['Why It Matters', stock.valuationLens.rationale],
                ]}
              />
            </ResearchSection>

            <ResearchSection
              fileLabel="variant-perception.md"
              title="Why This May Be Mispriced"
              description={stock.variantPerception}
            >
              <BulletList items={[stock.variantPerception]} />
            </ResearchSection>
          </div>

          <ResearchSection
            fileLabel="thesis.md"
            title="Thesis"
            description={stock.thesisStatement}
          >
            <BulletList items={stock.thesisBullets} />
          </ResearchSection>

          <div className="grid gap-6 lg:grid-cols-2">
            <ResearchSection
              fileLabel="valuation.ts"
              title="Valuation Lens"
              description="The framework should be explicit, not hidden behind a target price."
            >
              <InfoList
                items={[
                  ['Primary Lens', stock.valuationLens.primary],
                  ['Cross-check', stock.valuationLens.crossCheck],
                  ['Why It Fits', stock.valuationLens.rationale],
                ]}
              />
            </ResearchSection>

            <ResearchSection
              fileLabel="snapshot.json"
              title="Current Valuation Snapshot"
              description="Current multiples and balance-sheet context anchor the market setup."
            >
              <InfoList
                items={[
                  [
                    'Market Cap',
                    stock.currentValuationSnapshot.marketCap ?? 'n/a',
                  ],
                  [
                    'Enterprise Value',
                    stock.currentValuationSnapshot.enterpriseValue ?? 'n/a',
                  ],
                  [
                    'Key Multiples',
                    stock.currentValuationSnapshot.multiples.join(' · '),
                  ],
                  [
                    'Balance Sheet Context',
                    stock.currentValuationSnapshot.balanceSheetNote ?? 'n/a',
                  ],
                ]}
              />
            </ResearchSection>
          </div>

          <ResearchSection
            fileLabel="news-to-model.log"
            title="Recent News And News-To-Model"
            description="Only recent developments that change the underwriting belong here."
          >
            <div className="space-y-4">
              {stock.newsToModel.map((item) => (
                <div
                  key={item.event}
                  className="rounded-[1.1rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] p-4"
                >
                  <InfoList
                    items={[
                      ['Event', item.event],
                      ['Model Variable Changed', item.modelVariableChanged],
                      ['Impact', item.impact],
                      ['Affected Scenario', item.affectedScenario],
                    ]}
                  />
                </div>
              ))}
            </div>
          </ResearchSection>

          <ResearchSection
            fileLabel="scenario-model.json"
            title="Bear / Base / Bull Scenarios"
            description="Scenarios must remain auditable from their operating and valuation assumptions."
          >
            <div className="grid gap-5 xl:grid-cols-3">
              {stock.scenarios.map((scenario) => (
                <ScenarioCard key={scenario.label} scenario={scenario} />
              ))}
            </div>
          </ResearchSection>

          <ResearchSection
            fileLabel="pricing-context.md"
            title="What The Current Price Implies"
            description={stock.currentPriceImplies}
          >
            <div className="space-y-4">
              <BulletList items={[stock.currentPriceImplies]} />
              {stock.currentPriceImpliedFacts?.length ? (
                <ExpectationBridge
                  items={stock.currentPriceImpliedFacts}
                  currentPrice={stock.currentPrice}
                  bearFairValue={stock.bearFairValue}
                  baseFairValue={stock.baseFairValue}
                  bullFairValue={stock.bullFairValue}
                />
              ) : null}
            </div>
          </ResearchSection>

          <div className="grid gap-6 lg:grid-cols-2">
            <ResearchSection
              fileLabel="thesis-status.md"
              title="Thesis Status"
              description={`Current status: ${stock.thesisStatus}.`}
            >
              <InfoList
                items={[
                  ['Current Status', toTitle(stock.thesisStatus)],
                  [
                    'What Remains True',
                    stock.thesisBullets[0] ?? stock.thesisStatement,
                  ],
                  [
                    'What Needs Watching',
                    stock.thesisBullets[1] ??
                      'Await the next material company update.',
                  ],
                ]}
              />
            </ResearchSection>

            <ResearchSection
              fileLabel="entry-timing.tsx"
              title="Technical Entry Status"
              description="Technicals stay in the execution layer after valuation and thesis work."
            >
              <div className="space-y-4">
                <InfoList
                  items={[
                    ['Entry Status', toTitle(stock.technicalEntryStatus)],
                    ['Timing Note', stock.technicalCommentary ?? stock.summary],
                    ['Framework', 'RSI + EMA + MRC-compatible stretch logic'],
                  ]}
                />
                {stock.technicalSignals?.length ? (
                  <InfoList items={toInfoItems(stock.technicalSignals)} />
                ) : null}
              </div>
            </ResearchSection>
          </div>

          <ResearchSection
            fileLabel="risks-catalysts.md"
            title="Risks And Catalysts"
            description="Keep the key downside variables and potential unlocks visible in the same frame."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <TerminalLabel>downside variables</TerminalLabel>
                <div className="mt-4">
                  <BulletList items={stock.risks} />
                </div>
              </div>
              <div>
                <TerminalLabel>possible unlocks</TerminalLabel>
                <div className="mt-4">
                  <BulletList items={stock.catalysts} />
                </div>
              </div>
            </div>
          </ResearchSection>

          <div className="grid gap-6 lg:grid-cols-2">
            <ResearchSection
              fileLabel="monitor-next.md"
              title="What To Monitor Next"
              description="These are the next facts most likely to move valuation, thesis, or scenario probabilities."
            >
              <BulletList items={stock.monitorNext} />
            </ResearchSection>

            <ResearchSection
              fileLabel="sources.yml"
              title="Sources Used"
              description="Every major claim should stay traceable to a current source."
            >
              <SourceList items={stock.sourcesUsed} />
            </ResearchSection>
          </div>

          <ResearchSection
            fileLabel="history.log"
            title="History"
            description="Track how the case has changed over time."
          >
            <BulletList items={stock.history} />
          </ResearchSection>
        </div>

        <aside className="space-y-6">
          <Panel className="overflow-hidden">
            <PanelChrome label="sticky-summary.ts" status="fast read" />
            <PanelBody className="space-y-4">
              <TerminalLabel>status summary</TerminalLabel>
              <div className="flex flex-wrap gap-2">
                <ActionBadge value={stock.actionState} />
                <ValuationBadge value={stock.valuationStatus} />
                <ThesisBadge value={stock.thesisStatus} />
                <TechnicalBadge value={stock.technicalEntryStatus} />
              </div>
              <div className="space-y-3 rounded-[1.2rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] p-4">
                <SideMetric
                  label="Price"
                  value={`$${stock.currentPrice.toFixed(1)}`}
                />
                <SideMetric
                  label="Base FV"
                  value={`$${stock.baseFairValue.toFixed(0)}`}
                />
                <SideMetric
                  label="Discount"
                  value={`${stock.discountToBase > 0 ? '+' : ''}${stock.discountToBase.toFixed(1)}%`}
                />
              </div>
            </PanelBody>
          </Panel>

          <Panel className="overflow-hidden">
            <PanelChrome label="section-index.json" status="navigation" />
            <PanelBody className="space-y-3">
              {[
                'Provisional Conclusion',
                'Business Classification',
                'Thesis',
                'Valuation Lens',
                'News To Model',
                'Scenarios',
                'Price Implies',
                'Monitor Next',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-[var(--line-subtle)] bg-[var(--surface-chip)] px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[var(--ink-secondary)]"
                >
                  {item}
                </div>
              ))}
            </PanelBody>
          </Panel>
        </aside>
      </div>
    </div>
  )
}

function ResearchSection({
  fileLabel,
  title,
  description,
  children,
}: {
  fileLabel: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Panel className="overflow-hidden">
      <PanelChrome label={fileLabel} />
      <PanelBody className="space-y-5">
        <div>
          <TerminalLabel>{fileLabel}</TerminalLabel>
          <h3 className="mt-2 font-serif text-[1.95rem] tracking-[-0.04em] text-[var(--ink-primary)]">
            {title}
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--ink-secondary)]">
            {description}
          </p>
        </div>

        {children}
      </PanelBody>
    </Panel>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-[1.1rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-7 text-[var(--ink-secondary)]"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

function InfoList({ items }: { items: Array<[string, string]> }) {
  return (
    <dl className="space-y-4">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="grid gap-2 rounded-[1.1rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] px-4 py-4 md:grid-cols-[11rem_1fr]"
        >
          <dt className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            {label}
          </dt>
          <dd className="text-sm leading-7 text-[var(--ink-secondary)]">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function SideMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
        {label}
      </span>
      <span className="font-mono text-sm text-[var(--ink-primary)]">
        {value}
      </span>
    </div>
  )
}

function SourceList({
  items,
}: {
  items: Array<string | { label: string; url?: string }>
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const key =
          typeof item === 'string' ? item : `${item.label}-${item.url}`

        return (
          <li
            key={key}
            className="rounded-[1.1rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-7 text-[var(--ink-secondary)]"
          >
            {typeof item === 'string' || !item.url ? (
              typeof item === 'string' ? (
                item
              ) : (
                item.label
              )
            ) : (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--accent-copper)] underline-offset-4 transition hover:text-[var(--ink-primary)] hover:underline"
              >
                {item.label}
              </a>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function toInfoItems(items: FactItem[]) {
  return items.map(({ label, value }) => [label, value] as [string, string])
}

function toTitle(value: string) {
  return value.replace(/\b\w/g, (character) => character.toUpperCase())
}
