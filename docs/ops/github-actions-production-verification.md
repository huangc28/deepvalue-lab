# GitHub Actions Production Verification

This runbook records the minimum post-deploy checks for the DeepValue Lab
GitHub Actions CD workflow.

## Purpose

Use this after a production deploy from `.github/workflows/deploy.yml` to
confirm the release is healthy enough to keep manual deploys as fallback-only.

## Checks

### 1. Frontend availability

Confirm the public site loads:

```bash
curl -I -L https://value-deck.com
```

Expected:
- HTTP `200`

### 2. Frontend build points at production API

Fetch the deployed JS bundle and confirm it contains the intended API base URL:

```bash
curl -sS https://value-deck.com/assets/<bundle>.js | rg -o "https://api\\.value-deck\\.com" -m 1
```

Expected:
- `https://api.value-deck.com`

### 3. Backend health

Confirm both stable health surfaces respond:

```bash
curl -sS -D - https://api.value-deck.com/health
curl -sS -D - https://api.value-deck.com/ping
```

Expected:
- `/health` returns HTTP `200` and JSON with `"ok": true`
- `/ping` returns HTTP `200`

### 4. Backend-driven frontend data path

Verify one real stock detail flow end-to-end through the API the frontend uses:

```bash
curl -sS https://api.value-deck.com/v1/stocks
curl -sS https://api.value-deck.com/v1/stocks/TSM
curl -sS https://api.value-deck.com/v1/stocks/TSM/reports
curl -sS https://api.value-deck.com/v1/stocks/TSM/reports/<report-id>/technical-snapshot
```

Expected:
- `/v1/stocks` returns at least one production stock
- `/v1/stocks/TSM` returns a valid stock detail payload
- `/reports` returns at least one report
- `/technical-snapshot` returns `status: "ready"` and a populated snapshot

### 5. Worker startup evidence

Confirm the latest worker revision started and connected to RabbitMQ:

```bash
az containerapp logs show \
  -n value-deck-worker \
  -g value-deck-rg \
  --tail 100
```

Expected log evidence:
- a RabbitMQ connection line such as `connecting rabbitmq`
- a worker start line such as `technical snapshot worker starting`

### 6. Commit traceability

Confirm all three apps report the deployed `GIT_SHA` and latest revision:

```bash
for app in value-deck-web value-deck-be value-deck-worker; do
  az containerapp show -n "$app" -g value-deck-rg \
    --query "{latestRevisionName:properties.latestRevisionName,gitSha:properties.template.containers[0].env[?name=='GIT_SHA'].value | [0]}"
done
```

Expected:
- all three apps report the same deploy commit SHA
- latest revision names match the workflow's revision suffix pattern

## Evidence From 2026-04-14

The following checks passed during Phase 4 validation:

- `https://value-deck.com` returned HTTP `200`
- `https://api.value-deck.com/health` returned HTTP `200` with `{"ok":true,...}`
- `https://api.value-deck.com/ping` returned HTTP `200`
- the deployed frontend bundle referenced `https://api.value-deck.com`
- `https://api.value-deck.com/v1/stocks` returned live production stock rows
- `https://api.value-deck.com/v1/stocks/TSM` returned a valid stock detail payload
- `https://api.value-deck.com/v1/stocks/TSM/reports` returned live report rows
- `https://api.value-deck.com/v1/stocks/TSM/reports/TSM-20260408-75f64b99/technical-snapshot` returned `status: "ready"` with `defaultTimeframe: "1D"` and `availableTimeframes: ["1D","1W"]`
- worker logs for revision `value-deck-worker--k6-1-0053643` showed `connecting rabbitmq` and `technical snapshot worker starting`
- all three apps reported `GIT_SHA=0053643cf0af1ec5924af4389ae96dc23605110e`

Related successful runs:
- Phase 3 deploy wiring: `24405271904`
- Post-concurrency-fix regression: `24405661704`
