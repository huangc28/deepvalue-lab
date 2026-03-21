import { useState, type ReactNode } from 'react'

import { Link } from '@tanstack/react-router'

import { ExpectationBridge } from '../components/detail/expectation-bridge'
import { HistoricalRevisionLedger } from '../components/detail/historical-revision-ledger'
import { ScenarioCard } from '../components/detail/scenario-card'
import { ErrorState } from '../components/ui/error-state'
import { LoadingState } from '../components/ui/loading-state'
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
import { ApiError } from '../lib/api'
import { useStock } from '../lib/queries'
import type { FactItem } from '../types/stocks'

interface StockDetailPageProps {
  ticker: string
}

export function StockDetailPage({ ticker }: StockDetailPageProps) {
  const { locale, m, text } = useI18n()
  const mockStock = getStockByTicker(ticker)
  const { data: liveStock, isLoading, error } = useStock(ticker, locale)
  const stock = liveStock ?? mockStock

  if (isLoading && !stock) {
    return <LoadingState label={`value-deck://stocks/${ticker}`} />
  }

  if (error instanceof ApiError && error.status === 404 && !stock) {
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

  if (error || !stock) return <ErrorState label={`value-deck://stocks/${ticker}`} />

  const nearestScenario = getNearestScenario(stock)
  const historicalReports = stock.historicalReports ?? mockStock?.historicalReports
  const historyItems = stock.history ?? mockStock?.history ?? []

  return (
    <div className="flex flex-col gap-8">
      <Panel className="overflow-hidden bg-[linear-gradient(135deg,_rgba(22,27,34,1),_rgba(13,17,23,1))]">
        <PanelChrome
          label={m.detail.heroPanelLabel}
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
              <h2 className="mt-3 font-serif text-[2.4rem] leading-[0.96] tracking-[-0.05em] text-[var(--ink-primary)] sm:text-[3.4rem] md:text-[4.2rem]">
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

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MetricBlock
              label={m.detail.currentPrice}
              value={`$${stock.currentPrice.toFixed(1)}`}
            />
            <MetricBlock
              label={m.detail.fairValueRange}
              value={`$${stock.bearFairValue.toFixed(0)} - $${stock.bullFairValue.toFixed(0)}`}
            />
            <MetricBlock
              label={
                stock.discountToBase > 0
                  ? m.detail.premiumToBase
                  : m.detail.discountToBase
              }
              value={`${stock.discountToBase > 0 ? '+' : ''}${stock.discountToBase.toFixed(1)}%`}
              tone={stock.discountToBase > 0 ? 'negative' : 'positive'}
            />
            <MetricBlock
              label={m.detail.upsideDownside}
              value={`+${(((stock.bullFairValue - stock.currentPrice) / stock.currentPrice) * 100).toFixed(0)}% / -${(((stock.currentPrice - stock.bearFairValue) / stock.currentPrice) * 100).toFixed(0)}%`}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <HeroInsightCard
              label={m.detail.variantPerceptionTitle}
              value={text(stock.variantPerception)}
            />
            <HeroInsightCard
              label={m.detail.heroPriceImpliesLabel}
              value={text(
                stock.currentPriceImpliesBrief ?? stock.currentPriceImplies,
              )}
              meta={[
                [m.detail.nearestScenario, m.detail.scenario[nearestScenario]],
              ]}
            />
          </div>
        </PanelBody>
      </Panel>

      <div className="space-y-6">
        <ResearchSection
          fileLabel={m.detail.panelLabels.scenarioModel}
          title={m.detail.scenariosTitle}
          description={m.detail.scenariosDescription}
        >
          <div className="grid gap-5 md:grid-cols-3">
            {stock.scenarios.map((scenario) => (
              <ScenarioCard key={scenario.label} scenario={scenario} />
            ))}
          </div>
        </ResearchSection>

        <ResearchSection
          fileLabel={m.detail.panelLabels.snapshot}
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
                text(stock.currentValuationSnapshot.enterpriseValue ?? 'n/a'),
              ],
              [
                m.detail.keyMultiples,
                stock.currentValuationSnapshot.multiples
                  .map((item) => text(item))
                  .join(' · '),
              ],
              [
                m.detail.balanceSheetContext,
                text(stock.currentValuationSnapshot.balanceSheetNote ?? 'n/a'),
              ],
            ]}
          />
        </ResearchSection>

        <ResearchSection
          fileLabel={m.detail.panelLabels.pricingContext}
          title={m.detail.currentPriceImpliesTitle}
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

        <ResearchSection
          fileLabel={m.detail.panelLabels.entryTiming}
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

        <ResearchSection
          fileLabel={m.detail.panelLabels.conclusion}
          title={m.detail.conclusionTitle}
        >
          <InfoList
            items={[
              [
                m.detail.currentCall,
                text(stock.provisionalConclusion ?? stock.summary),
              ],
              [m.detail.pricedIn, text(stock.currentPriceImplies)],
              [
                m.detail.nextStep,
                text(stock.monitorNext[0] ?? 'Review the next material update.'),
              ],
              [
                m.detail.whatBreaksThis,
                text(stock.risks[0] ?? 'A key underwriting variable changes.'),
              ],
            ]}
          />
        </ResearchSection>

        <ResearchSection
          fileLabel={m.detail.panelLabels.valuationContext}
          title={m.detail.valuationContextTitle}
          description={m.detail.valuationContextDescription}
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
          fileLabel={m.detail.panelLabels.thesis}
          title={m.detail.thesisTitle}
          description={text(stock.thesisStatement)}
        />

        <ResearchSection
          fileLabel={m.detail.panelLabels.newsToModel}
          title={m.detail.newsToModelTitle}
          description={m.detail.newsToModelDescription}
        >
          <div className="space-y-3">
            {stock.newsToModel.map((item) => (
              <NewsToModelCard
                key={text(item.event)}
                event={text(item.event)}
                impact={text(item.impact)}
                modelVariable={text(item.modelVariableChanged)}
                scenario={text(item.affectedScenario)}
                eventLabel={m.detail.modelVariableChanged}
                impactLabel={m.detail.impact}
              />
            ))}
          </div>
        </ResearchSection>

        <ResearchSection
          fileLabel={m.detail.panelLabels.thesisStatus}
          title={m.detail.thesisStatusTitle}
        >
          <InfoList
            items={[
              [m.detail.currentStatus, m.status.thesisValue[stock.thesisStatus]],
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
          fileLabel={m.detail.panelLabels.risksAndCatalysts}
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
            fileLabel={m.detail.panelLabels.monitorNext}
            title={m.detail.monitorNextTitle}
            description={m.detail.monitorNextDescription}
          >
            <BulletList items={stock.monitorNext} />
          </ResearchSection>

          <ResearchSection
            fileLabel={m.detail.panelLabels.sources}
            title={m.detail.sourcesUsedTitle}
            description={m.detail.sourcesUsedDescription}
          >
            <SourceList items={stock.sourcesUsed} />
          </ResearchSection>
        </div>

        <ResearchSection
          fileLabel={m.detail.panelLabels.history}
          title={m.detail.historyTitle}
          description={m.detail.historyDescription}
        >
          <HistoricalRevisionLedger
            reports={historicalReports}
            legacyItems={historyItems}
          />
        </ResearchSection>
      </div>
    </div>
  )
}

function HeroInsightCard({
  label,
  value,
  meta,
}: {
  label: string
  value: string
  meta?: Array<[string, string]>
}) {
  return (
    <div className="rounded-[1.2rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] px-5 py-5">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
        {label}
      </p>
      <p className="mt-3 text-sm leading-7 text-[var(--ink-secondary)]">
        {value}
      </p>
      {meta?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {meta.map(([key, metaValue]) => (
            <span
              key={`${key}-${metaValue}`}
              className="inline-flex rounded-full border border-[var(--line-subtle)] bg-[var(--surface-chip)] px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[var(--ink-secondary)]"
            >
              {key}: {metaValue}
            </span>
          ))}
        </div>
      ) : null}
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
  description?: string
  children?: ReactNode
}) {
  return (
    <Panel className="overflow-hidden">
      <PanelChrome label={fileLabel} />
      <PanelBody className="space-y-5">
        <div>
          <h3 className="font-serif text-[1.95rem] tracking-[-0.04em] text-[var(--ink-primary)]">
            {title}
          </h3>
          {description ? (
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--ink-secondary)]">
              {description}
            </p>
          ) : null}
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

function getNearestScenario(stock: {
  currentPrice: number
  bearFairValue: number
  baseFairValue: number
  bullFairValue: number
}) {
  const scenarios = [
    { label: 'Bear' as const, value: stock.bearFairValue },
    { label: 'Base' as const, value: stock.baseFairValue },
    { label: 'Bull' as const, value: stock.bullFairValue },
  ]

  return scenarios.reduce((closest, scenario) => {
    const currentDistance = Math.abs(stock.currentPrice - scenario.value)
    const bestDistance = Math.abs(stock.currentPrice - closest.value)

    return currentDistance < bestDistance ? scenario : closest
  }).label
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

function NewsToModelCard({
  event,
  impact,
  modelVariable,
  scenario,
  eventLabel,
  impactLabel,
}: {
  event: string
  impact: string
  modelVariable: string
  scenario: string
  eventLabel: string
  impactLabel: string
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setExpanded((prev) => !prev)}
      className="w-full cursor-pointer rounded-[1.1rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] px-4 py-4 text-left transition hover:border-[var(--line-strong)]"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm leading-7 text-[var(--ink-secondary)]">
          {event}
        </p>
        <span className="mt-1 shrink-0 rounded-full border border-[var(--line-subtle)] bg-[var(--surface-chip)] px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
          {scenario}
        </span>
      </div>
      {expanded ? (
        <div className="mt-3 space-y-2 border-t border-[var(--line-subtle)] pt-3">
          <div className="grid gap-1 md:grid-cols-[11rem_1fr]">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              {eventLabel}
            </p>
            <p className="text-xs leading-6 text-[var(--ink-secondary)]">
              {modelVariable}
            </p>
          </div>
          <div className="grid gap-1 md:grid-cols-[11rem_1fr]">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              {impactLabel}
            </p>
            <p className="text-xs leading-6 text-[var(--ink-secondary)]">
              {impact}
            </p>
          </div>
        </div>
      ) : null}
    </button>
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
