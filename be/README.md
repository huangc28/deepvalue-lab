# deepvalue-lab-be

Go backend service for DeepValue Lab, deployed to Azure Container Apps.

Stack:
- Long-running HTTP entrypoint: `cmd/server/main.go`
- Uber FX bootstrapping
- HTTP routing via `chi`
- Optional Postgres and Redis wiring through env vars
- Reusable `Dockerfile` for Container Apps builds

## Local development

**Start the server:**
```bash
cd be
make start
# or
go run ./cmd/server
```

Server runs at `http://localhost:8080` by default.

**Smoke test:**
```bash
curl http://localhost:8080/health
```

**Custom port:**
```bash
APP_PORT=9000 make start
```

**Debug logging:**
```bash
LOG_LEVEL=debug make start
```

`PG_URL` and `REDIS_URL` are optional — leaving them empty is fine for local development without a database.

## Build a container

```bash
make docker/build IMAGE_NAME=be IMAGE_TAG=dev
```

## Deploy to Azure Container Apps

1. Build and push an image to Azure Container Registry or another registry Azure can pull from.
2. Set:
   - `AZURE_RESOURCE_GROUP`
   - `AZURE_LOCATION`
   - `AZURE_CONTAINERAPPS_ENV`
   - `ACR_IMAGE`
3. Run:

```bash
make deploy/containerapp \
  CONTAINER_APP_NAME=be \
  AZURE_RESOURCE_GROUP=<rg> \
  AZURE_LOCATION=<location> \
  AZURE_CONTAINERAPPS_ENV=<env> \
  ACR_IMAGE=<registry>/<image>:<tag>
```

You can also adapt `azure/containerapp.yaml` if you prefer YAML-based deployment.

## Add a new domain

1. Create handlers under `lib/app/<domain>/...` implementing `lib/router.Handler`.
2. Register handler constructors in `cmd/server/main.go` via `router.AsRoute(...)`.
3. Keep platform ingress generic; route shape belongs in chi, not in Azure metadata.

## Env vars

Set env vars in Container Apps or locally to match `config/config.go`:
- `APP_NAME` default: `be`
- `APP_ENV` default: `development`
- `APP_PORT` default: `8080`
- `LOG_LEVEL` default: `info`
- `PG_URL` optional; if empty Postgres is disabled
- `REDIS_URL` optional; if empty Redis is disabled
