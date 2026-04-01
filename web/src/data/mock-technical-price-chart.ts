import type {
  StockDetail,
  TechnicalChartPoint,
  TechnicalPriceChart,
} from '../types/stocks'

const DAILY_VISIBLE_POINTS = 220
const DAILY_HISTORY_POINTS = 756
const INTRADAY_POINTS = 960
const INTRADAY_BARS_PER_SESSION = 26
const WEEKLY_VISIBLE_POINTS = 84
const MOCK_RSI_PERIOD = 22
const MOCK_EMA_ON_RSI_PERIOD = 12

export function buildMockTechnicalPriceChart(
  stock: StockDetail,
): TechnicalPriceChart {
  const seed = hashTicker(stock.ticker)
  const dailyPoints = buildSeries(stock, DAILY_HISTORY_POINTS, seed + DAILY_HISTORY_POINTS)
  const intradayPoints = buildIntradaySeries(
    stock,
    INTRADAY_POINTS,
    seed + INTRADAY_POINTS,
  )
  const weeklyPoints = aggregateWeeklySeries(dailyPoints)
  const hourlyPoints = aggregateSessionSeries(intradayPoints, 60)
  const fourHourPoints = aggregateSessionSeries(intradayPoints, 240)

  return {
    source: 'mock',
    defaultTimeframe: '1D',
    availableTimeframes: ['15M', '1H', '4H', '1D', '1W'],
    seriesByTimeframe: {
      '15M': {
        timeframe: '15M',
        timezone: 'America/New_York',
        sessionMode: 'market-hours',
        lookbackLabel: '15M',
        points: intradayPoints.slice(-INTRADAY_POINTS),
      },
      '1H': {
        timeframe: '1H',
        timezone: 'America/New_York',
        sessionMode: 'market-hours',
        lookbackLabel: '1H',
        points: hourlyPoints,
      },
      '4H': {
        timeframe: '4H',
        timezone: 'America/New_York',
        sessionMode: 'market-hours',
        lookbackLabel: '4H',
        points: fourHourPoints,
      },
      '1D': {
        timeframe: '1D',
        timezone: 'America/New_York',
        sessionMode: 'market-hours',
        lookbackLabel: '1D',
        points: dailyPoints.slice(-DAILY_VISIBLE_POINTS),
      },
      '1W': {
        timeframe: '1W',
        timezone: 'America/New_York',
        sessionMode: 'market-hours',
        lookbackLabel: '1W',
        points: weeklyPoints.slice(-WEEKLY_VISIBLE_POINTS),
      },
    },
  }
}

function buildIntradaySeries(stock: StockDetail, points: number, seed: number): TechnicalChartPoint[] {
  const random = createPrng(seed)
  const sessionDays = Math.ceil(points / INTRADAY_BARS_PER_SESSION)
  const dates = buildDates(sessionDays)
  const endPrice = stock.currentPrice
  const startPrice = getStartPrice(stock, sessionDays, random)
  const amplitudeBase = endPrice * (0.012 + random() * 0.006)
  const closes: number[] = []

  for (let index = 0; index < points; index += 1) {
    const progress = index / (points - 1)
    const trend = lerp(startPrice, endPrice, progress)
    const wave =
      Math.sin(progress * Math.PI * 3.2 + random() * 0.7) * amplitudeBase +
      Math.sin(progress * Math.PI * 8.5 + seed * 0.014) * amplitudeBase * 0.22
    const noise = (random() - 0.5) * amplitudeBase * 0.15
    closes.push(Math.max(1, trend + wave + noise))
  }

  const smoothed = smoothSeries(closes)
  const anchored = smoothed.map((close, index) =>
    index === smoothed.length - 1 ? endPrice : close,
  )

  const pointsOut: TechnicalChartPoint[] = []
  let globalIndex = 0

  for (let dayIndex = 0; dayIndex < dates.length && globalIndex < points; dayIndex += 1) {
    const date = dates[dayIndex]
    for (let slot = 0; slot < INTRADAY_BARS_PER_SESSION && globalIndex < points; slot += 1) {
      const close = roundPrice(anchored[globalIndex])
      const previousClose = roundPrice(anchored[Math.max(globalIndex - 1, 0)] ?? close)
      const gap = (random() - 0.5) * close * 0.0025
      const open =
        roundPrice(
          globalIndex === 0
            ? close * (1 - 0.0015)
            : previousClose + gap,
        )
      const intradayRange = Math.max(
        Math.abs(close - open) * 1.15,
        close * (0.0015 + random() * 0.0015),
      )
      const high = roundPrice(Math.max(open, close) + intradayRange * (0.35 + random() * 0.35))
      const low = roundPrice(Math.max(0.01, Math.min(open, close) - intradayRange * (0.35 + random() * 0.35)))
      const timestamp = buildIntradayTimestamp(date, slot)

      pointsOut.push({
        timestampUtc: timestamp.timestampUtc,
        exchangeTimestamp: timestamp.exchangeTimestamp,
        open,
        high,
        low,
        close,
      })

      globalIndex += 1
    }
  }

  return pointsOut
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
  const roundedCloses = anchored.map((close) => roundPrice(close))
  const rsiSeries = calculateRsi(roundedCloses, MOCK_RSI_PERIOD)
  const emaOnRsiSeries = calculateEma(rsiSeries, MOCK_EMA_ON_RSI_PERIOD)

  return dates.map((date, index) => {
    const close = roundedCloses[index] ?? roundPrice(anchored[index])
    const previousClose = roundedCloses[Math.max(index - 1, 0)] ?? close
    const overnightGap = (random() - 0.5) * close * 0.012
    const open = roundPrice(index === 0 ? close * (1 - 0.004) : previousClose + overnightGap)
    const intradayRange = Math.max(Math.abs(close - open) * 1.35, close * (0.008 + random() * 0.01))
    const high = roundPrice(Math.max(open, close) + intradayRange * (0.35 + random() * 0.45))
    const low = roundPrice(Math.max(0.01, Math.min(open, close) - intradayRange * (0.35 + random() * 0.45)))

    return {
      timestampUtc: `${date}T20:00:00Z`,
      exchangeTimestamp: `${date}T16:00:00-04:00`,
      open,
      high,
      low,
      close,
      rsi: rsiSeries[index],
      emaOnRsi: emaOnRsiSeries[index],
    }
  })
}

function aggregateSessionSeries(points: TechnicalChartPoint[], windowMinutes: number): TechnicalChartPoint[] {
  if (points.length === 0) {
    return []
  }

  const aggregated: TechnicalChartPoint[] = []
  let currentBucket = ''
  let currentPoint: TechnicalChartPoint | null = null

  for (const point of points) {
    const barTime = new Date(point.timestampUtc)
    const bucketStart = getSessionBucketStart(barTime, windowMinutes)
    const bucketKey = bucketStart.toISOString()

    if (bucketKey !== currentBucket || !currentPoint) {
      if (currentPoint) {
        aggregated.push(currentPoint)
      }

      currentBucket = bucketKey
      currentPoint = {
        ...point,
        timestampUtc: bucketStart.toISOString(),
        exchangeTimestamp: formatMockExchangeTimestamp(bucketStart),
      }
      continue
    }

    currentPoint = {
      ...currentPoint,
      high: Math.max(currentPoint.high, point.high),
      low: Math.min(currentPoint.low, point.low),
      close: point.close,
    }
  }

  if (currentPoint) {
    aggregated.push(currentPoint)
  }

  return aggregated
}

function aggregateWeeklySeries(points: TechnicalChartPoint[]): TechnicalChartPoint[] {
  if (points.length === 0) {
    return []
  }

  const weekly: TechnicalChartPoint[] = []
  let currentWeekKey = ''
  let currentPoint: TechnicalChartPoint | null = null

  for (const point of points) {
    const weekKey = getIsoWeekKey(point.timestampUtc.slice(0, 10))
    if (weekKey !== currentWeekKey || !currentPoint) {
      if (currentPoint) {
        weekly.push(currentPoint)
      }

      currentWeekKey = weekKey
      currentPoint = {
        ...point,
      }
      continue
    }

    currentPoint = {
      ...currentPoint,
      high: Math.max(currentPoint.high, point.high),
      low: Math.min(currentPoint.low, point.low),
      close: point.close,
      volume:
        currentPoint.volume !== undefined || point.volume !== undefined
          ? (currentPoint.volume ?? 0) + (point.volume ?? 0)
          : undefined,
      exchangeTimestamp: point.exchangeTimestamp,
      timestampUtc: point.timestampUtc,
    }
  }

  if (currentPoint) {
    weekly.push(currentPoint)
  }

  return weekly
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

  while (dates.length < points) {
    if (lastDate.getUTCDay() !== 0 && lastDate.getUTCDay() !== 6) {
      dates.push(lastDate.toISOString().slice(0, 10))
    }
    lastDate.setUTCDate(lastDate.getUTCDate() - 1)
  }

  return dates.reverse()
}

function buildIntradayTimestamp(date: string, slot: number) {
  const [year, month, day] = date.split('-').map((value) => Number(value))
  const timestamp = new Date(Date.UTC(year, month - 1, day, 13, 30, 0, 0))
  timestamp.setUTCMinutes(timestamp.getUTCMinutes() + slot * 15)

  return {
    timestampUtc: timestamp.toISOString(),
    exchangeTimestamp: formatMockExchangeTimestamp(timestamp),
  }
}

function getSessionBucketStart(barTime: Date, windowMinutes: number) {
  const sessionOpen = new Date(barTime)
  sessionOpen.setUTCHours(13, 30, 0, 0)
  const elapsedMinutes = Math.max(0, Math.floor((barTime.getTime() - sessionOpen.getTime()) / 60000))
  const bucketIndex = Math.floor(elapsedMinutes / windowMinutes)
  return new Date(sessionOpen.getTime() + bucketIndex * windowMinutes * 60000)
}

function formatMockExchangeTimestamp(timestamp: Date) {
  const offsetMinutes = -4 * 60
  const local = new Date(timestamp.getTime() + offsetMinutes * 60000)
  return `${local.toISOString().slice(0, 19)}-04:00`
}

function smoothSeries(values: number[]) {
  return values.map((_, index) => {
    const left = Math.max(0, index - 2)
    const right = Math.min(values.length - 1, index + 2)
    const window = values.slice(left, right + 1)
    return window.reduce((sum, value) => sum + value, 0) / window.length
  })
}

function calculateRsi(values: number[], period: number) {
  const out = new Array<number | undefined>(values.length).fill(undefined)

  if (period <= 0 || values.length <= period) {
    return out
  }

  let sumGain = 0
  let sumLoss = 0
  for (let index = 1; index <= period; index += 1) {
    const change = values[index]! - values[index - 1]!
    if (change > 0) {
      sumGain += change
    } else {
      sumLoss -= change
    }
  }

  let averageGain = sumGain / period
  let averageLoss = sumLoss / period
  out[period] = averageLoss === 0 ? 100 : roundIndicator(100 - (100 / (1 + (averageGain / averageLoss))))

  for (let index = period + 1; index < values.length; index += 1) {
    const change = values[index]! - values[index - 1]!
    const gain = change > 0 ? change : 0
    const loss = change < 0 ? -change : 0

    averageGain = ((averageGain * (period - 1)) + gain) / period
    averageLoss = ((averageLoss * (period - 1)) + loss) / period
    out[index] =
      averageLoss === 0 ? 100 : roundIndicator(100 - (100 / (1 + (averageGain / averageLoss))))
  }

  return out
}

function calculateEma(values: Array<number | undefined>, period: number) {
  const out = new Array<number | undefined>(values.length).fill(undefined)
  const validIndices = values
    .map((value, index) => (value === undefined ? -1 : index))
    .filter((index) => index >= 0)

  if (period <= 0 || validIndices.length < period) {
    return out
  }

  const seedIndices = validIndices.slice(0, period)
  let ema =
    seedIndices.reduce((sum, index) => sum + (values[index] ?? 0), 0) / period
  const seedIndex = seedIndices[seedIndices.length - 1]!
  out[seedIndex] = roundIndicator(ema)

  const multiplier = 2 / (period + 1)
  for (const index of validIndices.slice(period)) {
    const value = values[index]
    if (value === undefined) {
      continue
    }

    ema = (value * multiplier) + (ema * (1 - multiplier))
    out[index] = roundIndicator(ema)
  }

  return out
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

function roundIndicator(value: number) {
  return Math.round(value * 100) / 100
}

function getIsoWeekKey(dateString: string) {
  const date = new Date(`${dateString}T00:00:00Z`)
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const dayNum = target.getUTCDay() || 7

  target.setUTCDate(target.getUTCDate() + 4 - dayNum)

  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1))
  const week = Math.ceil((((target.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)

  return `${target.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
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
