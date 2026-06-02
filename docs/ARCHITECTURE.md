# Architecture — SmartMarket Lite Web Client

## Purpose

SmartMarket Lite Web Client is an API-connected e-commerce frontend. It implements a catalog → cart → checkout → orders flow against an existing ASP.NET Core backend.

## Frontend-only boundary

This repository contains frontend code only. It defines TypeScript API clients, request/response DTOs, test fixtures, and UI mocks. It does not implement backend services, databases, migrations, server-side authentication, or API controllers.

## Tech stack

- React 19 + TypeScript (strict mode)
- Vite
- React Router 7
- TanStack Query 5
- React Hook Form + Zod
- Tailwind CSS
- Vitest + Testing Library
- Playwright (E2E smoke)

## Application bootstrap

```text
main.tsx
  └── App
        └── AppProviders
              ├── QueryClientProvider
              ├── BrowserRouter
              └── AuthProvider
                    └── AppRoutes (router.tsx)
```

`AppProviders` centralizes server-state defaults (query retry, refetch behavior) and authentication context. All routed pages render inside `AppLayout`, which provides navigation, skip link, and main content landmark.

## Source structure

```text
src/
  app/                 App shell, router, providers
  api/                 HTTP client (httpClient.ts) and endpoint map (smartMarketApi.ts)
  components/
    ui/                Reusable primitives (Button, etc.)
    layout/            AppLayout, AppNav, SkipLink
    feedback/          Loading, empty, error, forbidden, conflict, not-found states
  features/            Domain modules (auth, products, cart, checkout, orders, adminProducts)
  hooks/               Shared hooks (cache invalidation)
  lib/                 env, auth token storage, API error helpers
  pages/               Route entry re-exports (thin wrappers to feature pages)
  styles/              Global CSS and Tailwind entry
  types/               Shared API DTOs (api.ts)
  mocks/               MSW handlers, demo store, seed data (demo mode only)
```

## Feature module pattern

Each feature folder owns its UI, hooks, schemas, and query keys:

```text
features/products/
  components/          ProductCard, filters, ProductDetailsStates, AddToCartPanel
  hooks/               useProductsQuery, useProductQuery, cart mutations
  pages/               ProductCatalogPage, ProductDetailsPage
  schemas/             Validation for catalog filters and admin product forms
  productQueryKeys.ts  TanStack Query key factory
```

Other feature modules follow the same layout:

| Module | Key pages | Responsibilities |
|---|---|---|
| `auth` | Login, Register | Session, route guards, nav user bar |
| `cart` | CartPage | Item list, quantity forms, summary, clear |
| `checkout` | CheckoutPage | Order placement, conflict handling |
| `orders` | OrdersPage, OrderDetailsPage | History list, snapshot line items |
| `adminProducts` | AdminProductsPage | CRUD table, form, status toggle |

Components stay data-agnostic where possible. Data fetching lives in hooks that call `smartMarketApi`. Route guards (`ProtectedRoute`, `GuestRoute`, `AdminRoute`) live under `features/auth`.

## Routing

| Path | Access | Implementation |
|---|---|---|
| `/` | Public | Home page with feature overview |
| `/products` | Public | Product catalog with search, filters, pagination |
| `/products/:id` | Public | Product details with add-to-cart panel |
| `/login`, `/register` | Guest only | Auth forms with server error mapping |
| `/cart` | Authenticated | Cart items, quantity update, summary |
| `/checkout` | Authenticated | Checkout summary and place-order action |
| `/orders`, `/orders/:id` | Authenticated | Order history and detail with price snapshots |
| `/admin/products` | Admin | Product table, create/edit form, activate/deactivate |
| `*` | Public | Not found page |

## Data and state

**Server state** — TanStack Query caches API responses. Query keys are namespaced per feature (`products`, `cart`, `orders`, `auth/me`).

**Authentication** — JWT stored in `localStorage` under `smartmarket.auth.token`. The HTTP client attaches `Authorization: Bearer …` automatically. `AuthProvider` loads the current user on startup when a token exists.

**Cache invalidation** — `src/hooks/cacheInvalidation.ts` centralizes invalidation rules:

- Cart mutations invalidate cart queries.
- Checkout invalidates **cart**, **orders**, and **product catalog/detail** queries (so stock badges refresh after purchase).
- Admin product changes invalidate product queries (and product detail when editing).
- Logout clears auth and cart cache entries.

## MSW demo architecture

When `VITE_USE_MOCK_API=true` in development (`src/main.tsx`):

1. MSW browser worker starts before React render (`src/mocks/browser.ts`).
2. Handlers in `src/mocks/handlers.ts` intercept the same `/api/*` paths as `smartMarketApi`.
3. In-memory state in `src/mocks/store.ts` simulates users, products, carts, and orders.
4. The **same** `httpClient` and `smartMarketApi` are used — no alternate client for demo mode.
5. `onUnhandledRequest: 'bypass'` allows non-API assets to load normally.

Live mode (`VITE_USE_MOCK_API=false`) sends requests to the SmartMarket Lite API (direct URL or Vite proxy). MSW is not started in production builds.

See [DEMO_MODE.md](DEMO_MODE.md) and [API_INTEGRATION.md](API_INTEGRATION.md).

**Forms** — React Hook Form with Zod resolvers. Server validation errors map to fields via `applyFormServerErrors`.

**UI errors** — API failures normalize to `ApiClientError`. `getUiErrorPresentation` and `ApiErrorPanel` map HTTP semantics (401, 403, 404, 409, network) to consistent feedback components.

## Architecture principles

- Feature folders own feature-specific UI and behavior.
- Reusable UI components remain data-agnostic.
- API calls are isolated in `src/api/` — no direct `fetch` in visual components.
- Forms use typed validation schemas shared between client and test layers.
- Server state and local UI state are kept separate.
- Loading, empty, error, and success states are first-class UI concerns.

## Quality gates

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```
