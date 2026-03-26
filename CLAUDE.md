# Claude Instructions

Project: `DeepValue Lab`

## Obsidian Second Brain

Use the Obsidian vault for long-term project context before non-trivial work.

Vault project path: `~/Documents/markdowns/projects/value-deck/`

Rules:
- Read vault context for background; read the local repo for current implementation truth.
- If vault context and repo disagree, trust the repo.
- After non-trivial validated work, update the relevant vault file with new decisions or architectural changes.
- Do not store secrets, credentials, or tokens in the vault.

## Stock Research Persistence

Two-layer model:
- **Vault (`context.md`):** reusable frameworks, distilled reasoning, concise company summaries, validated lessons.
- **Repo archive:** full time-stamped reports, point-in-time prices, detailed news interpretation, bear/base/bull outputs.

Paths:
- Archive root: `research/archive/`
- Report template: `research/templates/stock-analysis-report-template.md`

When a stock analysis is substantial:
1. Save the full report under `research/archive/YYYY/MM/DD/<ticker>-analysis.md`.
2. Save only durable reasoning and reusable takeaways to vault `context.md` under "Valuation Frameworks & Lessons Learned".

## DeepValue Analysis Constraints

- Valuation first, technicals second.
- News only matters when translated into model impact.
- A strong company is not automatically a cheap stock.
- Bear/base/bull must be auditable from assumptions.
- `What The Current Price Implies` is a core reasoning layer, not a side note.
- Technical entry is an execution filter, not proof of intrinsic value.

## Skills

Claude skill files live under `.claude/skills/`. Codex skill files live under `.agents/skills/`. Keep the Claude and Codex versions aligned when a workflow is shared.

- **Stock analysis:** `.claude/skills/deepvalue-stock-analysis/SKILL.md`

Rules:
- If the skill and current repository disagree, the repository wins.

## UI / UX Guardrails

Do:
- Optimize for decision usefulness.
- Show judgment before raw data.
- Preserve auditability.

Do not:
- Turn the product into a broker UI.
- Turn the UI into terminal cosplay.
- Make charts or technicals visually dominate valuation logic.

## Internationalization

Keep internal enums stable in English and localize only at render time.

## Coding Conventions & Project Structure

Before writing any code, read `CONVENTIONS.md` in the repo root.

It covers folder structure, Go backend patterns, React frontend patterns, shared conventions, and the validation checklist to run before marking any task done.

## Practical Notes

```bash
# Frontend
cd web && pnpm install && pnpm dev
pnpm lint && pnpm build   # validate after changes

# Backend
cd be && go build ./... && go test ./...
```

After non-trivial changes: validate, then update the relevant vault file.
