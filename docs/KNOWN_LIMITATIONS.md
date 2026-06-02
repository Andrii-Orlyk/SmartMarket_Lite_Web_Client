# Known Limitations — SmartMarket Lite Web Client

## Runtime and integration

- **Frontend client only.** Backend business logic, databases, and authentication implementation live in the separate SmartMarket Lite API project.
- **Live API mode** requires SmartMarket Lite API running separately (default `http://localhost:5000`) for real catalog, cart, checkout, orders, and admin data.
- **Demo mode** (`VITE_USE_MOCK_API=true`) uses MSW and fake in-memory data so reviewers can run the full UI without a backend. Demo mode does **not** replace final live integration testing.
- **Checkout in live mode** depends on backend responses for stock validation and order creation. The frontend displays API state and maps errors; the backend remains responsible for final inventory consistency.
- **E2E in CI** is not required. Playwright smoke tests are optional/local. One live-auth spec is skipped unless `SMARTMARKET_LIVE_API=1` and credentials are provided.
- **No real payment provider** (Stripe, PayPal, etc.). Checkout creates a **Pending** order — not a completed payment.
- **Customer-side order cancellation is not included.** Pending orders show store-administration messaging; there is no customer cancel action in this frontend.
- **Stock and availability in live mode** follow API responses. The frontend refetches products after checkout. If the backend does not reduce stock, the UI may still show items as purchasable until the API returns updated quantities.

## Intentional scope boundaries

- **Admin product management** is portfolio-scope catalog CRUD, not a full back-office suite. Admin order management UI is not implemented (API client types exist for future use only).
- **Authentication** uses `localStorage` token persistence suitable for portfolio/demo scope, not hardened production security.
- **No production deployment** pipeline in this repository (no hosting, CDN, or environment-specific deploy config).
- **Designed as a portfolio frontend client**, not a production SaaS storefront.
- No backend source code (`.cs`, SQL, migrations) in this repository.
