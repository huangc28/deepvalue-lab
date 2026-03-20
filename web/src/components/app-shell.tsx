import { Link, Outlet } from '@tanstack/react-router'

import { useI18n } from '../i18n/context'

export function AppShell() {
  const { locale, m, setLocale } = useI18n()

  return (
    <div className="min-h-screen text-[var(--ink-primary)]">
      <header className="sticky top-0 z-30 border-b border-[var(--line-subtle)] bg-[color:rgba(13,17,23,0.9)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-[92rem] items-center justify-between gap-4 px-4 py-3 sm:gap-6 sm:px-6 sm:py-4">
          <Link to="/" className="flex items-center gap-3 sm:gap-4">
            <img
              src="/deepvalue-lab-mark.svg"
              alt="Value Deck"
              className="h-9 w-9 sm:h-10 sm:w-10"
            />
            <h1 className="font-serif text-[1.1rem] tracking-[-0.03em] sm:text-[1.35rem]">
              Value Deck
            </h1>
          </Link>

          <nav className="flex items-center gap-2 text-sm font-medium text-[var(--ink-secondary)] sm:gap-3">
            <div className="flex items-center gap-2 rounded-full border border-[var(--line-subtle)] bg-[var(--surface-chip)] p-1 font-mono text-[0.68rem] uppercase tracking-[0.16em]">
              <span className="hidden px-2 text-[var(--ink-muted)] sm:inline">
                {m.app.language}
              </span>
              <LocaleButton
                isActive={locale === 'en'}
                onClick={() => setLocale('en')}
              >
                {m.app.localeEnglish}
              </LocaleButton>
              <LocaleButton
                isActive={locale === 'zh-TW'}
                onClick={() => setLocale('zh-TW')}
              >
                {m.app.localeTraditionalChinese}
              </LocaleButton>
            </div>
            <Link
              to="/"
              className="rounded-full border border-[var(--line-subtle)] bg-[var(--surface-chip)] px-4 py-2 font-mono transition hover:border-[var(--line-strong)] hover:text-[var(--ink-primary)]"
              activeProps={{
                className:
                  'rounded-full border border-[color:rgba(88,166,255,0.26)] bg-[color:rgba(56,139,253,0.12)] px-4 py-2 font-mono text-[var(--ink-primary)]',
              }}
            >
              {m.app.openDashboard}
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[92rem] flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  )
}

function LocaleButton({
  children,
  isActive,
  onClick,
}: {
  children: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        isActive
          ? 'rounded-full bg-[color:rgba(56,139,253,0.18)] px-3 py-1 text-[var(--ink-primary)]'
          : 'rounded-full px-3 py-1 text-[var(--ink-muted)] transition hover:text-[var(--ink-primary)]'
      }
    >
      {children}
    </button>
  )
}
