# SmartMarket Lite Web Client

## What is this?

React + TypeScript **frontend-only** client for the **SmartMarket Lite API** (separate backend project). Portfolio storefront UI with typed REST integration, MSW demo mode, and automated tests.

## What this project proves

End-to-end frontend delivery for a simplified e-commerce flow:

**auth → catalog → product details → cart → checkout → orders → order details → admin products**

Includes product availability states, business error handling, cache refresh after checkout, pending order display, MSW demo mode for review without a backend, automated tests, and CI.

GitHub Actions CI is passing on `main`.

## Integration modes

| Mode | When to use | Backend required |
| --- | --- | --- |
| Demo / mock | Portfolio review and local UI testing | No — MSW demo mode with `VITE_USE_MOCK_API=true` |
| Live API | Full-stack integration with SmartMarket Lite API | Yes — SmartMarket Lite API must run separately on port 5000 |

Demo mode does not replace final live integration testing. See [docs/DEMO_MODE.md](docs/DEMO_MODE.md) and [docs/API_INTEGRATION.md](docs/API_INTEGRATION.md).

## Implemented features

- Authentication (register, login, logout, JWT session)
- Route guards (`ProtectedRoute`, `GuestRoute`, `AdminRoute`)
- Product catalog (search, filters, pagination)
- Product details with stock / availability badges
- Cart (add, update quantity, remove, clear)
- Checkout with business conflict handling
- Pending order creation and display (not payment completion)
- Orders list and order details with item snapshots
- Admin product management (create, edit, activate/deactivate)
- MSW demo mode and live API mode
- Automated unit, component, feature, API/mock, and E2E smoke tests
- GitHub Actions CI (install, typecheck, lint, test, build; no live backend required)

## Demo mode (no backend)

```bash
npm ci
cp .env.example .env
npm run dev
```

`.env.example` defaults to `VITE_USE_MOCK_API=true`. The header shows **Demo mode** when mock API is active.

| Role | Email | Password |
| --- | --- | --- |
| Customer | `customer@smartmarket.dev` | `Password123!` |
| Admin | `admin@smartmarket.dev` | `Password123!` |

Optional: `npm run dev:mock` forces mock mode regardless of `.env`.

## Live API mode

1. Start **SmartMarket Lite API** separately (default `http://localhost:5000`).
2. Configure `.env`:

```text
VITE_USE_MOCK_API=false
VITE_SMARTMARKET_API_BASE_URL=http://localhost:5000
```

3. Run:

```bash
npm run dev
```

Optional: `npm run dev:live` forces `VITE_USE_MOCK_API=false`.

## Verify locally

```bash
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
```

Optional E2E (install browsers once):

```bash
npx playwright install
npm run test:e2e
```

## Verification

| Check | Status |
| --- | --- |
| TypeScript typecheck | Passing |
| ESLint | Passing |
| Vitest test suite | Passing |
| Production build | Passing |
| GitHub Actions | Passing on main |

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run dev:mock` | Start the app in demo/mock API mode |
| `npm run dev:live` | Start the app in live API mode |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the Vitest test suite |
| `npm run test:e2e` | Run Playwright smoke tests |
| `npm run build` | Create a production build |

Additional scripts: `npm run preview`, `npm run test:watch`, `npm run doctor`, `npm run clean`.

## What is not included

- Backend implementation (separate SmartMarket Lite API project)
- Real payment provider integration
- Customer-side order cancellation
- Production deployment, hosting, or hardened security
- Enterprise inventory or back-office suite beyond admin products

See [docs/KNOWN_LIMITATIONS.md](docs/KNOWN_LIMITATIONS.md).

## Tech stack

React, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod, Tailwind CSS, Vitest, Testing Library, Playwright, MSW, GitHub Actions

## Documentation

| Document | Description |
| --- | --- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Frontend structure, routing, server state, and MSW demo architecture |
| [docs/API_INTEGRATION.md](docs/API_INTEGRATION.md) | Demo/live API modes, endpoint groups, and error handling |
| [docs/DEMO_MODE.md](docs/DEMO_MODE.md) | How to review the app without the backend |
| [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) | Environment variables and demo/live configuration |
| [docs/TESTING.md](docs/TESTING.md) | Automated, demo, E2E, and live/manual testing strategy |
| [docs/RUNBOOK.md](docs/RUNBOOK.md) | Local verification and release workflow |

Further docs: [docs/CI.md](docs/CI.md), [docs/MANUAL_TEST_SCENARIOS.md](docs/MANUAL_TEST_SCENARIOS.md), [docs/REGRESSION_CHECKLIST.md](docs/REGRESSION_CHECKLIST.md), [docs/KNOWN_LIMITATIONS.md](docs/KNOWN_LIMITATIONS.md), [docs/UI_UX.md](docs/UI_UX.md), [docs/ROADMAP.md](docs/ROADMAP.md), [docs/PR_RELEASE_LOG.md](docs/PR_RELEASE_LOG.md).

## Clean before ZIP or public release

```bash
npm run clean
rm -rf node_modules dist coverage coverage-report playwright-report test-results reports
rm -f .env tsconfig.tsbuildinfo
find . -name ".DS_Store" -type f -delete
find . -type d -name "__MACOSX" -prune -exec rm -rf {} +
```

Generated artifacts are not committed.

## Repository boundary

**Included:** TypeScript UI, API client, DTOs, MSW demo handlers, tests, and public documentation.

**Not included:** Server-side code, databases, migrations, or backend authentication implementation.
