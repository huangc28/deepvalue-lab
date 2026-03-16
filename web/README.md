# DeepValue Lab Web

Frontend mockup workspace for the DeepValue Lab web app.

Current scope:
- dashboard shell
- stock detail route
- local mock data only

## Local Setup

Requirements:
- Node.js 22+
- pnpm

Install dependencies:

```bash
pnpm install
```

Start the local dev server:

```bash
pnpm dev
```

Open the app in your browser:

```text
http://127.0.0.1:5173
```

## Useful Commands

Run lint:

```bash
pnpm lint
```

Run build:

```bash
pnpm build
```

Format files:

```bash
pnpm format
```

## Notes

- This is a frontend-only mockup for now.
- Data is local and lives in `src/data/mock-stocks.ts`.
- Routing is handled with TanStack Router.
