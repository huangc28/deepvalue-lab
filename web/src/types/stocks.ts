export type ValuationStatus = 'cheap' | 'fair' | 'rich'
export type NewsImpactStatus = 'improving' | 'unchanged' | 'deteriorating'
export type ThesisStatus = 'intact' | 'watch' | 'broken'
export type TechnicalEntryStatus = 'favorable' | 'neutral' | 'stretched'
export type DashboardBucket = 'now-actionable' | 'needs-review' | 'at-risk'
export type ActionState =
  | 'strong accumulation'
  | 'watch for confirmation'
  | 'fairly valued'
  | 'trim zone'
  | 'thesis at risk'
  | 'needs review'

export interface ValuationLens {
  primary: string
  crossCheck: string
  rationale: string
}

export interface CurrentValuationSnapshot {
  marketCap?: string
  enterpriseValue?: string
  multiples: string[]
  balanceSheetNote?: string
}

export interface NewsToModelItem {
  event: string
  modelVariableChanged: string
  impact: string
  affectedScenario: string
}

export interface Scenario {
  label: 'Bear' | 'Base' | 'Bull'
  operatingAssumption: string
  valuationAssumption: string
  fairValue: string
  whatMustBeTrue: string
}

export interface FactItem {
  label: string
  value: string
}

export interface SourceReference {
  label: string
  url?: string
}

export interface StockSummary {
  id: string
  ticker: string
  companyName: string
  businessType: string
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
  summary: string
  lastUpdated: string
}

export interface StockDetail extends StockSummary {
  thesisStatement: string
  thesisBullets: string[]
  variantPerception: string
  valuationLens: ValuationLens
  currentValuationSnapshot: CurrentValuationSnapshot
  newsToModel: NewsToModelItem[]
  scenarios: Scenario[]
  currentPriceImplies: string
  currentPriceImpliedFacts?: FactItem[]
  provisionalConclusion?: string
  technicalCommentary?: string
  technicalSignals?: FactItem[]
  risks: string[]
  catalysts: string[]
  monitorNext: string[]
  sourcesUsed: Array<string | SourceReference>
  history: string[]
}
