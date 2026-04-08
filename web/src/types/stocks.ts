import type { LocalizedText } from '../i18n/types'

export type ValuationStatus = 'cheap' | 'fair' | 'rich'
export type NewsImpactStatus = 'improving' | 'unchanged' | 'deteriorating'
export type ThesisStatus = 'intact' | 'watch' | 'broken'
export type TechnicalEntryStatus = 'favorable' | 'neutral' | 'stretched'
export type TechnicalChartTimeframe = '15M' | '1H' | '4H' | '1D' | '1W'
export type DashboardBucket = 'now-actionable' | 'needs-review' | 'at-risk'
export type HistoricalReportProvenance =
  | 'manual'
  | 'scheduled-monitor'
  | 'earnings-refresh'
  | 'news-refresh'
  | 'thesis-refresh'
export type ActionState =
  | 'strong accumulation'
  | 'watch for confirmation'
  | 'fairly valued'
  | 'trim zone'
  | 'thesis at risk'
  | 'needs review'

export interface ValuationLens {
  primary: LocalizedText
  crossCheck: LocalizedText
  rationale: LocalizedText
}

export interface CurrentValuationSnapshot {
  marketCap?: LocalizedText
  enterpriseValue?: LocalizedText
  multiples: LocalizedText[]
  balanceSheetNote?: LocalizedText
}

export interface NewsToModelItem {
  event: LocalizedText
  modelVariableChanged: LocalizedText
  impact: LocalizedText
  affectedScenario: LocalizedText
}

export interface ScenarioKeyMetrics {
  revenue?: string
  eps?: string
  targetPE?: string
}

export interface Scenario {
  label: 'Bear' | 'Base' | 'Bull'
  keyMetrics?: ScenarioKeyMetrics
  operatingAssumption: LocalizedText
  valuationAssumption: LocalizedText
  fairValue: LocalizedText
  whatMustBeTrue: LocalizedText
}

export interface FactItem {
  label: LocalizedText
  value: LocalizedText
}

export interface SourceReference {
  label: LocalizedText
  url?: string
}

export interface TechnicalChartPoint {
  timestampUtc: string
  exchangeTimestamp: string
  open: number
  high: number
  low: number
  close: number
  volume?: number
  rsi?: number
  emaOnRsi?: number
  mrcCenter?: number
  mrcUpper?: number
  mrcLower?: number
}

export interface TechnicalChartSeries {
  timeframe: TechnicalChartTimeframe
  timezone: string
  sessionMode: 'market-hours' | 'extended' | 'unknown'
  lookbackLabel: string
  points: TechnicalChartPoint[]
}

export interface TechnicalPriceChart {
  source: 'mock' | 'live'
  defaultTimeframe: TechnicalChartTimeframe
  availableTimeframes: TechnicalChartTimeframe[]
  seriesByTimeframe: Partial<
    Record<TechnicalChartTimeframe, TechnicalChartSeries>
  >
}

export interface LegacyTechnicalChartSeries {
  timeframe: TechnicalChartTimeframe
  points: Array<{
    date?: string
    open: number
    high: number
    low: number
    close: number
    volume?: number
  }>
}

export interface LegacyTechnicalPriceChart {
  source: 'mock' | 'live'
  defaultTimeframe?: TechnicalChartTimeframe
  availableTimeframes?: TechnicalChartTimeframe[]
  series?: LegacyTechnicalChartSeries[]
}

export type TechnicalSnapshotStatus = 'pending' | 'ready' | 'failed'

export interface TechnicalPricePoint {
  timestampUtc: string
  exchangeTimestamp: string
  open: number
  high: number
  low: number
  close: number
  volume?: number
  hlc3?: number
  rsi?: number
  emaOnRsi?: number
  mrcCenter?: number
  mrcUpper?: number
  mrcLower?: number
}

export interface TechnicalIndicatorSummary {
  rsi: number
  emaOnRsi: number
  rsiStatus: 'oversold' | 'neutral' | 'overbought'
}

export interface TechnicalPriceChartPayload {
  source: 'massive' | 'mock'
  ticker: string
  reportId: string
  defaultTimeframe: TechnicalChartTimeframe
  availableTimeframes: TechnicalChartTimeframe[]
  seriesByTimeframe: Partial<
    Record<TechnicalChartTimeframe, TechnicalChartSeries>
  >
  indicators: TechnicalIndicatorSummary
  points?: LegacyTechnicalPricePoint[]
  latest?: TechnicalIndicatorSummary
}

export interface LegacyTechnicalPricePoint extends Omit<
  TechnicalPricePoint,
  'timestampUtc' | 'exchangeTimestamp'
> {
  timestampUtc?: string
  exchangeTimestamp?: string
  date?: string
}

export interface LegacyTechnicalPriceChartPayload {
  source: string
  ticker: string
  reportId: string
  points: LegacyTechnicalPricePoint[]
  latest: TechnicalIndicatorSummary
}

export interface TechnicalSnapshotResponse {
  ticker: string
  reportId: string
  status: TechnicalSnapshotStatus
  source?: string
  provider?: string
  updatedAtMs: number
  localeHasFallback?: boolean
  error?: string
  snapshot?: TechnicalPriceChartPayload | LegacyTechnicalPriceChartPayload
}

export interface HistoricalReportSummary {
  reportId: string
  publishedAtMs: number
  provenance: HistoricalReportProvenance
  valuationStatus: ValuationStatus
  thesisStatus: ThesisStatus
  technicalEntryStatus: TechnicalEntryStatus
  currentPrice: number
  bearFairValue: number
  baseFairValue: number
  bullFairValue: number
  summary: LocalizedText
  localeHasFallback: boolean
  latest?: boolean
}

export interface HistoricalReportDetail extends HistoricalReportSummary {
  currentPriceImpliesBrief: LocalizedText
  currentPriceImplies: LocalizedText
  changeSummary: LocalizedText
  monitorNext: LocalizedText[]
}

export type HistoricalReport = HistoricalReportDetail

export interface StockSummary {
  id: string
  ticker: string
  companyName: string
  businessType: LocalizedText
  currentPrice: number
  valuationStatus: ValuationStatus
  newsImpactStatus: NewsImpactStatus
  thesisStatus: ThesisStatus
  technicalEntryStatus: TechnicalEntryStatus
  actionState: ActionState
  dashboardBucket: DashboardBucket
  baseFairValue: number
  bearFairValue: number
  bullFairValue: number
  discountToBase: number
  summary: LocalizedText
  lastUpdated: string
}

export interface StockDetail extends StockSummary {
  thesisStatement: LocalizedText
  thesisBullets: LocalizedText[]
  variantPerception: LocalizedText
  valuationLens: ValuationLens
  currentValuationSnapshot: CurrentValuationSnapshot
  newsToModel: NewsToModelItem[]
  scenarios: Scenario[]
  currentPriceImplies: LocalizedText
  currentPriceImpliesBrief?: LocalizedText
  currentPriceImpliedFacts?: FactItem[]
  provisionalConclusion?: LocalizedText
  technicalCommentary?: LocalizedText
  technicalSignals?: FactItem[]
  technicalPriceChart?: TechnicalPriceChart | LegacyTechnicalPriceChart
  risks: LocalizedText[]
  catalysts: LocalizedText[]
  monitorNext: LocalizedText[]
  sourcesUsed: Array<string | SourceReference>
  history: LocalizedText[]
  historicalReports?: HistoricalReportSummary[]
  historicalReportDetails?: Record<string, HistoricalReportDetail>
}
