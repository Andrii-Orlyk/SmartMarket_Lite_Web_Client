# Roadmap — SmartMarket Lite Web Client

Portfolio milestone history. See [PR_RELEASE_LOG.md](PR_RELEASE_LOG.md) for verification notes.

## v0.1.0 — Frontend project foundation

**Status:** Completed

**Scope:**

- Vite, TypeScript, Tailwind, ESLint, Vitest, Playwright toolchain
- Base app shell (`App`, `AppProviders`, router entry)
- Initial public documentation

## v0.2.0 — Routing and layout

**Status:** Completed

**Scope:**

- Full route map and 404 page
- `AppLayout`, `AppNav`, skip link
- Home page and thin route entry wrappers

## v0.3.0 — API client and environment configuration

**Status:** Completed

**Scope:**

- `httpClient` and `smartMarketApi`
- Shared DTOs and `ApiClientError` normalization
- Environment-based API base URL and dev proxy

## v0.4.0 — Authentication and route guards

**Status:** Completed

**Scope:**

- Login and register forms
- JWT session storage and `AuthProvider`
- `ProtectedRoute`, `GuestRoute`, `AdminRoute`

## v0.5.0 — E-commerce feature pages

**Status:** Completed

**Scope:**

- Product catalog (search, filters, pagination)
- Product details with add-to-cart
- Cart, checkout, orders list and order details
- Admin product management (create, edit, activate/deactivate)

## v0.6.0 — Forms, validation, and UI states

**Status:** Completed

**Scope:**

- Zod schemas and `applyFormServerErrors`
- Shared feedback components (`FeatureQueryStates`, `ApiErrorPanel`)
- Loading, empty, error, forbidden, conflict, and not-found states

## v0.7.0 — Responsive UI and accessibility baseline

**Status:** Completed

**Scope:**

- Responsive breakpoints (360–1280px)
- Mobile navigation and touch targets
- Accessibility baseline (landmarks, focus-visible, reduced motion)

## v0.8.0 — Automated tests

**Status:** Completed

**Scope:**

- Unit, component, feature, and API client tests (mocked boundaries)
- MSW handler integration tests
- Playwright E2E smoke for public routes

Automated tests cover unit, component, feature, API/mock, and E2E smoke layers. See [TESTING.md](TESTING.md) for current scope.

## v0.9.0 — CI, scripts, demo/live runtime docs

**Status:** Completed

**Scope:**

- GitHub Actions CI workflow (install, typecheck, lint, test, build; no live backend)
- `doctor` and `clean` scripts
- MSW demo mode (`src/mocks/`, `VITE_USE_MOCK_API`, demo credentials)
- Runbook, API integration, demo mode, and testing documentation

## v1.0.0 — Public portfolio release

**Status:** Completed

**Scope:**

- Final public documentation sync (README, environment, architecture, API integration, limitations, testing, CI)
- Demo mode and live API mode documented for reviewers
- Release verification: `npm ci`, typecheck, lint, test, build, shell script syntax
