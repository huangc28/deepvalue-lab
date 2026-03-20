# Claude Instructions

Project: `DeepValue Lab`

## NotebookLM Second Brain

Notebook ID: `afa6678d-0ae5-4070-bd5f-7ec2365c6310`
Metadata file: `.codex/notebooklm.json`

Execution logic:
1. **Plan:** Before non-trivial work, query NotebookLM for architecture, prior decisions, and constraints.
2. **Build:** Use the repository as the source of truth. If NotebookLM and code disagree, code wins.
3. **Update:** After a validated non-trivial change, write a concise durable update back to NotebookLM.

Rules:
- Do not store secrets, credentials, cookies, or tokens in NotebookLM.
- Prefer focused queries over broad prompts.
- Write back concise curated outcomes, not raw dumps.

## Stock Research Persistence

Two-layer model:
- **NotebookLM:** reusable frameworks, distilled reasoning, concise company summaries, validated lessons.
- **Repo archive:** full time-stamped reports, point-in-time prices, detailed news interpretation, bear/base/bull outputs.

Paths:
- Archive root: `research/archive/`
- Report template: `research/templates/stock-analysis-report-template.md`

When a stock analysis is substantial:
1. Save the full report under `research/archive/YYYY/MM/DD/<ticker>-analysis.md`.
2. Save only durable reasoning and reusable takeaways to NotebookLM.

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
- **NotebookLM workflow:** `.agents/skills/nlm-skill/SKILL.md`

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

## Practical Notes

```bash
# Frontend
cd web && pnpm install && pnpm dev
pnpm lint && pnpm build   # validate after changes

# Backend
cd be && go build ./... && go test ./...
```

After non-trivial changes: validate, then update NotebookLM.
