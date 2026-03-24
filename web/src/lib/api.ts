import type {
  HistoricalReportSummary,
  StockDetail,
  StockSummary,
} from '../types/stocks'
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

function buildStockDetailUrl(ticker: string, locale: Locale) {
  const encodedTicker = encodeURIComponent(ticker)

  if (locale === 'zh-TW') {
    return `${API_URL}/v1/stocks/${encodedTicker}?locale=zh-TW`
  }

  return `${API_URL}/v1/stocks/${encodedTicker}`
}

function buildStockReportsUrl(ticker: string, locale: Locale) {
  const encodedTicker = encodeURIComponent(ticker)

  if (locale === 'zh-TW') {
    return `${API_URL}/v1/stocks/${encodedTicker}/reports?locale=zh-TW`
  }

  return `${API_URL}/v1/stocks/${encodedTicker}/reports`
}

function buildStockReportDetailUrl(
  ticker: string,
  reportId: string,
  locale: Locale,
) {
  const encodedTicker = encodeURIComponent(ticker)
  const encodedReportId = encodeURIComponent(reportId)

  if (locale === 'zh-TW') {
    return `${API_URL}/v1/stocks/${encodedTicker}/reports/${encodedReportId}?locale=zh-TW`
  }

  return `${API_URL}/v1/stocks/${encodedTicker}/reports/${encodedReportId}`
}

export async function fetchStocks(locale: Locale): Promise<StockSummary[]> {
  const data = await fetchJson<{ stocks: StockSummary[] }>(buildStocksUrl(locale))
  return data.stocks
}

export async function fetchStock(ticker: string, locale: Locale): Promise<StockDetail> {
  return fetchJson<StockDetail>(buildStockDetailUrl(ticker, locale))
}

export async function fetchStockReports(
  ticker: string,
  locale: Locale,
): Promise<HistoricalReportSummary[]> {
  const data = await fetchJson<{ reports: HistoricalReportSummary[] }>(
    buildStockReportsUrl(ticker, locale),
  )
  return data.reports
}

export async function fetchStockReportDetail(
  ticker: string,
  reportId: string,
  locale: Locale,
): Promise<StockDetail> {
  return fetchJson<StockDetail>(buildStockReportDetailUrl(ticker, reportId, locale))
}
