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
import { useI18n } from '../i18n/context'
import type { FactItem } from '../types/stocks'

interface StockDetailPageProps {
  ticker: string
}

export function StockDetailPage({ ticker }: StockDetailPageProps) {
  const { m, text } = useI18n()
  const stock = getStockByTicker(ticker)

  if (!stock) {
    return (
      <section className="rounded-[1.75rem] border border-dashed border-[var(--line-strong)] bg-[var(--surface-panel)] p-10">
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
          {m.detail.stockNotFound}
        </p>
        <h2 className="mt-3 font-serif text-3xl tracking-tight text-[var(--ink-primary)]">
          {m.detail.stockNotFoundBody.replace('{ticker}', ticker.toUpperCase())}
        </h2>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full border border-[var(--line-subtle)] bg-[var(--surface-chip)] px-4 py-2 font-mono text-sm font-medium text-[var(--ink-primary)]"
        >
          {m.detail.backToDashboard}
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
                {m.detail.backToDashboard}
              </Link>
              <TerminalLabel>{text(stock.businessType)}</TerminalLabel>
              <h2 className="mt-3 font-serif text-[3.4rem] leading-[0.96] tracking-[-0.05em] text-[var(--ink-primary)] md:text-[4.2rem]">
                {stock.companyName}
              </h2>
              <p className="mt-3 font-mono text-sm uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                {stock.ticker} · {m.detail.updated} {stock.lastUpdated}
              </p>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--ink-secondary)]">
                {text(stock.summary)}
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
              label={m.detail.currentPrice}
              value={`$${stock.currentPrice.toFixed(1)}`}
            />
            <MetricBlock
              label={m.detail.fairValueRange}
              value={`$${stock.bearFairValue.toFixed(0)} - $${stock.bullFairValue.toFixed(0)}`}
            />
            <MetricBlock
              label={m.detail.discountToBase}
              value={`${stock.discountToBase > 0 ? '+' : ''}${stock.discountToBase.toFixed(1)}%`}
            />
            <MetricBlock
              label={m.detail.whatToDoNow}
              value={m.status.actionValue[stock.actionState]}
            />
          </div>
        </PanelBody>
      </Panel>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <ResearchSection
            fileLabel="conclusion.md"
            title={m.detail.conclusionTitle}
            description={text(stock.provisionalConclusion ?? stock.summary)}
          >
            <InfoList
              items={[
                [
                  m.detail.currentCall,
                  text(stock.provisionalConclusion ?? stock.summary),
                ],
                [m.detail.decisionSummary, text(stock.summary)],
                [
                  m.detail.nextStep,
                  text(
                    stock.monitorNext[0] ?? 'Review the next material update.',
                  ),
                ],
                [m.detail.whyItMatters, text(stock.currentPriceImplies)],
              ]}
            />
          </ResearchSection>

          <div className="grid gap-6 lg:grid-cols-2">
            <ResearchSection
              fileLabel="business-classification.ts"
              title={m.detail.businessClassificationTitle}
              description={m.detail.businessClassificationDescription}
            >
              <InfoList
                items={[
                  [m.detail.businessType, text(stock.businessType)],
                  [m.detail.whyItFits, text(stock.valuationLens.rationale)],
                ]}
              />
            </ResearchSection>

            <ResearchSection
              fileLabel="variant-perception.md"
              title={m.detail.variantPerceptionTitle}
              description={text(stock.variantPerception)}
            >
              <BulletList items={[stock.variantPerception]} />
            </ResearchSection>
          </div>

          <ResearchSection
            fileLabel="thesis.md"
            title={m.detail.thesisTitle}
            description={text(stock.thesisStatement)}
          >
            <BulletList items={stock.thesisBullets} />
          </ResearchSection>

          <div className="grid gap-6 lg:grid-cols-2">
            <ResearchSection
              fileLabel="valuation.ts"
              title={m.detail.valuationLensTitle}
              description={m.detail.valuationLensDescription}
            >
              <InfoList
                items={[
                  [m.detail.primaryLens, text(stock.valuationLens.primary)],
                  [m.detail.crossCheck, text(stock.valuationLens.crossCheck)],
                  [m.detail.whyItFits, text(stock.valuationLens.rationale)],
                ]}
              />
            </ResearchSection>

            <ResearchSection
              fileLabel="snapshot.json"
              title={m.detail.currentValuationSnapshotTitle}
              description={m.detail.currentValuationSnapshotDescription}
            >
              <InfoList
                items={[
                  [
                    m.detail.marketCap,
                    text(stock.currentValuationSnapshot.marketCap ?? 'n/a'),
                  ],
                  [
                    m.detail.enterpriseValue,
                    text(
                      stock.currentValuationSnapshot.enterpriseValue ?? 'n/a',
                    ),
                  ],
                  [
                    m.detail.keyMultiples,
                    stock.currentValuationSnapshot.multiples
                      .map((item) => text(item))
                      .join(' · '),
                  ],
                  [
                    m.detail.balanceSheetContext,
                    text(
                      stock.currentValuationSnapshot.balanceSheetNote ?? 'n/a',
                    ),
                  ],
                ]}
              />
            </ResearchSection>
          </div>

          <ResearchSection
            fileLabel="news-to-model.log"
            title={m.detail.newsToModelTitle}
            description={m.detail.newsToModelDescription}
          >
            <div className="space-y-4">
              {stock.newsToModel.map((item) => (
                <div
                  key={text(item.event)}
                  className="rounded-[1.1rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] p-4"
                >
                  <InfoList
                    items={[
                      [m.detail.event, text(item.event)],
                      [
                        m.detail.modelVariableChanged,
                        text(item.modelVariableChanged),
                      ],
                      [m.detail.impact, text(item.impact)],
                      [m.detail.affectedScenario, text(item.affectedScenario)],
                    ]}
                  />
                </div>
              ))}
            </div>
          </ResearchSection>

          <ResearchSection
            fileLabel="scenario-model.json"
            title={m.detail.scenariosTitle}
            description={m.detail.scenariosDescription}
          >
            <div className="grid gap-5 xl:grid-cols-3">
              {stock.scenarios.map((scenario) => (
                <ScenarioCard key={scenario.label} scenario={scenario} />
              ))}
            </div>
          </ResearchSection>

          <ResearchSection
            fileLabel="pricing-context.md"
            title={m.detail.currentPriceImpliesTitle}
            description={text(stock.currentPriceImplies)}
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
              title={m.detail.thesisStatusTitle}
              description={m.detail.thesisStatusDescription.replace(
                '{status}',
                m.status.thesisValue[stock.thesisStatus],
              )}
            >
              <InfoList
                items={[
                  [
                    m.detail.currentStatus,
                    m.status.thesisValue[stock.thesisStatus],
                  ],
                  [
                    m.detail.whatRemainsTrue,
                    text(stock.thesisBullets[0] ?? stock.thesisStatement),
                  ],
                  [
                    m.detail.whatNeedsWatching,
                    text(
                      stock.thesisBullets[1] ??
                        'Await the next material company update.',
                    ),
                  ],
                ]}
              />
            </ResearchSection>

            <ResearchSection
              fileLabel="entry-timing.tsx"
              title={m.detail.technicalEntryStatusTitle}
              description={m.detail.technicalEntryStatusDescription}
            >
              <div className="space-y-4">
                <InfoList
                  items={[
                    [
                      m.detail.entryStatus,
                      m.status.entryValue[stock.technicalEntryStatus],
                    ],
                    [
                      m.detail.timingNote,
                      text(stock.technicalCommentary ?? stock.summary),
                    ],
                    [
                      m.detail.framework,
                      'RSI + EMA + MRC-compatible stretch logic',
                    ],
                  ]}
                />
                {stock.technicalSignals?.length ? (
                  <InfoList items={toInfoItems(stock.technicalSignals, text)} />
                ) : null}
              </div>
            </ResearchSection>
          </div>

          <ResearchSection
            fileLabel="risks-catalysts.md"
            title={m.detail.risksAndCatalystsTitle}
            description={m.detail.risksAndCatalystsDescription}
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <TerminalLabel>{m.detail.downsideVariables}</TerminalLabel>
                <div className="mt-4">
                  <BulletList items={stock.risks} />
                </div>
              </div>
              <div>
                <TerminalLabel>{m.detail.possibleUnlocks}</TerminalLabel>
                <div className="mt-4">
                  <BulletList items={stock.catalysts} />
                </div>
              </div>
            </div>
          </ResearchSection>

          <div className="grid gap-6 lg:grid-cols-2">
            <ResearchSection
              fileLabel="monitor-next.md"
              title={m.detail.monitorNextTitle}
              description={m.detail.monitorNextDescription}
            >
              <BulletList items={stock.monitorNext} />
            </ResearchSection>

            <ResearchSection
              fileLabel="sources.yml"
              title={m.detail.sourcesUsedTitle}
              description={m.detail.sourcesUsedDescription}
            >
              <SourceList items={stock.sourcesUsed} />
            </ResearchSection>
          </div>

          <ResearchSection
            fileLabel="history.log"
            title={m.detail.historyTitle}
            description={m.detail.historyDescription}
          >
            <BulletList items={stock.history} />
          </ResearchSection>
        </div>

        <aside className="space-y-6">
          <Panel className="overflow-hidden">
            <PanelChrome
              label="sticky-summary.ts"
              status={m.detail.stickySummaryStatus}
            />
            <PanelBody className="space-y-4">
              <TerminalLabel>{m.detail.stickySummaryLabel}</TerminalLabel>
              <div className="flex flex-wrap gap-2">
                <ActionBadge value={stock.actionState} />
                <ValuationBadge value={stock.valuationStatus} />
                <ThesisBadge value={stock.thesisStatus} />
                <TechnicalBadge value={stock.technicalEntryStatus} />
              </div>
              <div className="space-y-3 rounded-[1.2rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] p-4">
                <SideMetric
                  label={m.detail.price}
                  value={`$${stock.currentPrice.toFixed(1)}`}
                />
                <SideMetric
                  label={m.detail.baseFv}
                  value={`$${stock.baseFairValue.toFixed(0)}`}
                />
                <SideMetric
                  label={m.detail.discount}
                  value={`${stock.discountToBase > 0 ? '+' : ''}${stock.discountToBase.toFixed(1)}%`}
                />
              </div>
            </PanelBody>
          </Panel>

          <Panel className="overflow-hidden">
            <PanelChrome
              label="section-index.json"
              status={m.detail.navigationStatus}
            />
            <PanelBody className="space-y-3">
              {[
                m.detail.sectionIndex.conclusion,
                m.detail.sectionIndex.businessClassification,
                m.detail.sectionIndex.thesis,
                m.detail.sectionIndex.valuationLens,
                m.detail.sectionIndex.newsToModel,
                m.detail.sectionIndex.scenarios,
                m.detail.sectionIndex.priceImplies,
                m.detail.sectionIndex.monitorNext,
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

function BulletList({ items }: { items: FactItem['label'][] }) {
  const { text } = useI18n()

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={text(item)}
          className="rounded-[1.1rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-7 text-[var(--ink-secondary)]"
        >
          {text(item)}
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
  items: Array<string | { label: FactItem['label']; url?: string }>
}) {
  const { text } = useI18n()

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const key =
          typeof item === 'string'
            ? item
            : `${text(item.label)}-${item.url ?? 'no-url'}`

        return (
          <li
            key={key}
            className="rounded-[1.1rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-7 text-[var(--ink-secondary)]"
          >
            {typeof item === 'string' || !item.url ? (
              typeof item === 'string' ? (
                text(item)
              ) : (
                text(item.label)
              )
            ) : (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--accent-copper)] underline-offset-4 transition hover:text-[var(--ink-primary)] hover:underline"
              >
                {text(item.label)}
              </a>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function toInfoItems(
  items: FactItem[],
  text: (value: FactItem['label']) => string,
) {
  return items.map(
    ({ label, value }) => [text(label), text(value)] as [string, string],
  )
}
