# Runbook — SmartMarket Lite Web Client

Operational guide for installing, configuring, developing, verifying, and cleaning up the project.

## Prerequisites

- **Node.js** 20 LTS (matches CI)
- **npm** 10+
- **SmartMarket Lite API** on port 5000 — optional when using demo mode; required for live integration

Check tooling:

```bash
node --version
npm --version
npm run doctor
```

## Install

```bash
git clone <repository-url>
cd smartmarket-lite-web-client
npm ci
```

Use `npm ci` (not `npm install`) for reproducible installs. `package-lock.json` must be present.

## Configure

```bash
cp .env.example .env
```

Edit `.env`:

```text
VITE_SMARTMARKET_API_BASE_URL=http://localhost:5000
VITE_API_BASE_URL=http://localhost:5000
VITE_USE_MOCK_API=true
VITE_APP_ENV=development
```

| `VITE_USE_MOCK_API` | Behavior |
|---|---|
| `true` | MSW mock API in dev; full demo without backend ([DEMO_MODE.md](DEMO_MODE.md)) |
| `false` | Requests to SmartMarket Lite API |

Restart the dev server after changing environment variables. Vite reads `VITE_*` variables at build/dev startup.

The `.env` file is local-only and must not be committed.

## Development

```bash
npm run dev          # uses .env
npm run dev:mock     # force VITE_USE_MOCK_API=true
npm run dev:live     # force VITE_USE_MOCK_API=false
```

- Default URL: [http://localhost:5173](http://localhost:5173)
- Port is fixed (`strictPort: true`); stop other processes on 5173 if startup fails.

### Demo mode (no API)

1. `npm ci` and `cp .env.example .env` (`VITE_USE_MOCK_API=true` by default).
2. `npm run dev` or `npm run dev:mock`.
3. Sign in with demo users from [DEMO_MODE.md](DEMO_MODE.md).
4. Confirm **Demo mode** appears in the header.

### Working with the API

1. Start SmartMarket Lite API on port 5000.
2. Confirm `.env` points to the correct base URL.
3. Register a user or use seeded credentials from the API documentation.
4. Sign in through `/login` — the token persists in `localStorage`.
5. Exercise the full flow: browse `/products`, open a product, add to cart, checkout at `/checkout`, review orders at `/orders`. Admin users can manage catalog items at `/admin/products`.

## Verification

Run the full quality gate before pushing:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Or as a single sequence:

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

### Preview production build

```bash
npm run build
npm run preview
```

Preview serves on [http://localhost:4173](http://localhost:4173) by default.

## Optional live API smoke script

With the SmartMarket Lite API running:

```bash
bash scripts/check-live-api.sh
```

The script registers a unique test user, logs in, loads products, adds an available item to cart, checks out, and lists orders. It does not print full JWT tokens.

## E2E tests

Install browsers once, then run smoke specs:

```bash
npx playwright install
npm run test:e2e
```

Playwright starts the Vite dev server automatically (`webServer` in `playwright.config.ts`). Override the base URL:

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:5173 npm run test:e2e
```

View the last report:

```bash
npm run report
```

## Troubleshooting

| Problem | Likely cause | Fix |
|---|---|---|
| `Port 5173 is already in use` | Another dev server running | Stop the other process or change Vite port in config |
| Catalog shows error state | API not reachable | Start API or check `VITE_SMARTMARKET_API_BASE_URL` |
| 401 on protected routes | Missing/expired token | Sign in again; clear `smartmarket.auth.token` in devtools |
| `npm ci` fails | Lock file out of sync | Regenerate lock file locally with `npm install`, commit lock file |
| E2E timeout | Dev server failed to start | Run `npm run dev` manually and check console errors |

## Cleanup

Remove generated artifacts:

```bash
npm run clean
```

Full cleanup before ZIP, archive, or public release:

```bash
npm run clean
rm -rf node_modules dist coverage playwright-report test-results reports
rm -f .env
find . -name ".DS_Store" -type f -delete
find . -type d -name "__MACOSX" -prune -exec rm -rf {} +
```

Do not commit `node_modules`, `dist`, coverage, Playwright reports, or local `.env`.

## Scripts reference

| Script | Description |
|---|---|
| `npm run dev` | Vite development server |
| `npm run build` | Typecheck + production bundle |
| `npm run preview` | Serve production build locally |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (zero warnings allowed) |
| `npm run test` | Vitest single run |
| `npm run test:watch` | Vitest watch |
| `npm run test:e2e` | Playwright |
| `npm run doctor` | Validate project file presence |
| `npm run clean` | Delete build/test artifacts |
