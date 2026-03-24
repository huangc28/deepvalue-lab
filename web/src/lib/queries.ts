import { useQuery } from '@tanstack/react-query'

import type { Locale } from '../i18n/types'
import type {
  DashboardBucket,
  HistoricalReportDetail,
  HistoricalReportSummary,
  StockDetail,
  StockSummary,
} from '../types/stocks'
import {
  fetchStock,
  fetchStockReportDetail,
  fetchStockReports,
  fetchStocks,
} from './api'

export function useStocks(locale: Locale) {
  return useQuery({
    queryKey: ['stocks', locale],
    queryFn: () => fetchStocks(locale),
    staleTime: 5 * 60 * 1000,
  })
}

export function useStock(ticker: string, locale: Locale) {
  return useQuery({
    queryKey: ['stocks', ticker, locale],
    queryFn: () => fetchStock(ticker, locale),
    staleTime: 5 * 60 * 1000,
  })
}

export function useStockReports(ticker: string, locale: Locale, enabled = true) {
  return useQuery({
    queryKey: ['stock-reports', ticker, locale],
    queryFn: () => fetchStockReports(ticker, locale),
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}

export function useStockReportDetail(
  ticker: string,
  reportId: string | null,
  locale: Locale,
  enabled = true,
) {
  return useQuery({
    queryKey: ['stock-report-detail', ticker, reportId, locale],
    queryFn: () => fetchStockReportDetail(ticker, reportId!, locale),
    enabled: enabled && Boolean(reportId),
    staleTime: 5 * 60 * 1000,
  })
}

export function mergeHistoricalReportDetail(
  summary: HistoricalReportSummary,
  detail: StockDetail,
): HistoricalReportDetail {
  return {
    ...summary,
    currentPriceImpliesBrief:
      detail.currentPriceImpliesBrief ?? detail.currentPriceImplies,
    currentPriceImplies: detail.currentPriceImplies,
    changeSummary: detail.provisionalConclusion ?? detail.summary,
    monitorNext: detail.monitorNext,
  }
}

export function computeDashboardCounts(stocks: StockSummary[]) {
  return stocks.reduce<Record<DashboardBucket, number>>(
    (counts, stock) => {
      counts[stock.dashboardBucket] += 1
      return counts
    },
    {
      'now-actionable': 0,
      'needs-review': 0,
      'at-risk': 0,
    },
  )
}
