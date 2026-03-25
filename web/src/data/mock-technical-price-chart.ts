import type {
  StockDetail,
  TechnicalChartPoint,
  TechnicalChartRange,
  TechnicalPriceChart,
} from '../types/stocks'

const TIMEFRAME_POINTS: Array<[TechnicalChartRange, number]> = [
  ['1M', 22],
  ['3M', 66],
  ['6M', 132],
  ['1Y', 264],
]

export function buildMockTechnicalPriceChart(
  stock: StockDetail,
): TechnicalPriceChart {
  const seed = hashTicker(stock.ticker)

  return {
    source: 'mock',
    series: TIMEFRAME_POINTS.map(([range, points]) => ({
      range,
      points: buildSeries(stock, points, seed + points),
    })),
  }
}

function buildSeries(stock: StockDetail, points: number, seed: number): TechnicalChartPoint[] {
  const random = createPrng(seed)
  const endPrice = stock.currentPrice
  const startPrice = getStartPrice(stock, points, random)
  const amplitudeBase = endPrice * (0.035 + random() * 0.015)
  const dates = buildDates(points)
  const closes: number[] = []

  for (let index = 0; index < points; index += 1) {
    const progress = index / (points - 1)
    const trend = lerp(startPrice, endPrice, progress)
    const wave =
      Math.sin(progress * Math.PI * 2.1 + random() * 0.8) * amplitudeBase +
      Math.sin(progress * Math.PI * 6.4 + seed * 0.02) * amplitudeBase * 0.28
    const noise = (random() - 0.5) * amplitudeBase * 0.22
    const shapeBias = getShapeBias(stock, progress, amplitudeBase)
    closes.push(Math.max(1, trend + wave + noise + shapeBias))
  }

  const smoothed = smoothSeries(closes)
  const anchored = smoothed.map((close, index) =>
    index === smoothed.length - 1 ? endPrice : close,
  )

  return dates.map((date, index) => ({
    date,
    close: roundPrice(anchored[index]),
  }))
}

function getStartPrice(
  stock: StockDetail,
  points: number,
  random: () => number,
) {
  const timeScale = points / 264
  const valuationBias = clamp(stock.discountToBase / 100, -0.22, 0.22)
  const statusDrift =
    stock.technicalEntryStatus === 'stretched'
      ? -0.18
      : stock.technicalEntryStatus === 'favorable'
        ? 0.12
        : -0.03
  const valuationDrift = -valuationBias * 0.75
  const randomDrift = (random() - 0.5) * 0.08
  const drift = clamp(
    (statusDrift + valuationDrift + randomDrift) * (0.55 + timeScale * 0.7),
    -0.32,
    0.26,
  )

  return stock.currentPrice * (1 + drift)
}

function getShapeBias(stock: StockDetail, progress: number, amplitude: number) {
  if (stock.technicalEntryStatus === 'favorable') {
    const selloff = gaussian(progress, 0.72, 0.12) * -amplitude * 1.25
    const rebound = gaussian(progress, 0.92, 0.08) * amplitude * 0.5
    return selloff + rebound
  }

  if (stock.technicalEntryStatus === 'stretched') {
    const lift = Math.pow(progress, 2.4) * amplitude * 0.95
    const lateChase = gaussian(progress, 0.9, 0.09) * amplitude * 0.75
    return lift + lateChase
  }

  return (
    Math.sin(progress * Math.PI * 1.5) * amplitude * 0.12 +
    gaussian(progress, 0.58, 0.16) * amplitude * 0.25
  )
}

function buildDates(points: number) {
  const dates: string[] = []
  const lastDate = new Date(Date.UTC(2026, 2, 25))

  for (let index = points - 1; index >= 0; index -= 1) {
    const date = new Date(lastDate)
    date.setUTCDate(lastDate.getUTCDate() - index)
    dates.push(date.toISOString().slice(0, 10))
  }

  return dates
}

function smoothSeries(values: number[]) {
  return values.map((_, index) => {
    const left = Math.max(0, index - 2)
    const right = Math.min(values.length - 1, index + 2)
    const window = values.slice(left, right + 1)
    return window.reduce((sum, value) => sum + value, 0) / window.length
  })
}

function gaussian(value: number, mean: number, deviation: number) {
  const variance = deviation * deviation
  return Math.exp(-((value - mean) * (value - mean)) / (2 * variance))
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function roundPrice(value: number) {
  return Math.round(value * 100) / 100
}

function hashTicker(ticker: string) {
  let hash = 0

  for (const char of ticker) {
    hash = (hash << 5) - hash + char.charCodeAt(0)
    hash |= 0
  }

  return Math.abs(hash) + 1
}

function createPrng(seed: number) {
  let current = seed

  return () => {
    current = (current * 1664525 + 1013904223) % 4294967296
    return current / 4294967296
  }
}
