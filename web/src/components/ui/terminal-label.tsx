export function TerminalLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-[var(--accent-copper)]">
      {children}
    </p>
  )
}
