# Testing — SmartMarket Lite Web Client

## Test strategy

Four layers, from fastest to slowest:

| Layer | Tooling | Scope |
|---|---|---|
| Type safety | TypeScript (`tsc --noEmit`) | Compile-time contracts |
| Lint | ESLint | Code consistency |
| Unit / component / feature | Vitest + Testing Library + jsdom | Logic, UI, and mocked API flows |
| E2E smoke | Playwright | Real browser navigation |

Unit and feature tests do **not** require a running backend. API boundaries are mocked at `smartMarketApi`, `fetch`, or MSW (`tests/mocks/mock-handlers.test.ts`).

**Coverage layers:** Automated unit, component, feature, API client, MSW handler, and E2E smoke tests are included. Run `npm run test` for the current count.

## Commands

```bash
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
```

Additional:

```bash
npm run test:watch    # Vitest watch mode
npm run test:ui       # Vitest UI (optional)
npx playwright install   # One-time browser install for E2E
npm run test:e2e      # Playwright smoke (starts dev server)
npm run report        # Open Playwright HTML report
```

## Test layout

```text
tests/
  setup.ts              Vitest + jest-dom setup
  fixtures/             Deterministic API DTO fixtures
  utils/                renderWithProviders helper
  api/                  HTTP client and domain API contract tests
  unit/                 Pure logic and client tests
  component/            Isolated UI components and app shell
  feature/              Integration tests with mocked API
  mocks/                MSW handler integration tests
  e2e/                  Playwright smoke specs (app-smoke, optional live-auth)
```

Configuration: `vite.config.ts` (`test` block), `playwright.config.ts`.

## Manual and live testing

Demo/mock flows without a backend: [DEMO_MODE.md](DEMO_MODE.md). MSW handler tests: `tests/mocks/mock-handlers.test.ts`.

Scenarios that require the real SmartMarket Lite API are documented in [MANUAL_TEST_SCENARIOS.md](MANUAL_TEST_SCENARIOS.md). Use [REGRESSION_CHECKLIST.md](REGRESSION_CHECKLIST.md) before release.

| Type | Requires live API | CI |
|---|---|---|
| Unit / component / feature / API client tests | No | Yes |
| E2E app smoke (`tests/e2e/app-smoke.spec.ts`) | No | Optional / local |
| E2E live auth (`tests/e2e/live-auth-smoke.spec.ts`) | Yes (`SMARTMARKET_LIVE_API=1`) | No |

## Coverage by area

### Unit tests

| Area | Tests |
|---|---|
| **HTTP client** | GET/POST parsing, auth header, 401/409/network errors, query string builder |
| **API errors** | Normalization, `getUiErrorPresentation` variants |
| **Cache invalidation** | Cart, checkout, admin product invalidation rules |
| **Form schemas** | Auth, cart quantity, product/admin validation |
| **Contract fixtures** | Cart totals, order snapshots, error normalization |
| **canAddProductToCart** | Stock and active-status guard logic |
| **applyFormServerErrors** | Server field error mapping |
| **Home page** | Portfolio intro content |

### Component tests

| Area | Tests |
|---|---|
| **Button** | Variants and disabled state |
| **Feedback components** | Loading, empty, error, forbidden states |
| **Product card** | DTO mapping, inactive/unavailable badge |
| **App layout** | Skip link, nav landmark, main content |
| **App smoke** | `/products` route renders catalog shell |

### Feature integration tests

| Area | Tests |
|---|---|
| **Auth forms** | Required fields, email format, submit disabled while pending |
| **Auth API errors** | 401 invalid credentials, network offline, 409 duplicate email |
| **Route guards** | Protected route redirect; admin forbidden state |
| **Product catalog** | Loading, success, empty, error + retry |
| **Product details** | Loading, success, add-to-cart flow |
| **Product details states** | Loading, 404, success (mocked query) |
| **Cart page** | Item list, empty state, quantity update, remove |
| **Cart mutations** | Add/update/remove hooks |
| **Cart quantity form** | Validation boundaries |
| **Checkout page** | Empty cart, success navigation, 409 conflict |
| **Checkout mutation** | Hook behavior with mocked API |
| **Orders page** | Loading, empty, order list rendering |
| **Order details** | Snapshot line items, status badge |
| **Admin products page** | Table, create/edit, success feedback |
| **Admin product form** | Validation rules |
| **Error states** | ApiErrorPanel variant selection |
| **Demo mode badge** | Shown/hidden when mock API enabled |
| **MSW handlers** | Demo auth, catalog stock, checkout flow (`tests/mocks/`) |

### API client tests (`tests/api/`)

| Area | Tests |
|---|---|
| **HTTP client** | URL building, auth header, status mapping, network vs HTTP errors |
| **Auth API** | Login/register/me request bodies and paths |
| **Products API** | List, details, 404 handling |
| **Cart / checkout / orders API** | Cart mutations, checkout conflict, order endpoints |

### E2E smoke (`tests/e2e/smoke.spec.ts`)

| Scenario | Validates |
|---|---|
| Home page | Portfolio intro and skip link |
| `/products` | Catalog heading and navigation |
| `/login` | Sign-in form fields |
| Unknown route | 404 page with recovery link |

E2E stays smoke-focused — it validates route availability and core shell rendering. It does **not** replace feature tests for cart, checkout, or authenticated flows, and does not require a live backend.

## E2E requirements (local)

```bash
npx playwright install   # first run only
npm run test:e2e
```

Playwright starts the Vite dev server automatically. No `.env` or live API is required for the current smoke specs.

## Test quality rules

- Prefer user-facing queries: `getByRole`, `getByLabelText`, `getByText`.
- Avoid testing implementation details or brittle class names.
- Keep fixtures deterministic (`tests/fixtures/apiFixtures.ts`).
- Disable query retry in tests (`retry: false`) for predictable async behavior.
- Clear `localStorage` in tests that depend on auth token state.

## CI gate

GitHub Actions runs `npm ci`, `typecheck`, `lint`, `test`, and `build` on every push/PR to `main`. **CI does not require a live backend.** E2E smoke tests are optional/local and are not part of the CI workflow.

Demo/mock mode supports frontend review without the API; live manual scenarios are documented in [MANUAL_TEST_SCENARIOS.md](MANUAL_TEST_SCENARIOS.md).

## Adding tests for new features

1. Add unit tests for schemas, mappers, and pure helpers.
2. Add component tests for new UI pieces with mocked props or queries.
3. Add feature tests that mock `smartMarketApi` and exercise the full page or hook.
4. Add one E2E smoke step only if the journey is user-critical and not covered elsewhere.
