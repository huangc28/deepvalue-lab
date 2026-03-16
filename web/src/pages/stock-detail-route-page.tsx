import { getRouteApi } from '@tanstack/react-router'

import { StockDetailPage } from './stock-detail-page'

const stockDetailRouteApi = getRouteApi('/stocks/$ticker')

export function StockDetailRoutePage() {
  const { ticker } = stockDetailRouteApi.useParams()
  return <StockDetailPage ticker={ticker} />
}
