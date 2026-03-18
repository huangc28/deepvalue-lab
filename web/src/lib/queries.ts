import { useQuery } from '@tanstack/react-query'

import type { DashboardBucket, StockSummary } from '../types/stocks'
import { fetchStock, fetchStocks } from './api'

export function useStocks() {
  return useQuery({
    queryKey: ['stocks'],
    queryFn: fetchStocks,
    staleTime: 5 * 60 * 1000,
  })
}

export function useStock(ticker: string) {
  return useQuery({
    queryKey: ['stocks', ticker],
    queryFn: () => fetchStock(ticker),
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
