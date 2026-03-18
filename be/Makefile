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
