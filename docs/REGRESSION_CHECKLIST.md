# Regression Checklist — SmartMarket Lite Web Client

Use before portfolio release or after significant frontend changes.

## Automated (CI / local)

| Area | Check | Status type |
|---|---|---|
| **Quality** | `npm ci`, typecheck, lint, test, build | Automated |
| **Quality** | CI workflow configured (install, typecheck, lint, test, build) | Automated (GitHub Actions after publish) |
| **Quality** | `bash -n scripts/*.sh` | Automated (release gate) |

## Demo mode (MSW, no backend)

| Area | Check | Status type |
|---|---|---|
| **Demo** | Sign in as customer / admin with demo credentials | Manual demo |
| **Demo** | Catalog shows Available / Out of stock / Unavailable | Manual demo |
| **Demo** | Checkout creates Pending order and clears cart | Manual demo + MSW tests |
| **Demo** | Header shows Demo mode when mock enabled | Automated (badge test) |

## Live API (SmartMarket Lite API required)

| Area | Check | Status type |
|---|---|---|
| **Auth** | Login with valid credentials | Automated + Manual live |
| **Auth** | Register new user | Manual live |
| **Auth** | Logout clears session | Manual live |
| **Auth** | Protected route redirects guest | Automated |
| **Auth** | Admin route blocks non-admin | Automated |
| **Auth** | Invalid credentials message | Automated |
| **Auth** | Server offline connection message | Automated + Manual live |
| **Catalog** | Products list loads | Automated + Manual live |
| **Catalog** | Product details page | Automated |
| **Catalog** | Loading / empty / error states | Automated |
| **Catalog** | Search and filters | Automated (catalog page) |
| **Cart** | Add to cart | Automated |
| **Cart** | Update quantity | Automated |
| **Cart** | Remove item | Automated |
| **Cart** | Clear cart | Manual live |
| **Cart** | Totals render correctly | Automated |
| **Checkout** | Success flow / redirect | Automated + Manual live |
| **Checkout** | Empty cart guard | Automated |
| **Checkout** | Unavailable product / conflict | Automated |
| **Orders** | Order list | Automated |
| **Orders** | Order details snapshots | Automated |
| **Orders** | Order not found | Automated |
| **Admin** | Product list (admin) | Automated |
| **Admin** | Create / edit product | Automated + Manual live |
| **Admin** | Form validation | Automated |
| **Admin** | Non-admin forbidden | Automated |
| **Quality** | Responsive desktop/mobile | Manual live |
| **Quality** | Loading / empty / error states | Automated |
| **Quality** | Basic keyboard navigation | Manual live |
| **Quality** | No console errors on main flows | Manual live |
| **Quality** | Docs updated | Manual review |

## Quick verification commands

```bash
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
```

Optional E2E (no live backend required for app smoke):

```bash
npx playwright install
npm run test:e2e
```

Optional live auth smoke (backend required):

```bash
SMARTMARKET_LIVE_API=1 SMARTMARKET_TEST_EMAIL=user@example.com SMARTMARKET_TEST_PASSWORD=secret npm run test:e2e -- tests/e2e/live-auth-smoke.spec.ts
```

See [MANUAL_TEST_SCENARIOS.md](MANUAL_TEST_SCENARIOS.md) for step-by-step live scenarios.
