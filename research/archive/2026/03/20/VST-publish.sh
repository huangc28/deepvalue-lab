#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/huangchihan/develop/profound-stock"
BASE_URL="${BASE_URL:-http://localhost:9000}"
PROVENANCE="${PROVENANCE:-codex-gpt-5}"

ARCHIVE_DIR="$ROOT/research/archive/2026/03/20"
REPORT_FILE="$ARCHIVE_DIR/VST-analysis.md"
DETAIL_FILE="$ARCHIVE_DIR/VST-stock-detail.json"
DETAIL_ZH_FILE="$ARCHIVE_DIR/VST-stock-detail-zh-TW.json"

exec python3 "$ROOT/.agents/skills/deepvalue-stock-analysis/references/publish_stock_analysis.py" \
  --ticker VST \
  --report "$REPORT_FILE" \
  --detail "$DETAIL_FILE" \
  --detail-zh "$DETAIL_ZH_FILE" \
  --base-url "$BASE_URL" \
  --provenance "$PROVENANCE" \
  "$@"
