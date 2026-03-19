ACR_NAME ?= valuedeckacr
IMAGE_NAME ?= web
IMAGE_TAG ?= latest
ACR_IMAGE ?= $(ACR_NAME).azurecr.io/$(IMAGE_NAME):$(IMAGE_TAG)
CONTAINER_APP_NAME ?= value-deck-web
AZURE_RESOURCE_GROUP ?= value-deck-rg

.PHONY: dev build

dev:
	pnpm dev

build:
	pnpm build

## acr/login: log in to Azure Container Registry.
.PHONY: acr/login
acr/login:
	az acr login --name $(ACR_NAME)

## acr/push: build and push image to ACR.
.PHONY: acr/push
acr/push:
	docker buildx build --platform linux/amd64 -t $(ACR_IMAGE) .
	docker push $(ACR_IMAGE)

## deploy/update: push new image and update the running container app.
.PHONY: deploy/update
deploy/update: acr/push
	az containerapp update \
		--name "$(CONTAINER_APP_NAME)" \
		--resource-group "$(AZURE_RESOURCE_GROUP)" \
		--image "$(ACR_IMAGE)" \
		--revision-suffix "$(shell date +%Y%m%d%H%M%S)"
