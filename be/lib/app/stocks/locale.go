package stocks

import (
	"net/http"
	"strings"
)

func isZhTWLocale(r *http.Request) bool {
	return r.URL.Query().Get("locale") == "zh-TW"
}

func hasNonEmptySummaryJSON(raw string) bool {
	trimmed := strings.TrimSpace(raw)
	return trimmed != "" && trimmed != "{}" && trimmed != "null"
}
