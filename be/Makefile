-include .env
export

APP_PORT ?= 8080
IMAGE_NAME ?= be
IMAGE_TAG ?= dev
CONTAINER_APP_NAME ?= be
AZURE_RESOURCE_GROUP ?=
AZURE_LOCATION ?=
AZURE_CONTAINERAPPS_ENV ?=
ACR_IMAGE ?=

.PHONY: build test start docker/build docker/run deploy/containerapp

build:
	go build ./...

test:
	go test ./...

start:
	APP_PORT=$(APP_PORT) go run ./cmd/server

docker/build:
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

docker/run:
	docker run --rm -p $(APP_PORT):$(APP_PORT) -e APP_PORT=$(APP_PORT) $(IMAGE_NAME):$(IMAGE_TAG)

deploy/containerapp:
	test -n "$(ACR_IMAGE)" || (echo "ACR_IMAGE is required" >&2; exit 1)
	test -n "$(AZURE_RESOURCE_GROUP)" || (echo "AZURE_RESOURCE_GROUP is required" >&2; exit 1)
	test -n "$(AZURE_LOCATION)" || (echo "AZURE_LOCATION is required" >&2; exit 1)
	test -n "$(AZURE_CONTAINERAPPS_ENV)" || (echo "AZURE_CONTAINERAPPS_ENV is required" >&2; exit 1)
	az containerapp up \
		--name "$(CONTAINER_APP_NAME)" \
		--resource-group "$(AZURE_RESOURCE_GROUP)" \
		--location "$(AZURE_LOCATION)" \
		--environment "$(AZURE_CONTAINERAPPS_ENV)" \
		--image "$(ACR_IMAGE)" \
		--target-port $(APP_PORT) \
		--ingress external

## migrate/up: apply all pending migrations to Turso.
.PHONY: migrate/up
migrate/up:
	go run ./cmd/migrate up

## migrate/down: roll back the last migration.
.PHONY: migrate/down
migrate/down:
	go run ./cmd/migrate down

## migrate/status: show migration status.
.PHONY: migrate/status
migrate/status:
	go run ./cmd/migrate status

## migrate/reset: roll back all migrations.
.PHONY: migrate/reset
migrate/reset:
	go run ./cmd/migrate reset

## goose-create: create a Goose migration for Turso SQLite.
.PHONY: goose-create
goose-create:
	@if [ -z "$(name)" ]; then \
		echo "Error: Missing migration name."; \
		echo "Usage: make goose-create name=add_documents_table"; \
		exit 1; \
	fi
	@mkdir -p turso/migrations
	goose -dir turso/migrations create "$(name)" sql

## turso-migrate: apply a single goose migration file to the Turso DB.
## Usage: make turso-migrate db=deepvalue-lab file=turso/migrations/20260318065637_stock_domain.sql
.PHONY: turso-migrate
turso-migrate:
	@if [ -z "$(db)" ]; then \
		echo "Error: Missing Turso DB name."; \
		echo "Usage: make turso-migrate db=my-turso-db file=turso/migrations/xxx.sql"; \
		exit 1; \
	fi
	@if [ -z "$(file)" ]; then \
		echo "Error: Missing migration file."; \
		echo "Usage: make turso-migrate db=my-turso-db file=turso/migrations/xxx.sql"; \
		exit 1; \
	fi
	@awk '/-- \+goose Up/{p=1;next} /-- \+goose Down/{p=0} /-- \+goose Statement/{next} p' $(file) \
		| turso db shell "$(db)"
	@echo "Migration applied: $(file)"

## turso-schema-dump: dump live Turso SQLite schema into turso/schema.sql.
.PHONY: turso-schema-dump
turso-schema-dump:
	@if [ -z "$(db)" ]; then \
		echo "Error: Missing Turso DB name."; \
		echo "Usage: make turso-schema-dump db=my-turso-db"; \
		exit 1; \
	fi
	@mkdir -p turso
	turso db shell "$(db)" ".schema" > turso/schema.sql
	@echo "Schema written to turso/schema.sql"

## gen/sqlc: generate Go code from sqlc.yaml.
.PHONY: gen/sqlc
gen/sqlc:
	sqlc generate
