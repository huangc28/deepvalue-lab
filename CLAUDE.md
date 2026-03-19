# Claude Instructions

This repository is Claude-compatible through this file.

Project:
- `DeepValue Lab`

## Claude MCP

This repo provides a checked-in Claude project MCP config at `.mcp.json`.

Current project MCP servers:
- `chrome-devtools`
- `obsidian`
- `notebooklm-mcp`

Notes:
- Claude does not read Codex MCP config from `~/.codex/config.toml`.
- Claude should use this repo's `.mcp.json` as the project-scoped MCP definition.
- These servers still depend on local prerequisites:
  - `chrome-devtools` expects Chrome remote debugging on `http://127.0.0.1:9222`
  - `obsidian` points at `/Users/huangchihan/Documents/markdowns`
  - `notebooklm-mcp` must be installed and authenticated locally

## Working Model

Use this repo as a decision-support stock research product and research archive.

Default operating sequence:
1. Query the NotebookLM second brain for stable project context.
2. Inspect the local repository to confirm the current implementation.
3. Treat the repository as the source of truth if NotebookLM and code disagree.
4. After a validated non-trivial change, write a concise update back to NotebookLM.

## NotebookLM Second Brain

Notebook metadata:
- Alias: `profound-stock`
- Notebook ID: `afa6678d-0ae5-4070-bd5f-7ec2365c6310`
- Metadata file: `.codex/notebooklm.json`

Use NotebookLM before coding when the task involves:
- architecture understanding
- prior decisions or constraints
- project onboarding
- external docs or vendor behavior
- debugging background or runbooks
- security-sensitive operational context that has already been curated

Rules:
- Do not treat NotebookLM as the source of truth for the current working tree.
- Do not store secrets, credentials, cookies, or tokens in NotebookLM.
- Prefer focused queries over broad prompts.
- Write back only concise curated outcomes, not raw dumps.

## Stock Research Persistence

Use a two-layer persistence model.

NotebookLM stores:
- reusable valuation frameworks
- distilled reasoning patterns
- concise company summaries
- validated lessons that should influence future analyses

The repo archive stores:
- full time-stamped reports
- point-in-time prices and assumptions
- detailed news interpretation
- bear / base / bull outputs

Paths:
- Policy: `docs/research/stock-analysis-persistence.md`
- Archive root: `research/archive/`
- Report template: `research/templates/stock-analysis-report-template.md`

When a stock analysis is substantial:
1. Save the full report under `research/archive/YYYY/MM/DD/<ticker>-analysis.md`.
2. Save only durable reasoning and reusable takeaways to NotebookLM.
3. Do not dump every full report verbatim into NotebookLM.

## DeepValue Analysis Rules

Preserve these method constraints:
- Valuation first, technicals second.
- News only matters when translated into model impact.
- A strong company is not automatically a cheap stock.
- Bear / base / bull must be auditable from assumptions.
- `What The Current Price Implies` is a core reasoning layer, not a side note.
- Technical entry is an execution filter, not proof of intrinsic value.

Required report logic:
1. Business Classification
2. Thesis
3. Variant Perception
4. Valuation Lens
5. Current Valuation Snapshot
6. News-To-Model
7. Bear / Base / Bull
8. What The Current Price Implies
9. Provisional Conclusion
10. Thesis Status
11. Technical Entry Status
12. What To Monitor Next
13. Sources Used

## Skills

Claude should treat the repo skill files under `.agents/skills/` as task-specific operating instructions.

When a task clearly matches one of these skills, open the referenced `SKILL.md` first and follow it in addition to this file.

Core skills for this repo:

- Stock analysis skill:
  `.agents/skills/deepvalue-stock-analysis/SKILL.md`
  Use this when the user asks to:
  - analyze a stock
  - update a company thesis
  - decide cheap / fair / rich
  - translate recent news into valuation model changes
  - judge thesis intact / watch / broken
  - evaluate technical entry timing after valuation

- NotebookLM workflow skill:
  `.agents/skills/nlm-skill/SKILL.md`
  Use this when the task is about:
  - NotebookLM or `nlm`
  - notebook management
  - source ingestion
  - research import
  - NotebookLM automation or content generation

Skill usage rules:
- Read only the skill(s) relevant to the current task.
- Use the skill as an execution guide, not as a replacement for current repo state.
- If the skill and current repository disagree, the repository wins.
- After completing a non-trivial task successfully, update NotebookLM with a concise durable writeback.

## Frontend Context

Current frontend stack:
- React
- TypeScript
- Vite
- TanStack Router
- Tailwind CSS

Current scope:
- frontend-only mockup
- no backend, auth, database, scheduler, or SSR yet
- local mock data is the current source layer for the UI

Current product direction:
- dashboard supports `Cards` and `Table`
- stock detail page is a decision-first research page
- detail page currently favors a price-first reading flow

Current single-stock reading order in the UI:
1. Hero summary
2. Scenario model
3. Pricing context
4. Entry timing
5. Provisional conclusion
6. Valuation context
7. Thesis
8. Current snapshot
9. News-To-Model
10. Thesis status
11. Risks / catalysts
12. Monitor next / sources / history

## UI / UX Direction

Visual direction:
- dark research cockpit
- Daily Dip readability over terminal gimmicks
- mono-first hierarchy with restrained panel styling

Do:
- optimize for decision usefulness
- show judgment before raw data
- keep pricing, thesis, and model-impact readable
- preserve auditability

Do not:
- turn the product into a broker UI
- turn the UI into terminal cosplay
- make charts or technicals visually dominate valuation logic

## Internationalization

Current i18n state:
- UI chrome supports `en` and `zh-TW`
- research content is translated incrementally
- `TSM` is the reference bilingual stock
- other stocks may still fall back to English research content

Keep internal enums stable in English and localize only at render time.

## Backend Deployment

The backend (`be/`) deploys to Azure Container Apps via Azure Container Registry (ACR).

Infrastructure:
- ACR: `valuedeckacr.azurecr.io`
- Container App: `value-deck-be`
- Resource group: `value-deck-rg`
- Region: `japaneast`
- Environment: `value-deck-env`

Deploy flow:
1. `cd be`
2. `make acr/login` — authenticate to ACR
3. `make deploy/update` — builds the Docker image for `linux/amd64`, pushes to ACR, and updates the running Container App

First-time setup uses `make deploy/containerapp` instead of step 3. This creates the Container App with secrets and env vars wired from `be/.env`. After the initial create, use `deploy/update` for subsequent deploys.

Health checks:
- `GET /` — liveness probe, always returns `{"ok": true}`
- `GET /health` — readiness probe, pings Turso SQLite and R2, returns per-service status (200 or 503)

Database migrations:
- `make migrate/up` — apply pending migrations
- `make turso-migrate db=<name> file=<path>` — apply a single migration file via Turso CLI

There is no CI/CD pipeline yet — deploys are manual from a local machine.

## Practical Notes

Useful commands:
```bash
cd web
pnpm install
pnpm dev
pnpm lint
pnpm build
pnpm format
```

When changing the frontend:
- validate with `pnpm lint` and `pnpm build`
- if the change is non-trivial, update NotebookLM after validation

When changing research content:
- keep the archive report as the detailed source
- keep NotebookLM updates short and durable
