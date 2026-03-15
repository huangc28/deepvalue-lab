# Agent Instructions

## NotebookLM Second Brain

This project uses NotebookLM as a long-term knowledge base for Codex and other agents.

Notebook metadata:
- Alias: `profound-stock`
- Notebook ID: `afa6678d-0ae5-4070-bd5f-7ec2365c6310`
- Metadata file: `.codex/notebooklm.json`
- Debug notebook: not initialized yet

Use NotebookLM before coding when the task involves:
- architecture understanding
- project onboarding
- prior decisions or constraints
- external API, vendor, or product documentation
- debugging background, runbooks, or known gotchas
- security review context

Workflow:
1. Query NotebookLM for stable, curated context.
2. Inspect the local repository to verify the current implementation.
3. If NotebookLM and the repository disagree, treat the repository as the source of truth.
4. Mention important mismatches briefly.
5. After implementing a non-trivial feature or workflow change, update the project notebook if validation succeeds.
6. For bugs, check the debugging notebook first once it exists, then fall back to web or local investigation.

Rules:
- Do not treat NotebookLM as the source of truth for the current working tree.
- Do not store secrets, credentials, auth cookies, or tokens in NotebookLM.
- Prefer focused NotebookLM queries over broad open-ended prompts.
- Use NotebookLM for curated knowledge; use local files for exact current code and config.
- Only write back to the project notebook after a non-trivial change and successful validation such as tests, build, or another task-appropriate verification.
- Write back concise summaries: feature outcome, key decisions, new architecture or operational context, and important follow-up constraints.

## Stock Research Persistence

Use a two-layer persistence model for equity analysis.

NotebookLM stores:
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
2. Save only the distilled reasoning and durable takeaways to NotebookLM.
3. Do not dump every full report verbatim into NotebookLM.

Suggested NotebookLM queries before non-trivial work:
- What is the current architecture and purpose of this project?
- Are there prior decisions or constraints relevant to this task?
- Are there known operational, security, or integration risks?
