import type { StockDetail, StockSummary } from '../types/stocks'
import type { Locale } from '../i18n/types'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new ApiError(response.status, `${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<T>
}

function buildStocksUrl(locale: Locale) {
  if (locale === 'zh-TW') {
    return `${API_URL}/v1/stocks?locale=zh-TW`
  }

  return `${API_URL}/v1/stocks`
}

export async function fetchStocks(locale: Locale): Promise<StockSummary[]> {
  const data = await fetchJson<{ stocks: StockSummary[] }>(buildStocksUrl(locale))
  return data.stocks
}

export async function fetchStock(ticker: string): Promise<StockDetail> {
  return fetchJson<StockDetail>(`${API_URL}/v1/stocks/${encodeURIComponent(ticker)}`)
}
