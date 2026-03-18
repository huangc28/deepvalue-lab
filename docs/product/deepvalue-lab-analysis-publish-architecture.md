# DeepValue Lab Analysis Publish Architecture

Date: 2026-03-17
Status: Proposal

---

## Context

DeepValue Lab needs a durable way to show the latest stock analysis inside the web app without moving the full research workflow into the web app backend.

The intended operating model is:

- the web app consumes published stock analysis results
- the substantive analysis is performed by a local AI agent
- the backend acts as a publish and retrieval layer, not as the primary analysis engine

Current repository reality:

- the product is still a frontend-only mockup
- there is no backend, database, scheduler, or object storage implementation yet
- the existing `StockDetail` contract remains the target shape for web app consumption

This document is a proposal, not a description of current implementation.

## Core Decision

Separate local AI analysis from the backend publish path.

The proposed architecture is:

- local AI agent generates the analysis report and the structured stock payload
- backend API receives published analysis results
- full report artifacts are stored in Cloudflare R2
- the latest published structured stock state is stored in sqlite
- the web app reads published data directly and does not parse markdown during the read path

This keeps the research workflow flexible while giving the web app a stable, fast data interface.

## API Proposal

Proposed HTTP surface:

- `GET /v1/stocks`
- `GET /v1/stocks/:ticker`
- `POST /v1/subscriptions`
- `POST /v1/stocks/:ticker/reports`
- `GET /v1/stocks/:ticker/reports`

Intended responsibilities:

- `GET /v1/stocks`: return the watchlist plus the latest published summary for each subscribed ticker
- `GET /v1/stocks/:ticker`: return the latest published `StockDetail` payload for a single ticker
- `POST /v1/subscriptions`: create or update watchlist subscription state
- `POST /v1/stocks/:ticker/reports`: publish a new analysis result for a ticker
- `GET /v1/stocks/:ticker/reports`: list report versions or report metadata for a ticker

## API Semantics

Subscription management and report upload are intentionally separate concerns.

Default proposal:

- subscription and report upload are split
- report upload may support first-publish auto-subscribe for convenience
- report upload is the publish path, not the watchlist-management path

The `POST /v1/stocks/:ticker/reports` request should include both:

- report artifact metadata for the stored raw report
- a frontend-ready `StockDetail` structured payload

The backend should not require the web app to fetch a markdown report and transform it at read time.

## Data Model Proposal

Proposed persistence layers:

- `subscriptions`
- `stock_reports`
- `published_stock_details`

Intended responsibilities:

- `subscriptions`: which tickers are under watch
- `stock_reports`: report version records plus artifact metadata such as storage key, publish time, and provenance
- `published_stock_details`: latest published stock payload used by the web app

Important default:

- sqlite stores the latest published `StockDetail` state, not only an R2 key
- R2 stores the raw report artifact

This keeps dashboard and detail-page reads fast and predictable.

## Skill Workflow Proposal

The local analysis workflow should continue to center on [$deepvalue-stock-analysis](/Users/huangchihan/develop/profound-stock/.agents/skills/deepvalue-stock-analysis/SKILL.md), but its publish behavior should evolve.

Proposed workflow:

- the skill generates a markdown report
- the skill generates a `StockDetail` JSON payload
- the skill asks whether the result should be published to the backend
- if the answer is yes, the result is sent through the publish API

Under this proposal, publish does not directly update `web/src/data/mock-stocks.ts`.

A future helper skill can be added for:

- API publishing
- retryable upload flows
- bulk refresh orchestration

## Bulk Refresh Proposal

Create a dedicated refresh skill that iterates through all subscribed tickers and refreshes them one by one.

V1 defaults:

- sequential queue only
- no subagent fan-out
- configurable weekly budget threshold
- stop the current refresh batch when remaining budget falls below 30 percent

This design is meant to support later cron or automation usage without introducing parallel execution complexity first.

For the first version, budget control should use manual configuration rather than provider-side usage APIs.

## Deferred Decisions

The following are intentionally deferred:

- whether to integrate provider usage APIs for real token-budget measurement
- whether to introduce parallel or subagent-based bulk refresh
- whether to add event-driven triggers such as earnings or price-move initiated refresh
- whether to automate news qualification before re-analysis

These decisions should be made after the publish path is stable.
