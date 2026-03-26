import type { LocalizedText } from '../i18n/types'

export type ValuationStatus = 'cheap' | 'fair' | 'rich'
export type NewsImpactStatus = 'improving' | 'unchanged' | 'deteriorating'
export type ThesisStatus = 'intact' | 'watch' | 'broken'
export type TechnicalEntryStatus = 'favorable' | 'neutral' | 'stretched'
export type TechnicalChartRange = '1M' | '3M' | '6M' | '1Y'
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
  date: string
  close: number
}

export interface TechnicalChartSeries {
  range: TechnicalChartRange
  points: TechnicalChartPoint[]
}

export interface TechnicalPriceChart {
  source: 'mock' | 'live'
  series: TechnicalChartSeries[]
}

export type TechnicalSnapshotStatus = 'pending' | 'ready' | 'failed'

export interface TechnicalPricePoint {
  date: string
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
  source: string
  ticker: string
  reportId: string
  points: TechnicalPricePoint[]
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
  snapshot?: TechnicalPriceChartPayload
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
  technicalPriceChart?: TechnicalPriceChart
  risks: LocalizedText[]
  catalysts: LocalizedText[]
  monitorNext: LocalizedText[]
  sourcesUsed: Array<string | SourceReference>
  history: LocalizedText[]
  historicalReports?: HistoricalReportSummary[]
  historicalReportDetails?: Record<string, HistoricalReportDetail>
}
