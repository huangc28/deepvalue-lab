# Agent Instructions

## Obsidian Second Brain

This project uses the Obsidian vault as a long-term knowledge base.

Vault project path: `~/Documents/markdowns/projects/value-deck/`

Files:
- `overview.md` — project purpose, goals, and background
- `context.md` — architecture, stack, key decisions, and constraints
- `decisions/` — architecture decision records

Use the vault project dir before non-trivial work when the task involves:
- understanding project architecture or history
- prior decisions or constraints
- onboarding to an unfamiliar area
- debugging background or known gotchas

Rules:
- Read vault context for background; read the local repo for current implementation truth.
- If vault context and repo disagree, trust the repo.
- After non-trivial validated work, update the relevant vault file with new decisions or architectural changes.
- Do not store secrets, credentials, or tokens in the vault.

## Stock Research Persistence

Use a two-layer persistence model for equity analysis.

Vault stores:
- reusable valuation frameworks
- distilled reasoning patterns
- concise company summaries
- validated lessons that should influence future analyses

The repo research archive stores:
- full time-stamped reports
- point-in-time prices and assumptions
- detailed news interpretation
- bear/base/bull tables and outputs

Paths:
- Policy: `docs/research/stock-analysis-persistence.md`
- Archive root: `research/archive/`
- Report template: `research/templates/stock-analysis-report-template.md`

When a stock analysis is substantial:
1. Save the full report in the research archive.
2. Save only the distilled reasoning and durable takeaways to `context.md` under "Valuation Frameworks & Lessons Learned".
3. Do not dump every full report verbatim into the vault.

## Coding Conventions & Project Structure

Before writing any code, read `CONVENTIONS.md` in the repo root.

It covers folder structure, Go backend patterns, React frontend patterns, shared conventions, and the validation checklist to run before marking any task done.
