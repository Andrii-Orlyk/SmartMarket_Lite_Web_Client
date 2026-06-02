# Demo Mode — SmartMarket Lite Web Client

Demo mode lets reviewers run the full frontend without starting the SmartMarket Lite API. It uses [MSW](https://mswjs.io/) to intercept the same `/api/*` routes the real client calls.

## Enable demo mode

1. Install dependencies and copy environment template:

```bash
npm ci
cp .env.example .env
```

2. Set:

```text
VITE_USE_MOCK_API=true
```

3. Start the dev server:

```bash
npm run dev
```

Or:

```bash
npm run dev:mock
```

A **Demo mode** label appears in the header when mock API is active.

## Demo credentials

| Role | Email | Password |
|---|---|---|
| Customer | `customer@smartmarket.dev` | `Password123!` |
| Admin | `admin@smartmarket.dev` | `Password123!` |

These accounts exist only in mock data. Do not use them as real credentials.

## What you can test

- Sign in and register (duplicate email returns 409)
- Product catalog with Available, Out of stock, and Unavailable products
- Add to cart, update quantity, remove items, clear cart
- Checkout creates a **Pending** order, clears the cart, and reduces mock stock
- Order history and order details with price/name snapshots
- Admin product create, edit, activate/deactivate

## Mock stock behavior

Checkout in demo mode simulates expected e-commerce behavior for frontend review:

1. Validates cart is not empty
2. Validates stock and active status
3. Creates a Pending order with snapshots
4. Decreases `stockQuantity` on mock products
5. Clears the cart

If stock reaches zero after checkout, the catalog shows **Out of stock** on refetch.

This is frontend demo logic only, not production backend inventory.

## Live API mode

To connect to the real SmartMarket Lite API:

1. Start the API on port 5000
2. Set in `.env`:

```text
VITE_USE_MOCK_API=false
VITE_SMARTMARKET_API_BASE_URL=http://localhost:5000
```

3. Run:

```bash
npm run dev:live
```

Run live mode before final full-stack validation. Mock mode does not replace integration testing against the real API.

## Limitations

- MSW runs in **development** only (`npm run dev` / `dev:mock`). `npm run preview` does not enable mock API.
- Mock data is fake and resets when the dev server restarts (in-memory store).
- This is frontend demo/testing logic, not production backend behavior.

## Tests

Mock handlers are covered in `tests/mocks/mock-handlers.test.ts` using MSW Node. These tests do not require a running backend.
