# Agent Instructions

This repository is a greenfield Go service intended for Azure Container Apps.

Core rules:
- Treat the repository as the source of truth for current implementation details.
- Keep the runtime contract Azure Container Apps first.
- Keep the example surface small: only the `health` domain is scaffolded by default.
- Do not copy product-specific domains or third-party integrations into the baseline template.

Architecture shape:
- `cmd/server/main.go` is the long-running HTTP entrypoint.
- `lib/app/<domain>` contains thin handlers implementing `lib/router.Handler`.
- `lib/router` owns common chi router setup.
- `config`, `db`, and `cache` provide env-driven infra wiring.

When extending the service:
1. Query any durable project context first if your repo later adopts a second-brain workflow.
2. Verify the local repository before trusting historical notes.
3. Keep deployment-specific concerns in `azure/` and application concerns in `lib/`.
