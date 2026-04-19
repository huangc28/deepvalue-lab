---
name: project-instructions-bootstrap
description: Initialize reusable AGENTS.md and CLAUDE.md instruction scaffolding for another project. Use when the user wants to port shared agent guidance into a repo while keeping project-specific details explicit, unanswered items user-supplied, and edits patch-only.
version: "1.0.0"
---

# Project Instructions Bootstrap

Use this skill to create or repair the reusable parts of `AGENTS.md` and `CLAUDE.md` for another repository.

This skill is for project bootstrap and maintenance, not day-to-day instruction writing. Use it when the user asks to:
- bootstrap `AGENTS.md` and `CLAUDE.md` in a new repo
- port shared agent guidance from one project into another
- separate reusable instruction patterns from project-specific details
- keep Claude and agent-local workflows aligned without copying project-specific rules

## Purpose and Scope

Bootstrap only the reusable instruction scaffolding:
- source-of-truth rules
- execution and validation rules
- content boundaries between `AGENTS.md` and `CLAUDE.md`
- shared workflow alignment rules for `.claude` and `.agents`
- placeholders for project-specific details that the user must supply

Do not invent project-specific facts. If required details are missing or ambiguous, ask concise questions and wait before writing.

## Preconditions

Before making changes, verify:
- the current working directory is the target repo root
- the current state of `AGENTS.md`, `CLAUDE.md`, and `.claude/CLAUDE.md`
- whether `CONVENTIONS.md` exists, because agents should be told to read it before coding when present
- whether the repo already has a clear convention for where Claude instructions live

Choose the Claude instruction file with this rule:
1. If `CLAUDE.md` already exists, update it.
2. Otherwise, if `.claude/CLAUDE.md` already exists, update it.
3. Otherwise, create `CLAUDE.md` at the repo root.

If both `CLAUDE.md` and `.claude/CLAUDE.md` exist and the primary file is not clear from current repo conventions, ask the user which file is authoritative and wait.

## Bootstrap Targets

The setup should produce or maintain these artifacts:
- `AGENTS.md`
- one Claude instruction file: `CLAUDE.md` or `.claude/CLAUDE.md`

This shared skill itself lives at:
- `.claude/skills/project-instructions-bootstrap/SKILL.md`

When this workflow is shared across toolchains, keep the matching file aligned at:
- `.agents/skills/project-instructions-bootstrap/SKILL.md`

## Reusable Content Boundaries

### Put in `AGENTS.md`

- repo-local operating rules
- source-of-truth hierarchy
- where agents should look for durable project context
- coding entry points such as `CONVENTIONS.md`
- validation expectations and repo workflow notes
- shared rules that should apply across tools

### Put in `CLAUDE.md`

- lean behavioral instructions loaded into every Claude conversation
- execution priorities and guardrails
- concise references to `AGENTS.md`, skills, or workflow entry points
- no bulky reference material

### Keep project-specific and user-supplied

- project purpose and business context
- architecture details that are not obvious from the repo
- external system names, notebook IDs, vault paths, service URLs, or internal process names
- exact validation commands when they cannot be inferred from the repo
- any team-specific escalation or release policy

### Never store

- secrets
- credentials
- tokens
- cookies
- private keys

## Explicit User Question Flow

If required project details are missing or ambiguous, ask concise questions and wait before writing.

Treat these as blocking questions. Ask and wait before writing if any are unresolved:
- the preferred project display name, if the repo folder name is generic or misleading
- the authoritative Claude instruction file, if both `CLAUDE.md` and `.claude/CLAUDE.md` exist without a clear convention
- the durable context location to reference, if the project uses one and the path is not already visible in the repo
- validation commands, if they cannot be inferred from repo files
- any project-specific instruction sections that must be preserved verbatim

Use a short numbered list. Do not ask broad discovery questions when the repo already answers them.

If answers are required, stop after asking. Do not write partial instructions that pretend the missing details are known.

Only use explicit placeholders in a written draft when the user explicitly wants draft-only output or explicitly approves placeholder-based scaffolding. Otherwise, unresolved fields are blockers.

## Managed Section Strategy

To keep patching idempotent and safe across existing repos, own only bounded bootstrap blocks.

Use these exact markers when writing managed content:
- `<!-- project-instructions-bootstrap:agents:start -->`
- `<!-- project-instructions-bootstrap:agents:end -->`
- `<!-- project-instructions-bootstrap:claude:start -->`
- `<!-- project-instructions-bootstrap:claude:end -->`

Rules:
- If a managed block already exists, update only inside that block.
- If no managed block exists, insert one complete block under the most relevant heading.
- If the file already has overlapping unmanaged content and ownership is unclear, ask the user before editing.
- Do not treat a vaguely similar paragraph as an "equivalent bounded section" unless it is already clearly owned by this workflow.

## Workflow

### 1. Inspect current state

Read the existing instruction files and locate bounded insertion or replacement points.

Inspect:
- `AGENTS.md`
- `CLAUDE.md`
- `.claude/CLAUDE.md`
- `CONVENTIONS.md`, if present
- any existing repo-local instruction sections that must be preserved

Prefer updating an existing bounded section over creating a parallel duplicate section.

### 2. Separate reusable guidance from project-specific details

Keep these reusable principles unless the user explicitly says otherwise:
- the repository is the source of truth for the current implementation
- if repo files and external context disagree, trust the repo
- read `CONVENTIONS.md` before coding when it exists
- do not store secrets in instructions or external context systems
- keep `CLAUDE.md` lean and behavioral
- keep shared `.claude` and `.agents` workflows aligned when both are used

Replace anything project-specific with either:
- user-provided values, or
- explicit placeholders

Do not guess missing project-specific content.

### 3. Draft before write

Before applying patches, draft the exact sections you intend to insert or replace.

The draft should:
- show the target file path
- show the exact heading or bounded section to update
- use placeholders such as `<PROJECT_NAME>` or `<TEST_COMMAND>` where needed
- preserve unrelated existing instructions outside the target section

If blockers remain, send the concise questions first and wait. Only continue once the missing details are answered.

### 4. Apply idempotent patch-only updates

Use targeted patches only:
- create a file only when it does not exist
- replace only the relevant managed block when the file already exists
- do not rewrite unrelated instructions
- do not reorder unrelated sections unless required for clarity

If a file already contains the intended managed block content, leave it in place.

### 5. Report the result

Summarize:
- which files were created versus updated
- which Claude instruction file was selected and why
- which placeholders remain for the user to fill in later
- any questions that blocked writing, if applicable

## Concrete Template Text

Use these as starting templates, then patch only the relevant parts.

### `AGENTS.md` template section

If `AGENTS.md` is new, add a top-level heading first.

```md
# Agent Instructions

<!-- project-instructions-bootstrap:agents:start -->

## Source of Truth

- Read the local repository for current implementation truth.
- If the repository and external context disagree, trust the repository.
- Read `CONVENTIONS.md` before coding if it exists.
- Do not store secrets, credentials, tokens, or private keys in repo instructions or external knowledge systems.

## Project Context

Project name: `<PROJECT_NAME>`
Project purpose: `<PROJECT_PURPOSE>`
Durable context location: `<CONTEXT_LOCATION_OR_NONE>`

Use external or durable context for background only. Verify current code, config, and behavior in the repository.

## Instruction Boundaries

- Keep `AGENTS.md` for repo-local operating rules, stable workflow notes, and pointers to durable context.
- Keep `CLAUDE.md` lean and behavioral.
- Do not duplicate long architecture notes, stack inventories, or reference material in `CLAUDE.md`.
- Keep shared workflows under `.claude` and `.agents` aligned when both toolchains are used.

## Validation

Before marking work complete, run the project-appropriate validation steps:
- Format: `<FORMAT_COMMAND_OR_NONE>`
- Lint: `<LINT_COMMAND_OR_NONE>`
- Test: `<TEST_COMMAND_OR_NONE>`
- Build: `<BUILD_COMMAND_OR_NONE>`

<!-- project-instructions-bootstrap:agents:end -->
```

### Claude instruction file template section

If a new Claude file must be created, keep it short.

```md
# Claude Instructions

<!-- project-instructions-bootstrap:claude:start -->

## Working Rules

- Read `AGENTS.md` for repo-local rules.
- Read `CONVENTIONS.md` before coding if it exists.
- Treat the repository as the source of truth when repo files and external context disagree.
- Keep changes scoped and avoid overwriting unrelated instructions.
- Do not store secrets, credentials, tokens, cookies, or private keys in instructions or external knowledge systems.

## Content Boundary

- Keep this file lean and behavioral.
- Put project purpose, durable context locations, validation commands, and reference material in `AGENTS.md` or other repo docs, not here.
- Keep shared `.claude` and `.agents` workflows aligned when both exist.

<!-- project-instructions-bootstrap:claude:end -->
```

## Guardrails

- Patch-only and idempotent: never overwrite unrelated instructions.
- Ask the user concise questions and wait if required project details are missing or ambiguous.
- Do not invent project-specific details.
- Treat unresolved fields as blockers unless the user explicitly wants placeholder-based drafts.
- Do not copy source-project-specific policy into the target repo unless the user explicitly wants it.
- Keep `CLAUDE.md` lean. Do not turn it into a knowledge base.
- Preserve the rule that repo truth beats external context.
- Preserve the rule to read `CONVENTIONS.md` before coding when present.
- Preserve the rule not to store secrets.
- When a shared workflow is introduced for both toolchains, keep the `.claude` and `.agents` versions aligned.

## Success Criteria

The bootstrap is complete when:
- `AGENTS.md` exists or was updated with reusable repo-local instruction scaffolding
- exactly one Claude instruction file was created or updated, unless the repo already required both
- project-specific unknowns were answered by the user before writing, or placeholders were used only because the user explicitly approved a draft-only run
- unrelated existing instructions were preserved
- the resulting instructions clearly tell agents that the repository is the source of truth, `CONVENTIONS.md` should be read before coding when present, `CLAUDE.md` should stay lean, and secrets must not be stored
