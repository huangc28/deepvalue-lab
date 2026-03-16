import { Link, Outlet } from '@tanstack/react-router'

export function AppShell() {
  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] text-[var(--ink-primary)]">
      <header className="border-b border-[var(--line-subtle)] bg-[color:var(--surface-elevated)]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">
              DeepValue Lab
            </p>
            <h1 className="font-serif text-2xl tracking-tight">
              Frontend Mockup Workspace
            </h1>
          </div>

          <nav className="flex items-center gap-3 text-sm font-medium text-[var(--ink-secondary)]">
            <Link
              to="/"
              className="rounded-full border border-[var(--line-subtle)] px-4 py-2 transition hover:border-[var(--line-strong)] hover:text-[var(--ink-primary)]"
              activeProps={{
                className:
                  'rounded-full border border-[var(--line-strong)] bg-[var(--surface-muted)] px-4 py-2 text-[var(--ink-primary)]',
              }}
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
