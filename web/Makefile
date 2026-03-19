ACR       := valuedeckacr
REGISTRY  := $(ACR).azurecr.io
RG        := value-deck-rg
APP       := value-deck-web
TAG       := $(shell date +%Y%m%d%H%M%S)

.PHONY: dev build deploy

dev:
	pnpm dev

build:
	docker buildx build --platform linux/amd64 \
		-t $(REGISTRY)/web:$(TAG) -t $(REGISTRY)/web:latest .

deploy: build
	az acr login --name $(ACR)
	docker push $(REGISTRY)/web:$(TAG)
	docker push $(REGISTRY)/web:latest
	az containerapp update --name $(APP) --resource-group $(RG) \
		--image $(REGISTRY)/web:$(TAG) -o none
	@echo "==> Deployed web:$(TAG)"
