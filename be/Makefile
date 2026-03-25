-include .env
export

APP_PORT ?= 8080
IMAGE_NAME ?= be
IMAGE_TAG ?= latest
CONTAINER_APP_NAME ?= value-deck-be
AZURE_RESOURCE_GROUP ?= value-deck-rg
AZURE_LOCATION ?= japaneast
AZURE_CONTAINERAPPS_ENV ?= value-deck-env
ACR_NAME ?= valuedeckacr
ACR_IMAGE ?= $(ACR_NAME).azurecr.io/$(IMAGE_NAME):$(IMAGE_TAG)

.PHONY: build test start start/worker docker/build docker/run deploy/containerapp

build:
	go build ./...

test:
	go test ./...

start:
	APP_PORT=$(APP_PORT) go run ./cmd/server

start/worker:
	go run ./cmd/worker

docker/build:
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

docker/run:
	docker run --rm -p $(APP_PORT):$(APP_PORT) -e APP_PORT=$(APP_PORT) $(IMAGE_NAME):$(IMAGE_TAG)

## acr/login: log in to Azure Container Registry.
.PHONY: acr/login
acr/login:
	az acr login --name $(ACR_NAME)

## acr/push: build and push image to ACR.
.PHONY: acr/push
acr/push:
	docker build --platform linux/amd64 -t $(ACR_IMAGE) .
	docker push $(ACR_IMAGE)

## deploy/containerapp: create or update the Container App with secrets from .env.
## Note: min-replicas=0 scales to zero when idle, saving cost when there is no traffic.
deploy/containerapp:
	az containerapp create \
		--name "$(CONTAINER_APP_NAME)" \
		--resource-group "$(AZURE_RESOURCE_GROUP)" \
		--environment "$(AZURE_CONTAINERAPPS_ENV)" \
		--image "$(ACR_IMAGE)" \
		--registry-server "$(ACR_NAME).azurecr.io" \
		--target-port 8080 \
		--ingress external \
		--min-replicas 0 \
		--max-replicas 2 \
		--secrets \
			turso-dsn="$(TURSO_SQLITE_DSN)" \
			turso-token="$(TURSO_SQLITE_TOKEN)" \
			r2-account-id="$(R2_ACCOUNT_ID)" \
			r2-bucket="$(R2_BUCKET)" \
			r2-access-key-id="$(R2_ACCESS_KEY_ID)" \
			r2-secret-access-key="$(R2_SECRET_ACCESS_KEY)" \
		--env-vars \
			APP_NAME=be \
			APP_ENV=production \
			APP_PORT=8080 \
			LOG_LEVEL=info \
			TURSO_SQLITE_DSN=secretref:turso-dsn \
			TURSO_SQLITE_TOKEN=secretref:turso-token \
			TURSO_SQLITE_DRIVER=libsql \
			R2_ACCOUNT_ID=secretref:r2-account-id \
			R2_BUCKET=secretref:r2-bucket \
			R2_ACCESS_KEY_ID=secretref:r2-access-key-id \
			R2_SECRET_ACCESS_KEY=secretref:r2-secret-access-key

## deploy/update: push new image and update the running container app.
.PHONY: deploy/update
deploy/update: acr/push
	az containerapp update \
		--name "$(CONTAINER_APP_NAME)" \
		--resource-group "$(AZURE_RESOURCE_GROUP)" \
		--image "$(ACR_IMAGE)" \
		--revision-suffix "$(shell date +%Y%m%d%H%M%S)"

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
