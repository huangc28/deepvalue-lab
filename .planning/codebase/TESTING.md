# Testing Patterns

**Analysis Date:** 2026-03-19

## Test Framework

**Status:** Not detected

**Current State:**
- No test files present in `/web/src/` directory
- No test framework configured (Vitest, Jest, etc.)
- No test runner in `package.json` scripts
- Build and lint pipelines are configured but testing is not implemented

**When adding tests:**
- Recommended: **Vitest** with React Testing Library for component tests
- Alternative: Jest with React Testing Library
- Install: `pnpm add -D vitest @testing-library/react @testing-library/dom`

## Recommended Test Structure

**File Organization:**
- Location: Co-located with source files
- Pattern: `ComponentName.test.tsx` or `ComponentName.spec.tsx`
- Example structure:
```
src/
├── components/
│   ├── ui/
│   │   ├── panel.tsx
│   │   └── panel.test.tsx
│   ├── dashboard/
│   │   ├── company-card.tsx
│   │   └── company-card.test.tsx
├── utils/
│   ├── helpers.ts
│   └── helpers.test.ts
```

**Configuration File:**
- Create `vitest.config.ts` at web root:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

- Add to `package.json` scripts:
```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage"
}
```

## Test Structure

**Expected Pattern for React Components:**

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { CompanyCard } from './company-card'
import type { StockSummary } from '../../types/stocks'

describe('CompanyCard', () => {
  let mockStock: StockSummary

  beforeEach(() => {
    mockStock = {
      id: 'tsm',
      ticker: 'TSM',
      companyName: 'Taiwan Semiconductor',
      // ... other required fields
    }
  })

  it('renders stock ticker and company name', () => {
    render(<CompanyCard stock={mockStock} />)
    expect(screen.getByText('TSM')).toBeInTheDocument()
    expect(screen.getByText('Taiwan Semiconductor')).toBeInTheDocument()
  })

  it('displays formatted price', () => {
    render(<CompanyCard stock={mockStock} />)
    expect(screen.getByText(/\$338\.3/)).toBeInTheDocument()
  })

  it('navigates to detail page on click', async () => {
    render(<CompanyCard stock={mockStock} />)
    const link = screen.getByRole('link')
    await userEvent.click(link)
    expect(link).toHaveAttribute('href', '/stocks/TSM')
  })
})
```

**Expected Pattern for Utility Functions:**

```typescript
import { describe, it, expect } from 'vitest'
import { resolveLocalizedText, flattenLocalizedText } from './utils'
import type { LocalizedText } from './types'

describe('i18n utilities', () => {
  describe('resolveLocalizedText', () => {
    it('returns string as-is', () => {
      const result = resolveLocalizedText('hello', 'en')
      expect(result).toBe('hello')
    })

    it('returns locale-specific value', () => {
      const value: LocalizedText = { en: 'hello', 'zh-TW': '你好' }
      expect(resolveLocalizedText(value, 'en')).toBe('hello')
      expect(resolveLocalizedText(value, 'zh-TW')).toBe('你好')
    })

    it('falls back to English if locale not found', () => {
      const value: LocalizedText = { en: 'hello', 'zh-TW': '你好' }
      expect(resolveLocalizedText(value, 'fr' as any)).toBe('hello')
    })
  })
})
```

## Patterns for Key Testing Scenarios

**Context Provider Testing:**

```typescript
import { render, screen } from '@testing-library/react'
import { useI18n } from './context'
import { I18nProvider } from './provider'

describe('I18nProvider', () => {
  function TestComponent() {
    const { locale, m } = useI18n()
    return <div>{locale}: {m.app.ready}</div>
  }

  it('provides locale context', () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    )
    expect(screen.getByText(/en: ready/)).toBeInTheDocument()
  })

  it('throws error when hook used outside provider', () => {
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useI18n must be used inside I18nProvider')
  })
})
```

**Data Transformation Testing:**

```typescript
import { describe, it, expect } from 'vitest'

describe('Stock data transformations', () => {
  describe('discount calculation', () => {
    it('calculates positive discount when price below fair value', () => {
      const discount = ((100 - 110) / 110) * 100
      expect(discount).toBeCloseTo(-9.09, 1)
    })

    it('calculates premium when price above fair value', () => {
      const premium = ((110 - 100) / 100) * 100
      expect(premium).toBe(10)
    })
  })

  describe('scenario filtering', () => {
    it('filters stocks by dashboard bucket', () => {
      const stocks = [
        { dashboardBucket: 'now-actionable', ticker: 'TSM' },
        { dashboardBucket: 'needs-review', ticker: 'NVDA' },
      ]
      const filtered = stocks.filter(s => s.dashboardBucket === 'now-actionable')
      expect(filtered).toHaveLength(1)
      expect(filtered[0].ticker).toBe('TSM')
    })
  })
})
```

## What to Test

**High Priority (First Phase):**
- Utility functions: `resolveLocalizedText`, `flattenLocalizedText`, `cx` (classname utility)
- Data transformations: sort functions, discount calculations
- Context hooks: `useI18n` contract and error handling

**Medium Priority (Second Phase):**
- UI Components:
  - Badge components (`ValuationBadge`, `StatusBadge`) — type → display mapping
  - Panel components (`Panel`, `PanelChrome`, `PanelBody`)
  - Metric display (`MetricBlock`)
- Data loading and filtering logic in dashboard-page
- I18n locale switching and persistence

**Lower Priority (Polish Phase):**
- Full page integration tests (dashboard with all filters)
- Router navigation (TanStack Router integration)
- Complex layout rendering (expectation-bridge calculations)

## What NOT to Test

- CSS class names (except critical conditional logic)
- Tailwind color values (rely on visual regression testing if needed)
- Inline event handlers that directly call setState (test the resulting behavior instead)
- Third-party library behavior (e.g., TanStack Router, React itself)

## Mocking Strategy

**Framework:** Vitest built-in mocks with `vi.mock()`

**Mock Patterns:**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock i18n context
vi.mock('../../i18n/context', () => ({
  useI18n: vi.fn(() => ({
    locale: 'en',
    m: { app: { ready: 'ready' } },
    text: (v: any) => typeof v === 'string' ? v : v.en,
  })),
}))

// Mock data
vi.mock('../../data/mock-stocks', () => ({
  mockStocks: [
    { id: 'tsm', ticker: 'TSM', companyName: 'TSMC' },
  ],
  getStockByTicker: vi.fn((ticker) =>
    ticker === 'TSM' ? { id: 'tsm', ticker: 'TSM' } : undefined
  ),
}))
```

**When to Mock:**
- Context providers that have side effects (localStorage, DOM manipulation)
- Data fetching functions (currently using mock-stocks.ts)
- Router navigation (if testing detail page in isolation)

**When NOT to Mock:**
- Pure utility functions (just call directly)
- React hooks that manage component state (test through component behavior)
- Tailwind/styling (trust it works)

## Test Fixtures

**Location:** `src/test/fixtures/` (create if adding tests)

**Pattern for Stock Data:**

```typescript
// src/test/fixtures/stocks.ts
import type { StockSummary, StockDetail } from '../../types/stocks'

export const createMockStock = (overrides?: Partial<StockSummary>): StockSummary => ({
  id: 'test-stock',
  ticker: 'TEST',
  companyName: 'Test Company',
  businessType: { en: 'Technology', 'zh-TW': '科技' },
  currentPrice: 100,
  baseFairValue: 110,
  valuationStatus: 'fair',
  thesisStatus: 'intact',
  // ... other required fields with sensible defaults
  ...overrides,
})

export const mockStockDetail: StockDetail = {
  ...createMockStock(),
  thesisStatement: { en: 'Test thesis', 'zh-TW': '測試論點' },
  // ... other detail fields
}
```

## Coverage Goals

**Not Enforced Currently**
- When adding tests, aim for:
  - Utility functions: 100% coverage
  - Components: 80%+ coverage of rendering paths
  - Pages: 70%+ coverage (complex state makes 100% difficult)

**View Coverage:**
```bash
pnpm test:coverage
# Generates coverage/ directory with HTML report
```

## Common Testing Patterns for This Codebase

**Testing Status Badge Tone Mapping:**

```typescript
describe('status badge tone mapping', () => {
  const testCases = [
    { value: 'cheap' as const, expectedTone: 'positive' },
    { value: 'fair' as const, expectedTone: 'neutral' },
    { value: 'rich' as const, expectedTone: 'risk' },
  ]

  testCases.forEach(({ value, expectedTone }) => {
    it(`maps ${value} to ${expectedTone} tone`, () => {
      render(<ValuationBadge value={value} />)
      const badge = screen.getByRole('status')
      expect(badge).toHaveClass(`tone-${expectedTone}`)
    })
  })
})
```

**Testing Localized Text Resolution:**

```typescript
describe('localized rendering', () => {
  it('renders correct locale text', () => {
    const { rerender } = render(
      <I18nProvider initialLocale="en">
        <TestComponent text={{ en: 'English', 'zh-TW': '中文' }} />
      </I18nProvider>
    )
    expect(screen.getByText('English')).toBeInTheDocument()

    rerender(
      <I18nProvider initialLocale="zh-TW">
        <TestComponent text={{ en: 'English', 'zh-TW': '中文' }} />
      </I18nProvider>
    )
    expect(screen.getByText('中文')).toBeInTheDocument()
  })
})
```

---

*Testing analysis: 2026-03-19*
