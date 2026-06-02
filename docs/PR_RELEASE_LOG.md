# PR Release Log — SmartMarket Lite Web Client

Records what each release milestone delivers for portfolio review.

---

## v0.1.0 — Project foundation

**Status:** Completed

**Scope:** Vite + TypeScript + Tailwind toolchain, `AppProviders`, base app entry, initial docs.

**Verification:** `npm ci`, typecheck, lint, test, build.

**Reviewer value:** Clean, reproducible frontend foundation.

---

## v0.2.0 — Routing and layout

**Status:** Completed

**Scope:** Full route map, `AppLayout`, `AppNav`, home page, 404 page, route entry structure for features.

**Verification:** Layout component tests, E2E route smoke, build.

**Reviewer value:** Application structure and navigation are visible early.

---

## v0.3.0 — API client and environment

**Status:** Completed

**Scope:** `httpClient`, `smartMarketApi`, shared DTOs, `ApiClientError` normalization, environment-based base URL.

**Verification:** HTTP client unit tests, typecheck, build.

**Reviewer value:** Typed integration discipline before feature UI is complete.

---

## v0.4.0 — Authentication flow

**Status:** Completed

**Scope:** Login/register forms, JWT session storage, `AuthProvider`, `ProtectedRoute`, `GuestRoute`, `AdminRoute`, nav user bar.

**Verification:** Auth form tests, route guard tests, build.

**Reviewer value:** Realistic app-level auth and access control.

---

## v0.5.0 — Core feature pages

**Status:** Completed

**Scope:** Product catalog, product details, cart, checkout, orders, admin products.

**Verification:** Feature page tests; mutation hook tests; build.

**Reviewer value:** Full shopping flow from browse to order confirmation, plus admin catalog management.

---

## v0.6.0 — Forms, validation and UI states

**Status:** Completed

**Scope:** Zod schemas, `applyFormServerErrors`, shared feedback components, `FeatureQueryStates`, `ApiErrorPanel`.

**Verification:** Schema unit tests, feedback component tests, error presentation tests.

**Reviewer value:** Validation and failure modes are designed, not bolted on.

---

## v0.7.0 — Responsive UI and UX polish

**Status:** Completed

**Scope:** Responsive breakpoints, touch targets, skip link, focus-visible styles, reduced motion.

**Verification:** Layout component tests, E2E smoke, manual responsive review.

**Reviewer value:** Portfolio demo on mobile and desktop.

---

## v0.8.0 — Automated tests

**Status:** Completed

**Scope:** Unit, component, feature, and API client tests with mocked boundaries; Playwright E2E smoke for public routes.

**Verification:** Full Vitest suite passes locally; E2E runnable locally.

**Reviewer value:** Regression discipline across client, UI states, and critical flows.

---

## v0.9.0 — CI, scripts, demo/live runtime

**Status:** Completed

**Scope:** GitHub Actions CI workflow, `doctor` and `clean` scripts, MSW demo mode, runbook and integration docs.

**Verification:** CI workflow configured (install, typecheck, lint, test, build). Local gate matches CI steps.

**Reviewer value:** Install, verify, and understand without tribal knowledge.

---

## v1.0.0 — Public portfolio release

**Status:** Completed

**Scope:** Final public documentation sync, demo vs live mode clarity, release hygiene for GitHub and ZIP distribution.

**Local verification:**

```bash
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
bash -n scripts/*.sh
```

**Optional:**

```bash
npm run test:e2e
```

**Results:** All required local gates passed. E2E app smoke: 9 passed, 1 skipped (live-auth; requires live API and credentials).

**CI note:** GitHub Actions workflow is configured to run the same deterministic checks on push/PR to `main`. Confirm green runs on GitHub after the repository is published.

**Artifact policy:** Generated artifacts (`node_modules`, `dist`, coverage, Playwright reports, `.env`) are not committed.

**Reviewer value:** Portfolio-ready frontend client with honest scope in [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md).
