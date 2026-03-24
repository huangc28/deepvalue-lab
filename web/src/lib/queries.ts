import { useQuery } from '@tanstack/react-query'

import type { Locale } from '../i18n/types'
import type { DashboardBucket, StockSummary } from '../types/stocks'
import { fetchStock, fetchStocks } from './api'

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
