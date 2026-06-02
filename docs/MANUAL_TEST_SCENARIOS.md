# Manual Test Scenarios — SmartMarket Lite Web Client

Structured manual scenarios for release confidence. Use **demo mode** for frontend-only review or **live API** for full-stack integration.

## Demo mode (no backend)

| Item | Value |
|---|---|
| Env | `VITE_USE_MOCK_API=true` in `.env` |
| Start | `npm run dev:mock` |
| Customer | `customer@smartmarket.dev` / `Password123!` |
| Admin | `admin@smartmarket.dev` / `Password123!` |

See [DEMO_MODE.md](DEMO_MODE.md) for catalog stock scenarios (in stock, one left, out of stock, inactive) and checkout flow.

## Live API mode

Automated coverage is listed where it exists; live checks require the SmartMarket Lite API at `http://localhost:5000` and `VITE_USE_MOCK_API=false`.

## 1. Environment setup (live)

| Item | Value |
|---|---|
| Frontend dev server | `npm run dev` → `http://localhost:5173` |
| Backend API | SmartMarket Lite API → `http://localhost:5000` |
| Environment file | Copy `.env.example` to `.env` |
| Primary env variable | `VITE_SMARTMARKET_API_BASE_URL=http://localhost:5000` |

In development, the Vite dev server proxies `/api` to the backend to avoid browser CORS blocks when using the default local API URL.

## 2. Required backend state

- API process running and reachable on port 5000
- At least one active product with stock for cart/checkout scenarios
- One standard user account for auth/cart/orders
- One admin user account for admin product scenarios

## 3. Test users

| Role | Purpose |
|---|---|
| Standard user | Catalog, cart, checkout, orders |
| Admin user | `/admin/products` management |
| New email | Registration and duplicate-email negative tests |

Use credentials from your SmartMarket Lite API seed data or register test users before manual runs.

---

## Auth scenarios

### SM-WEB-AUTH-001 — User can sign in with valid credentials

| Field | Detail |
|---|---|
| Preconditions | API running; user exists |
| Steps | 1. Open `/login` 2. Enter email 3. Enter password 4. Click Sign in |
| Expected result | Redirect to `/products`; authenticated navigation visible |
| Automation status | Automated in `tests/feature/auth-errors.test.tsx`, `tests/api/authApi.test.ts` |
| Manual live check | Recommended before release |

### SM-WEB-AUTH-002 — Invalid credentials show auth message

| Field | Detail |
|---|---|
| Preconditions | API running |
| Steps | Sign in with wrong password |
| Expected result | Form shows **Invalid email or password.** (not generic network error) |
| Automation status | Automated in `tests/feature/auth-errors.test.tsx` |
| Manual live check | Recommended |

### SM-WEB-AUTH-003 — Backend offline during sign in

| Field | Detail |
|---|---|
| Preconditions | API stopped |
| Steps | Attempt sign in |
| Expected result | **Unable to reach the server. Check your connection and try again.** |
| Automation status | Automated in `tests/feature/auth-errors.test.tsx` |
| Manual live check | Recommended |

### SM-WEB-AUTH-004 — Duplicate email on register

| Field | Detail |
|---|---|
| Preconditions | API running; email already registered |
| Steps | Register with existing email |
| Expected result | **Email is already registered.** |
| Automation status | Automated in `tests/feature/auth-errors.test.tsx` |
| Manual live check | Recommended |

### SM-WEB-AUTH-005 — Logout clears session

| Field | Detail |
|---|---|
| Preconditions | Signed-in user |
| Steps | Click Sign out |
| Expected result | Token cleared; protected routes redirect to login |
| Automation status | Partial — route guards in `tests/feature/protected-route.test.tsx` |
| Manual live check | Required |

---

## Catalog scenarios

### SM-WEB-CAT-001 — Product catalog loads

| Field | Detail |
|---|---|
| Preconditions | API running with products |
| Steps | Open `/products` |
| Expected result | Product cards visible with name, SKU, price |
| Automation status | Automated in `tests/feature/products-catalog.test.tsx` |
| Manual live check | Recommended |

### SM-WEB-CAT-002 — Product details and add to cart

| Field | Detail |
|---|---|
| Preconditions | Signed-in user; active in-stock product |
| Steps | Open product details; add quantity; submit |
| Expected result | Success feedback; cart updated |
| Automation status | Automated in `tests/feature/product-details.test.tsx` |
| Manual live check | Recommended |

### SM-WEB-CAT-003 — Unknown product

| Field | Detail |
|---|---|
| Preconditions | API running |
| Steps | Open `/products/unknown-id` |
| Expected result | Not found state with recovery action |
| Automation status | Automated in `tests/feature/product-details-states.test.tsx` |
| Manual live check | Optional |

---

## Cart scenarios

### SM-WEB-CART-001 — User adds available product to cart

| Field | Detail |
|---|---|
| Preconditions | API running; signed-in user; available product |
| Steps | Open product details; add to cart |
| Expected result | Cart quantity updates from backend response |
| Automation status | Automated in `tests/feature/product-details.test.tsx`, `tests/api/cartApi.test.ts` |
| Manual live check | Recommended |

### SM-WEB-CART-002 — User cannot exceed available stock

| Field | Detail |
|---|---|
| Preconditions | Cart with at least one item |
| Steps | Increase quantity beyond stock or until backend rejects |
| Expected result | UI shows "Not enough stock available." or prevents invalid quantity |
| Automation status | Automated in `tests/unit/businessErrorMessages.test.ts`, cart page tests |
| Manual live check | Recommended |

### SM-WEB-CART-003 — Cart page shows items and total

---

## Checkout scenarios

### SM-WEB-CHK-001 — User checks out available products

| Field | Detail |
|---|---|
| Preconditions | Signed-in user; non-empty cart; products available |
| Steps | Open `/checkout`; place order |
| Expected result | Order created as Pending; cart cleared; orders list includes new order; catalog/details refresh availability |
| Automation status | Automated in `tests/feature/checkout-page.test.tsx`, `tests/feature/checkout-consistency.test.tsx` |
| Manual live check | Required |

### SM-WEB-CHECKOUT-002 — Second checkout attempt for depleted stock

| Field | Detail |
|---|---|
| Preconditions | Signed-in user; empty cart |
| Steps | Open `/checkout` |
| Expected result | Empty state; checkout action unavailable |
| Automation status | Automated in `tests/feature/checkout-page.test.tsx` |
| Manual live check | Optional |

| Steps | After checkout, return to catalog or product details |
| Expected result | Add to cart disabled if stock is zero; checkout shows stock conflict if backend still allows stale cart |
| Automation status | Partial — conflict messages in `tests/unit/businessErrorMessages.test.ts` |
| Manual live check | Recommended |

### SM-WEB-CHK-003 — Checkout empty cart

| Field | Detail |
|---|---|
| Preconditions | Cart item becomes unavailable |
| Steps | Attempt checkout |
| Expected result | Conflict/business error shown |
| Automation status | Automated in `tests/feature/checkout-page.test.tsx` |
| Manual live check | Recommended |

---

## Orders scenarios

### SM-WEB-ORD-001 — User reviews pending order

| Field | Detail |
|---|---|
| Preconditions | Signed-in user with past orders |
| Steps | Open `/orders` |
| Expected result | Order status Pending; item snapshots use historical name/price |
| Automation status | Automated in `tests/feature/orders-page.test.tsx`, `tests/feature/order-details.test.tsx` |
| Manual live check | Recommended |

### SM-WEB-ORDER-002 — Customer cancellation behavior

| Field | Detail |
|---|---|
| Preconditions | Pending order exists |
| Steps | Open order details |
| Expected result | No customer cancel button; informational text about store administration |
| Automation status | Documented — no cancel endpoint in customer API |
| Manual live check | Recommended |

---

## Admin product scenarios

### SM-WEB-ADM-001 — Non-admin forbidden

| Field | Detail |
|---|---|
| Preconditions | Signed-in non-admin user |
| Steps | Open `/admin/products` |
| Expected result | Forbidden/access denied state |
| Automation status | Automated in `tests/feature/admin-route.test.tsx` |
| Manual live check | Recommended |

### SM-WEB-ADM-002 — Admin create/edit product

| Field | Detail |
|---|---|
| Preconditions | Signed-in admin user |
| Steps | Create product; edit product; toggle active state |
| Expected result | Table updates; success feedback |
| Automation status | Automated in `tests/feature/admin-products-page.test.tsx`, `tests/feature/admin-product-form.test.tsx` |
| Manual live check | Required |

---

## Negative scenarios (manual live recommended)

| ID | Scenario | Expected result |
|---|---|---|
| SM-WEB-NEG-001 | Backend offline during sign in | Connection message |
| SM-WEB-NEG-002 | Invalid login credentials | Invalid email or password |
| SM-WEB-NEG-003 | Duplicate email register | Email is already registered |
| SM-WEB-NEG-004 | Non-admin opens admin page | Forbidden state |
| SM-WEB-NEG-005 | Add inactive/out-of-stock product | Add blocked or business error |
| SM-WEB-NEG-006 | Checkout empty cart | Empty/guarded checkout |
| SM-WEB-NEG-007 | Unknown product route | Not found state |
| SM-WEB-NEG-008 | Unknown order route | Not found state |

## Evidence to collect (portfolio review)

- Screenshot or short recording of catalog → cart → checkout → order details
- Screenshot of admin product create/edit
- CI passing on latest commit
- Vitest summary showing automated test count
