import { useState } from 'react'

import { useI18n } from '../../i18n/context'
import { cx } from '../../lib/cx'
import type {
  TechnicalChartPoint,
  TechnicalChartTimeframe,
  TechnicalEntryStatus,
  TechnicalPriceChart,
} from '../../types/stocks'

const CHART_WIDTH = 980
const PRICE_CHART_HEIGHT = 260
const RSI_PANE_PX = 88
const PANE_GAP = 8
const RSI_LOWER_THRESHOLD = 45
const RSI_MIDPOINT = 55
const RSI_UPPER_THRESHOLD = 65
const PLOT = {
  top: 14,
  right: 74,
  bottom: 22,
  left: 10,
}

export function TechnicalPriceChart({
  chart,
  ticker,
  companyName,
  entryStatus,
}: {
  chart: TechnicalPriceChart
  ticker: string
  companyName: string
  entryStatus: TechnicalEntryStatus
}) {
  const { locale, m } = useI18n()
  const [selectedTimeframe, setSelectedTimeframe] = useState<TechnicalChartTimeframe>(
    chart.defaultTimeframe,
  )
  const availableTimeframes = chart.availableTimeframes.filter(
    (timeframe) => chart.seriesByTimeframe[timeframe],
  )
  const activeTimeframe = availableTimeframes.includes(selectedTimeframe)
    ? selectedTimeframe
    : chart.defaultTimeframe
  const activeSeries =
    chart.seriesByTimeframe[activeTimeframe] ??
    chart.seriesByTimeframe[chart.defaultTimeframe] ??
    availableTimeframes
      .map((timeframe) => chart.seriesByTimeframe[timeframe])
      .find(Boolean)

  if (!activeSeries || activeSeries.points.length === 0) return null

  const showRsiPane =
    activeSeries.timeframe === '1D' &&
    activeSeries.points.some((point) => point.rsi !== undefined || point.emaOnRsi !== undefined)
  const closes = activeSeries.points.map((point) => point.close)
  const highs = activeSeries.points.map((point) => point.high)
  const lows = activeSeries.points.map((point) => point.low)
  const periodHigh = Math.max(...highs)
  const periodLow = Math.min(...lows)
  const lastPrice = closes[closes.length - 1] ?? 0
  const startPrice = activeSeries.points[0]?.open ?? lastPrice
  const periodMove = ((lastPrice - startPrice) / startPrice) * 100
  const priceChartBottom = PRICE_CHART_HEIGHT - PLOT.bottom
  const chartRight = CHART_WIDTH - PLOT.right
  const yMin = periodLow * 0.94
  const yMax = periodHigh * 1.06
  const candles = activeSeries.points
  const yTicks = buildYTicks(yMin, yMax)
  const xLabels = getXAxisLabels(
    activeSeries.points,
    locale,
    activeSeries.timeframe,
    activeSeries.timezone,
  )
  const accent = getAccent(entryStatus, periodMove)
  const plotWidth = chartRight - PLOT.left
  const candleSlot = plotWidth / Math.max(candles.length, 1)
  const candleWidth = clamp(candleSlot * 0.28, 1.5, 4)
  const currentY = mapPriceToY(lastPrice, yMin, yMax, priceChartBottom)
  const latestPoint = activeSeries.points[activeSeries.points.length - 1]

  // RSI pane layout: price ~72%, RSI ~28% of total plot area
  const totalSvgHeight = showRsiPane ? PRICE_CHART_HEIGHT + PANE_GAP + RSI_PANE_PX : PRICE_CHART_HEIGHT
  const rsiPaneTop = showRsiPane ? priceChartBottom + PANE_GAP : 0
  const rsiPaneBottom = showRsiPane ? totalSvgHeight - PLOT.bottom : 0
  const guideBottom = showRsiPane ? rsiPaneBottom : priceChartBottom
  const rsiSegments = showRsiPane
    ? buildIndicatorSegments(activeSeries.points, (point) => point.rsi, chartRight, rsiPaneTop, rsiPaneBottom)
    : []
  const emaOnRsiSegments = showRsiPane
    ? buildIndicatorSegments(activeSeries.points, (point) => point.emaOnRsi, chartRight, rsiPaneTop, rsiPaneBottom)
    : []

  return (
    <div className="overflow-hidden rounded-[1.15rem] border border-[rgba(94,110,138,0.26)] bg-[#0d0f18] shadow-[0_14px_34px_rgba(0,0,0,0.28)]">
      <div className="border-b border-[rgba(240,246,252,0.06)] px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="h-9 w-1.5 rounded-full"
              style={{ background: accent.solid }}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                <span>[{formatHeaderDate(latestPoint, locale, activeSeries.timezone)}]</span>
                {chart.source === 'mock' ? (
                  <span className="rounded-md border border-[rgba(88,166,255,0.18)] bg-[rgba(88,166,255,0.08)] px-2 py-1 text-[var(--accent-copper)]">
                    {m.detail.technicalChartSourceMock}
                  </span>
                ) : null}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <h4 className="font-mono text-[1.55rem] font-semibold tracking-[-0.05em] text-[var(--ink-primary)]">
                  {ticker}
                </h4>
                <span className="truncate text-[0.75rem] uppercase tracking-[0.08em] text-[var(--ink-faint)]">
                  {companyName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {availableTimeframes.map((timeframe) => (
              <button
                key={timeframe}
                type="button"
                onClick={() => setSelectedTimeframe(timeframe)}
                aria-pressed={timeframe === activeSeries.timeframe}
                className={cx(
                  'rounded-md border px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] transition',
                  timeframe === activeSeries.timeframe
                    ? 'border-[rgba(88,166,255,0.36)] bg-[rgba(88,166,255,0.14)] text-[var(--ink-primary)]'
                    : 'border-[rgba(240,246,252,0.07)] bg-[rgba(240,246,252,0.02)] text-[var(--ink-faint)] hover:border-[rgba(240,246,252,0.14)] hover:text-[var(--ink-primary)]',
                )}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[rgba(240,246,252,0.05)] pt-3 font-mono text-[0.68rem] tracking-[0.08em] text-[var(--ink-muted)]">
          <InlineMetric label={m.detail.technicalChartCurrent} value={formatCurrency(lastPrice)} />
          <InlineMetric
            label={m.detail.technicalChartChange}
            value={`${periodMove > 0 ? '+' : ''}${periodMove.toFixed(1)}%`}
            tone={periodMove >= 0 ? 'positive' : 'negative'}
          />
          <InlineMetric label={m.detail.technicalChartHigh} value={formatCurrency(periodHigh)} />
          <InlineMetric label={m.detail.technicalChartLow} value={formatCurrency(periodLow)} />
        </div>

      </div>

      <div className="relative px-3 pb-4 pt-3">
        <div className="absolute inset-x-3 top-3 h-12 rounded-t-[0.9rem] bg-[linear-gradient(180deg,rgba(88,166,255,0.06),transparent)]" />
        <div className="overflow-hidden rounded-[0.95rem] border border-[rgba(240,246,252,0.05)] bg-[#0a0c12]">
          <svg viewBox={`0 0 ${CHART_WIDTH} ${totalSvgHeight}`} className="block w-full">
            {yTicks.map((tick) => (
              <g key={`y-${tick.value}`}>
                <line
                  x1={PLOT.left}
                  x2={chartRight}
                  y1={mapPriceToY(tick.value, yMin, yMax, priceChartBottom)}
                  y2={mapPriceToY(tick.value, yMin, yMax, priceChartBottom)}
                  stroke="rgba(240,246,252,0.08)"
                  strokeDasharray="2 6"
                />
                <text
                  x={CHART_WIDTH - 10}
                  y={mapPriceToY(tick.value, yMin, yMax, priceChartBottom) + 4}
                  textAnchor="end"
                  fill="var(--ink-faint)"
                  fontSize="12"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {formatAxisPrice(tick.value)}
                </text>
              </g>
            ))}

            {buildVerticalGuides(candles.length).map((index) => (
              <line
                key={`x-${index}`}
                x1={mapIndexToX(index, candles.length, chartRight)}
                x2={mapIndexToX(index, candles.length, chartRight)}
                y1={PLOT.top}
                y2={guideBottom}
                stroke="rgba(240,246,252,0.04)"
              />
            ))}

            <line
              x1={PLOT.left}
              x2={chartRight}
              y1={currentY}
              y2={currentY}
              stroke={accent.border}
              strokeDasharray="3 6"
            />

            {candles.map((candle, index) => {
              const x = mapIndexToX(index, candles.length, chartRight)
              const openY = mapPriceToY(candle.open, yMin, yMax, priceChartBottom)
              const closeY = mapPriceToY(candle.close, yMin, yMax, priceChartBottom)
              const highY = mapPriceToY(candle.high, yMin, yMax, priceChartBottom)
              const lowY = mapPriceToY(candle.low, yMin, yMax, priceChartBottom)
              const bodyTop = Math.min(openY, closeY)
              const bodyHeight = Math.max(Math.abs(closeY - openY), 1.8)

              return (
                <g key={`${candle.timestampUtc}-${index}`}>
                  <line
                    x1={x}
                    x2={x}
                    y1={highY}
                    y2={lowY}
                    stroke={candle.close >= candle.open ? 'rgba(101, 222, 164, 0.7)' : 'rgba(255, 109, 117, 0.7)'}
                    strokeWidth="1.2"
                  />
                  <rect
                    x={x - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    rx="1.2"
                    fill={candle.close >= candle.open ? 'rgba(101, 222, 164, 0.9)' : 'rgba(255, 109, 117, 0.88)'}
                  />
                </g>
              )
            })}

            <g>
              <rect
                x={chartRight - 8}
                y={currentY - 11}
                width="58"
                height="22"
                rx="4"
                fill={accent.solid}
              />
              <text
                x={chartRight + 21}
                y={currentY + 4}
                textAnchor="middle"
                fill="#f8fafc"
                fontSize="12"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="600"
              >
                {formatAxisPrice(lastPrice)}
              </text>
            </g>

            {showRsiPane && (
              <g>
                <rect
                  x={PLOT.left}
                  y={mapRsiToY(100, rsiPaneTop, rsiPaneBottom)}
                  width={chartRight - PLOT.left}
                  height={mapRsiToY(RSI_UPPER_THRESHOLD, rsiPaneTop, rsiPaneBottom) - mapRsiToY(100, rsiPaneTop, rsiPaneBottom)}
                  fill="rgba(101, 222, 164, 0.06)"
                />
                <rect
                  x={PLOT.left}
                  y={mapRsiToY(RSI_LOWER_THRESHOLD, rsiPaneTop, rsiPaneBottom)}
                  width={chartRight - PLOT.left}
                  height={mapRsiToY(0, rsiPaneTop, rsiPaneBottom) - mapRsiToY(RSI_LOWER_THRESHOLD, rsiPaneTop, rsiPaneBottom)}
                  fill="rgba(255, 109, 117, 0.06)"
                />
                {[RSI_UPPER_THRESHOLD, RSI_MIDPOINT, RSI_LOWER_THRESHOLD].map((level) => (
                  <line
                    key={`rsi-guide-${level}`}
                    x1={PLOT.left}
                    x2={chartRight}
                    y1={mapRsiToY(level, rsiPaneTop, rsiPaneBottom)}
                    y2={mapRsiToY(level, rsiPaneTop, rsiPaneBottom)}
                    stroke="rgba(240,246,252,0.12)"
                    strokeDasharray="4 4"
                  />
                ))}
                {[RSI_UPPER_THRESHOLD, RSI_MIDPOINT, RSI_LOWER_THRESHOLD].map((level) => (
                  <text
                    key={`rsi-lbl-${level}`}
                    x={CHART_WIDTH - 10}
                    y={mapRsiToY(level, rsiPaneTop, rsiPaneBottom) + 4}
                    textAnchor="end"
                    fill="var(--ink-faint)"
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {level}
                  </text>
                ))}
                {emaOnRsiSegments.map((segment, index) =>
                  segment.singlePoint ? (
                    <circle
                      key={`ema-point-${index}`}
                      cx={segment.points.split(',')[0]}
                      cy={segment.points.split(',')[1]}
                      r="1.5"
                      fill="rgba(101, 222, 164, 0.38)"
                    />
                  ) : (
                    <polyline
                      key={`ema-segment-${index}`}
                      points={segment.points}
                      fill="none"
                      stroke="rgba(101, 222, 164, 0.38)"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  ),
                )}
                {rsiSegments.map((segment, index) =>
                  segment.singlePoint ? (
                    <circle
                      key={`rsi-point-${index}`}
                      cx={segment.points.split(',')[0]}
                      cy={segment.points.split(',')[1]}
                      r="1.8"
                      fill="rgba(101, 222, 164, 0.85)"
                    />
                  ) : (
                    <polyline
                      key={`rsi-segment-${index}`}
                      points={segment.points}
                      fill="none"
                      stroke="rgba(101, 222, 164, 0.85)"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  ),
                )}
              </g>
            )}

            {xLabels.map((label) => (
              <text
                key={`${label.anchor}-${label.label}`}
                x={label.anchor}
                y={totalSvgHeight - 8}
                textAnchor={label.position}
                fill="var(--ink-faint)"
                fontSize="12"
                fontFamily="JetBrains Mono, monospace"
              >
                {label.label}
              </text>
            ))}

            <rect
              x={PLOT.left}
              y={PLOT.top}
              width={chartRight - PLOT.left}
              height={guideBottom - PLOT.top}
              fill="none"
              stroke="rgba(240,246,252,0.05)"
            />
          </svg>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
          <span>{m.detail.technicalChartRangeLabel}: {activeSeries.timeframe}</span>
          <span>•</span>
          <span>{m.detail.framework}</span>
        </div>
      </div>
    </div>
  )
}

function InlineMetric({
  label,
  value,
  tone = 'neutral',
}: {
  label: string
  value: string
  tone?: 'neutral' | 'positive' | 'negative'
}) {
  const toneClass =
    tone === 'positive'
      ? 'text-[var(--signal-positive-soft)]'
      : tone === 'negative'
        ? 'text-[var(--signal-danger-soft)]'
        : 'text-[var(--ink-primary)]'

  return (
    <span className="flex items-center gap-1.5">
      <span className="text-[var(--ink-faint)]">{label}</span>
      <span className={cx('font-semibold', toneClass)}>{value}</span>
    </span>
  )
}

function buildYTicks(min: number, max: number) {
  return Array.from({ length: 5 }, (_, index) => ({
    value: max - ((max - min) * index) / 4,
  }))
}

function buildVerticalGuides(length: number) {
  const lastIndex = Math.max(length - 1, 1)
  return [0.16, 0.32, 0.48, 0.64, 0.8].map((progress) =>
    Math.round(lastIndex * progress),
  )
}

function mapIndexToX(index: number, length: number, chartRight: number) {
  const denominator = Math.max(length - 1, 1)
  return PLOT.left + (index / denominator) * (chartRight - PLOT.left)
}

function mapPriceToY(price: number, min: number, max: number, chartBottom: number) {
  if (max === min) return chartBottom
  return PLOT.top + ((max - price) / (max - min)) * (chartBottom - PLOT.top)
}

function mapRsiToY(value: number, top: number, bottom: number) {
  return top + ((100 - value) / 100) * (bottom - top)
}

function buildIndicatorSegments(
  points: TechnicalChartPoint[],
  getValue: (point: TechnicalChartPoint) => number | undefined,
  chartRight: number,
  paneTop: number,
  paneBottom: number,
) {
  const segments: Array<{
    points: string
    singlePoint: boolean
  }> = []
  let currentSegment: string[] = []

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index]
    const value = getValue(point)

    if (value === undefined) {
      if (currentSegment.length > 0) {
        segments.push({
          points: currentSegment.join(' '),
          singlePoint: currentSegment.length === 1,
        })
      }
      currentSegment = []
      continue
    }

    const x = mapIndexToX(index, points.length, chartRight)
    const y = mapRsiToY(value, paneTop, paneBottom)
    currentSegment.push(`${x},${y}`)
  }

  if (currentSegment.length > 0) {
    segments.push({
      points: currentSegment.join(' '),
      singlePoint: currentSegment.length === 1,
    })
  }

  return segments
}

function getXAxisLabels(
  points: TechnicalChartPoint[],
  locale: string,
  timeframe: TechnicalChartTimeframe,
  timeZone: string,
) {
  const formatter =
    timeframe === '15M' || timeframe === '1H' || timeframe === '4H'
      ? new Intl.DateTimeFormat(locale, {
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: false,
          timeZone,
        })
      : new Intl.DateTimeFormat(locale, {
          month: 'numeric',
          day: 'numeric',
          timeZone,
        })

  const labelProgresses = getLabelProgresses(timeframe)

  return labelProgresses.map((progress, index, list) => {
    const point = points[Math.min(points.length - 1, Math.round((points.length - 1) * progress))]
    const anchor =
      index === 0
        ? PLOT.left
        : index === list.length - 1
          ? CHART_WIDTH - PLOT.right
          : PLOT.left + (progress * (CHART_WIDTH - PLOT.right - PLOT.left))

    return {
      anchor,
      label: point ? formatter.format(new Date(point.timestampUtc)) : '',
      position:
        index === 0 ? ('start' as const) : index === list.length - 1 ? ('end' as const) : ('middle' as const),
    }
  })
}

function getLabelProgresses(timeframe: TechnicalChartTimeframe) {
  if (timeframe === '15M') {
    return [0, 0.24, 0.48, 0.72, 0.88, 1]
  }

  if (timeframe === '1H') {
    return [0, 0.2, 0.4, 0.6, 0.8, 1]
  }

  if (timeframe === '4H') {
    return [0, 0.25, 0.5, 0.75, 1]
  }

  if (timeframe === '1W') {
    return [0, 0.2, 0.4, 0.6, 0.8, 1]
  }

  return [0, 0.25, 0.5, 0.75, 1]
}

function formatHeaderDate(
  point: TechnicalChartPoint | undefined,
  locale: string,
  timeZone: string,
) {
  if (!point) {
    return ''
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone,
  })
    .format(new Date(point.timestampUtc))
    .replaceAll('/', '/')
}

function getAccent(status: TechnicalEntryStatus, periodMove: number) {
  if (status === 'favorable') {
    return {
      solid: '#2ea043',
      soft: 'rgba(46,160,67,0.14)',
      border: 'rgba(126,231,135,0.38)',
      label: '#7ee787',
    }
  }

  if (status === 'stretched') {
    return {
      solid: '#da3633',
      soft: 'rgba(218,54,51,0.14)',
      border: 'rgba(255,161,152,0.34)',
      label: '#ffa198',
    }
  }

  return periodMove >= 0
    ? {
        solid: '#3b82f6',
        soft: 'rgba(59,130,246,0.14)',
        border: 'rgba(96,165,250,0.34)',
        label: '#93c5fd',
      }
    : {
        solid: '#f59e0b',
        soft: 'rgba(245,158,11,0.14)',
        border: 'rgba(245,158,11,0.28)',
        label: '#fcd34d',
      }
}

function formatCurrency(value: number) {
  return `$${value.toFixed(value >= 100 ? 1 : 2)}`
}

function formatAxisPrice(value: number) {
  return value >= 100 ? value.toFixed(2) : value.toFixed(2)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
