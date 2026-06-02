# CI — SmartMarket Lite Web Client

## Purpose

The CI workflow is configured to validate that the frontend installs, typechecks, lints, tests, and builds from a clean checkout on every push and pull request to `main`. It does not require a live backend.

## Workflow

File: `.github/workflows/ci.yml`

Trigger:

- Push to `main`
- Pull requests targeting `main`

```text
checkout
  → setup Node.js 20 (npm cache enabled)
  → npm ci
  → npm run typecheck
  → npm run lint
  → npm run test
  → npm run build
```

## Job details

| Step | Command | Failure means |
|---|---|---|
| Install | `npm ci` | Lock file mismatch or dependency resolution failure |
| Typecheck | `npm run typecheck` | TypeScript errors |
| Lint | `npm run lint` | ESLint errors or warnings (`--max-warnings=0`) |
| Test | `npm run test` | Vitest unit/component/feature failure |
| Build | `npm run build` | Type error or Vite production build failure |

## Dependency policy

- `package-lock.json` is committed and required.
- CI always uses `npm ci` for deterministic installs.
- Do not commit `node_modules`.

## What CI does not run (yet)

| Check | Status | Notes |
|---|---|---|
| Playwright E2E | Manual / local | Smoke specs do not require a live backend; not part of CI workflow |
| Coverage thresholds | Not configured | Tests run without enforced coverage gates |

To run E2E locally before merge:

```bash
npx playwright install
npm run test:e2e
```

## Artifact policy

Generated output must not be committed:

- `dist/`
- `coverage/`
- `playwright-report/`
- `test-results/`
- `reports/`

CI may upload these as workflow artifacts in future if coverage or E2E reports are added.

## Branch protection recommendation

For portfolio review quality, protect `main` with:

- Required status check: **Frontend CI / build-test**
- Require pull request reviews (optional)
- Disallow force-push to `main`

## Local parity

Reproduce CI locally:

```bash
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
```

Use the same Node major version as CI (22) to avoid environment drift.
