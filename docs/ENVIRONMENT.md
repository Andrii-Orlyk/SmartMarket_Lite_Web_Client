# Environment — SmartMarket Lite Web Client

## Required tools

- Node.js 20 LTS (matches CI)
- npm 10+

## Environment files

| File | Committed | Purpose |
|---|---|---|
| `.env.example` | Yes | Public template for reviewers |
| `.env` | No (gitignored) | Local overrides |

Copy before running:

```bash
cp .env.example .env
```

Restart the Vite dev server after changing any `VITE_*` variable.

## Variables

| Variable | Required | Default in `.env.example` | Purpose |
|---|---|---|---|
| `VITE_USE_MOCK_API` | Recommended | `true` | `true` = MSW demo/mock API in development; `false` = live SmartMarket Lite API |
| `VITE_SMARTMARKET_API_BASE_URL` | Recommended (live mode) | `http://localhost:5000` | Primary API base URL |
| `VITE_API_BASE_URL` | Optional | `http://localhost:5000` | Generic fallback if project variable is empty |
| `VITE_APP_ENV` | Optional | `development` | Environment label |

## Demo mode

```text
VITE_USE_MOCK_API=true
```

- MSW intercepts `/api/*` in development.
- No SmartMarket Lite API process required.
- Demo users: see [DEMO_MODE.md](DEMO_MODE.md).

## Live API mode

```text
VITE_USE_MOCK_API=false
VITE_SMARTMARKET_API_BASE_URL=http://localhost:5000
```

- Start SmartMarket Lite API separately on port 5000.
- MSW is not started.

## Resolution order (`getApiBaseUrl`)

Implemented in `src/lib/env.ts`:

1. `VITE_SMARTMARKET_API_BASE_URL`
2. `VITE_API_BASE_URL`
3. `http://localhost:5000` (production fallback when neither is set)

Trailing slashes are stripped.

## Development proxy (CORS)

When the configured API URL is `http://localhost:5000` or `http://127.0.0.1:5000`, development uses a same-origin Vite proxy:

```text
Browser  →  http://localhost:5173/api/...
Vite proxy  →  http://localhost:5000/api/...
```

This avoids browser CORS failures in live mode. Restart `npm run dev` after changing `.env`.

## MSW worker

`public/mockServiceWorker.js` is committed for MSW browser mode. It is used only when `VITE_USE_MOCK_API=true` in development.

## Rules

- Do not commit `.env` or secrets.
- Commit `.env.example` as the public template.
- `npm run preview` does not enable MSW — use `npm run dev` for demo mode.
