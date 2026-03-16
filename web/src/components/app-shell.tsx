import { Link, Outlet } from '@tanstack/react-router'

export function AppShell() {
  return (
    <div className="grid-shell min-h-screen text-[var(--ink-primary)]">
      <header className="sticky top-0 z-30 border-b border-[var(--line-subtle)] bg-[color:rgba(9,9,10,0.85)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-[92rem] items-center justify-between gap-6 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="rounded-full border border-[var(--line-subtle)] bg-[var(--surface-chip)] px-3 py-1 font-mono text-xs text-[var(--ink-secondary)]">
              <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-[var(--signal-positive)]" />
              ready
            </div>
            <div>
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                ~/ deepvalue-lab
              </p>
              <h1 className="font-serif text-2xl tracking-tight">
                research.app
              </h1>
            </div>
          </div>

          <nav className="flex items-center gap-3 text-sm font-medium text-[var(--ink-secondary)]">
            <Link
              to="/"
              className="rounded-full border border-[var(--line-subtle)] bg-[var(--surface-chip)] px-4 py-2 font-mono transition hover:border-[var(--line-strong)] hover:text-[var(--ink-primary)]"
              activeProps={{
                className:
                  'rounded-full border border-[color:rgba(211,155,123,0.26)] bg-[color:rgba(211,155,123,0.08)] px-4 py-2 font-mono text-[var(--ink-primary)]',
              }}
            >
              $ open dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[92rem] flex-col gap-8 px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
