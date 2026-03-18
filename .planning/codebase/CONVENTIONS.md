# Coding Conventions

**Analysis Date:** 2026-03-19

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `CompanyCard`, `PanelChrome`, `MetricBlock`)
- Utilities: camelCase (e.g., `cx.ts`, `utils.ts`)
- Hooks: camelCase prefixed with `use` (e.g., `useI18n`)
- Type files: camelCase (e.g., `stocks.ts`, `types.ts`)
- Index files: follow directory name convention

**Functions:**
- React components: PascalCase
- Utility functions: camelCase
- Private/internal functions: camelCase with optional underscore prefix (e.g., `sortStocks`, `getNearestScenario`)
- Predicates: prefix with `is` or `has` (e.g., implicit in conditional logic)

**Variables:**
- Local state: camelCase (e.g., `filteredStocks`, `viewMode`, `bucketFilter`)
- Constants: camelCase or UPPER_SNAKE_CASE depending on scope (e.g., `STORAGE_KEY = 'deepvalue-lab.locale'`)
- Props: camelCase (e.g., `currentPrice`, `baseFairValue`)
- Boolean flags: prefix with `is`, `has`, or describe state directly (e.g., `isActive`, `className`)

**Types:**
- Interfaces: PascalCase (e.g., `I18nContextValue`, `StockSummary`, `StockDetail`)
- Type aliases: PascalCase (e.g., `ValuationStatus`, `ActionState`, `Locale`)
- Discriminated union types: all lowercase variants (e.g., `'cheap' | 'fair' | 'rich'`)
- Record/object keys: maintain matching case for consistency

## Code Style

**Formatting:**
- Tool: Prettier 3.8.1
- Config: `.prettierrc.json` at web root
- Settings:
  - `semi: false` — No semicolons at end of statements
  - `singleQuote: true` — Single quotes for strings
  - `trailingComma: 'all'` — Trailing commas in multiline structures
  - Line width: default (80 characters, but not strictly enforced)

**Linting:**
- Tool: ESLint 9.39.4 (flat config)
- Config: `eslint.config.js` at web root
- Extends: `@eslint/js`, `typescript-eslint`, `react-hooks`, `react-refresh`
- Rules: flat config with TypeScript + React recommended rules

## Import Organization

**Order:**
1. React/external library imports (e.g., `import { Link } from '@tanstack/react-router'`)
2. Type imports from external libraries (e.g., `import type { ComponentPropsWithoutRef, ReactNode } from 'react'`)
3. Internal utility imports (e.g., `import { cx } from '../../lib/cx'`)
4. Context/provider imports (e.g., `import { useI18n } from '../../i18n/context'`)
5. Type imports from internal modules (e.g., `import type { StockSummary } from '../../types/stocks'`)
6. Component imports (e.g., `import { CompanyCard } from '../dashboard/company-card'`)

**Path Aliases:**
- No path aliases configured; relative imports use `../../` navigation
- Example: `import { useI18n } from '../../i18n/context'`

## Error Handling

**Patterns:**
- Use thrown errors for contract violations and hooks called outside context
- Example: `throw new Error('useI18n must be used inside I18nProvider')`
- No try-catch blocks in current codebase; errors are handled at router/app level
- Optional values return `null` for conditional rendering: `if (!value) return null`
- Safe fallback resolution: `value[locale] ?? value.en` (use nullish coalescing for i18n)

## Logging

**Framework:** Console methods only; no external logging library

**Patterns:**
- Not enforced in current codebase; debug logging not present
- When needed: use `console.log()`, `console.warn()`, `console.error()` with descriptive messages
- Filter sensitive data before logging

## Comments

**When to Comment:**
- Explain business logic intent, not implementation details
- Document why a choice was made (not what the code does)
- Use before complex algorithms or non-obvious logic (e.g., `toRailPosition` calculation)

**JSDoc/TSDoc:**
- Not used in current codebase
- Function signatures are self-documenting via TypeScript types
- Add JSDoc only for public API functions with complex behavior

## Function Design

**Size:**
- Keep functions under 30-40 lines for readability
- Extract helper functions for rendering logic (e.g., `MetricColumn`, `Badge`, `Marker` as separate components)
- Page components may be longer due to state management and layout complexity

**Parameters:**
- Use destructured object patterns for multiple parameters
- Example: `function CompanyCard({ stock }: { stock: StockSummary })`
- Type destructured props inline with TypeScript

**Return Values:**
- Components return JSX elements or React fragments
- Utility functions return typed values with clear semantics (e.g., `boolean`, `number`, `string`)
- Guard clauses return early to reduce nesting

## Module Design

**Exports:**
- Named exports for components and utilities
- Example: `export function CompanyCard(...) { ... }`
- Type-only exports: `export type ValuationStatus = 'cheap' | 'fair' | 'rich'`
- Use `export type` for TypeScript types to allow tree-shaking

**Barrel Files:**
- No barrel files (index.ts re-exports) in current structure
- Import directly from component files
- If adding barrel files, maintain consistency across all directories

## Component Patterns

**Props Pattern:**
- Always type-check component props with TypeScript interfaces or inline types
- Use generic type helpers: `ComponentPropsWithoutRef<'section'>` for HTML attributes
- Example:
```typescript
export function Panel({
  className,
  ...props
}: ComponentPropsWithoutRef<'section'>) {
  return <section className={cx(...className)} {...props} />
}
```

**Conditional Rendering:**
- Use ternary for simple boolean renders: `{value ? <Component /> : null}`
- Use guard clauses for early returns in components
- Example: `{detail ? <p>{detail}</p> : null}`

**Styling:**
- Use Tailwind CSS with CSS variables for theming
- Variable palette: `--ink-primary`, `--ink-secondary`, `--ink-muted`, `--line-subtle`, `--surface-panel`, etc.
- No className string concatenation; use `cx()` utility for conditional classes
- Example:
```typescript
className={cx(
  'rounded-full border px-3 py-1',
  isActive ? 'bg-blue-500' : 'bg-gray-700',
)}
```

## Data Structures

**Type Safety:**
- Use discriminated union types for status states (e.g., `ValuationStatus = 'cheap' | 'fair' | 'rich'`)
- Map status values to display attributes using Record types:
```typescript
const valuationTone: Record<ValuationStatus, StatusTone> = {
  cheap: 'positive',
  fair: 'neutral',
  rich: 'risk',
}
```
- Use `satisfies` keyword for type assertion on complex objects:
```typescript
const priority = {
  'now-actionable': 0,
  'needs-review': 1,
  'at-risk': 2,
} satisfies Record<DashboardBucket, number>
```

## Internationalization (i18n)

**Pattern:**
- `LocalizedText` type: `string | Record<Locale, string>`
- Store localized content in `messages.ts` as nested objects keyed by locale
- Resolve at render time using `useI18n()` hook and `text()` function
- Example:
```typescript
const { m, text } = useI18n()
return <p>{text(stock.businessType)}</p>
```

---

*Convention analysis: 2026-03-19*
