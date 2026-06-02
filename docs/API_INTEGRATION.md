# API Integration — SmartMarket Lite Web Client

## Backend target

**SmartMarket Lite API** — ASP.NET Core REST service (external to this repository).

Default local URL:

```text
http://localhost:5000
```

Configure via environment variable (see [ENVIRONMENT.md](ENVIRONMENT.md)). In local development, the Vite dev server proxies `/api` to the configured backend URL to avoid browser CORS failures.

## Integration modes

### 1. Mock/demo API mode

When `VITE_USE_MOCK_API=true` in development, [MSW](https://mswjs.io/) intercepts the same `/api/*` paths the client uses. Handlers live in `src/mocks/` and simulate auth, catalog, cart, checkout, orders, and admin products with in-memory state.

- Same `smartMarketApi` and `httpClient` as live mode — no duplicate client.
- Checkout creates Pending orders, snapshots line items, decreases mock stock, and clears the cart.
- Demo credentials: see [DEMO_MODE.md](DEMO_MODE.md).
- Header shows **Demo mode** when active.

Mock mode is for portfolio review and frontend testing without a backend. It does not replace full-stack validation.

### 2. Live API mode

When `VITE_USE_MOCK_API=false`, requests go to the SmartMarket Lite API at `VITE_SMARTMARKET_API_BASE_URL`. MSW is not started.

Before release or full-stack sign-off, run live mode with the API running to catch contract or integration issues mock mode cannot surface.

## Environment configuration

Copy `.env.example` to `.env`:

```text
VITE_SMARTMARKET_API_BASE_URL=http://localhost:5000
VITE_API_BASE_URL=http://localhost:5000
VITE_USE_MOCK_API=true
VITE_APP_ENV=development
```

`getApiBaseUrl()` also accepts `VITE_API_BASE_URL` as an alias. Trailing slashes are stripped automatically. When no variable is set, the client falls back to `http://localhost:5000`.

## Client architecture

```text
Component / hook
  └── smartMarketApi.{domain}.{method}()
        └── apiRequest() in httpClient.ts
              └── fetch(baseUrl + path)
```

- **`httpClient.ts`** — Builds URLs, sets JSON headers, attaches bearer token, parses JSON safely, throws `ApiClientError` on failure.
- **`smartMarketApi.ts`** — Typed endpoint map grouped by domain. This is the only module feature code should import for HTTP calls.
- **`lib/authToken.ts`** — Reads/writes `smartmarket.auth.token` in `localStorage`.
- **`lib/apiErrors.ts`** — Normalizes API and network failures into `ApiClientError`.

Pass `token: null` on unauthenticated endpoints (login, register) to skip the stored token.

## Endpoint map

| Domain | Methods | Path prefix |
|---|---|---|
| Auth | register, login, me | `/api/auth` |
| Products | list, getById | `/api/products` |
| Admin products | create, update, remove | `/api/admin/products` |
| Cart | get, addItem, updateItem, removeItem, clear | `/api/cart` |
| Checkout | create | `/api/checkout` |
| Orders | list, getById | `/api/orders` |
| Admin orders | list, updateStatus | `/api/admin/orders` |

Query parameters for product list: `search`, `minPrice`, `maxPrice`, `page`, `pageSize`.

**Note:** `smartMarketApi.adminOrders` is typed in the client for API completeness. There is no admin orders UI page in this frontend — only admin product management is implemented.

## DTO coverage

Defined in `src/types/api.ts`:

| Type | Purpose |
|---|---|
| `AuthResponse` | Login/register token payload |
| `CurrentUserDto` | Authenticated user profile and role |
| `ProductDto`, `ProductFormValues` | Catalog and admin product forms |
| `PagedResult<T>` | Paginated list responses |
| `CartDto`, `CartItemDto` | Shopping cart |
| `AddCartItemRequest`, `UpdateCartItemRequest` | Cart mutations |
| `CheckoutResponse` | Checkout result |
| `OrderDto`, `OrderItemDto` | Order history with price/name snapshots |
| `ApiErrorResponse` | Standard API error body |

Order items use snapshot fields (`productNameSnapshot`, `unitPriceSnapshot`) so historical prices remain stable after catalog changes.

## Error handling

API errors normalize to `ApiClientError` with `error.code`, `error.message`, `error.httpStatus`, and `error.errors[]`.

| HTTP | Typical code | UI behavior |
|---|---|---|
| 400 | `validation.failed` | Field or form-level validation message |
| 401 | `auth.unauthorized` | Session expired message; redirect to login |
| 403 | `auth.forbidden` | Forbidden / access denied state |
| 404 | `product.not_found`, etc. | Not found state with recovery action |
| 409 | `checkout.product_unavailable`, etc. | Conflict state with business message |
| Network failure | `network.unavailable` | Retryable connection error |

`getUiErrorPresentation()` selects the feedback variant. `ApiErrorPanel` renders the matching component (`ErrorState`, `ForbiddenState`, `NotFoundState`, `ConflictState`).

## Business messages (frontend mapping)

The UI maps common API conflict and validation messages via `businessErrorMessages.ts` and `getUiErrorPresentation()`, including:

- Out of stock / **Not enough stock available.**
- **This product is no longer available.**
- **Your cart is empty** (checkout guard)
- Pending order status (checkout does not imply payment completed)

The frontend displays backend or mock responses. In live mode, stock and checkout rules are enforced by the SmartMarket Lite API.

## Cache coordination

After mutations, TanStack Query caches invalidate through helpers in `src/hooks/cacheInvalidation.ts`:

- Cart changes → cart queries
- Checkout → cart, orders, and **product catalog/detail** queries
- Admin product CRUD → product queries (and edited product detail)
- Logout → auth user and cart cache cleared

## Integration rules

- No direct `fetch` or hardcoded API URLs in components.
- All request/response shapes use shared TypeScript types.
- Components consume hooks; hooks call `smartMarketApi`.
- Error states must be visible — silent failures are not acceptable for user-facing flows.

## Testing without a live backend

Unit and feature tests mock `smartMarketApi` or `fetch` at the client boundary. Contract fixtures in `tests/fixtures/apiFixtures.ts` provide deterministic DTO samples. E2E smoke tests run against the Vite dev server with mocked or unavailable API responses for public routes.

## Integration summary

- Typed client covers auth, products, admin products, cart, checkout, and orders
- Environment-based base URL with demo and live modes
- Bearer token attached to authenticated requests
- Normalized error model with UI mapping
- Cache invalidation after cart, checkout (cart, orders, products), and admin mutations
- Feature pages consume API responses through hooks and `smartMarketApi`
