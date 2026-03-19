FROM node:22-alpine AS builder

WORKDIR /src

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_API_URL=https://api.value-deck.com
ENV VITE_API_URL=$VITE_API_URL

RUN pnpm build

FROM nginx:alpine

COPY --from=builder /src/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
