# UI/UX — SmartMarket Lite Web Client

## UX purpose

The interface communicates a real e-commerce flow: browse products, manage a cart, check out, review orders, and (for admins) manage catalog items. Every major surface handles loading, empty, and error conditions clearly so the app feels reliable when the API is slow, unavailable, or replaced by MSW demo mode in development.

## Main user flows

| Flow | Route(s) | UI |
|---|---|---|
| Browse catalog | `/products` | Search, price filters, pagination, product cards |
| View product details | `/products/:id` | Product info panel, stock badge, add-to-cart with quantity |
| Sign in / register | `/login`, `/register` | Validated forms with server error mapping |
| Manage cart | `/cart` | Item rows with quantity forms, summary, clear cart, checkout link |
| Checkout | `/checkout` | Order summary, place-order action, 409 conflict handling, redirect to order |
| Order history | `/orders`, `/orders/:id` | Order list with status badges; detail with snapshot line items |
| Admin catalog | `/admin/products` | Product table, create/edit form, activate/deactivate toggle |

## Layout and navigation

- **App shell** — Sticky header with primary navigation, user bar, and mobile menu.
- **Skip link** — “Skip to main content” jumps to `#main-content` for keyboard users.
- **Active routes** — Nav links highlight the current section.
- **Mobile nav** — Collapsible menu with Escape-to-close and touch-friendly targets (`min-h-touch`, 44px).
- **Protected areas** — Unauthenticated users redirect to login; non-admin users see a forbidden state on admin routes.

## Required UI states

For every data-driven page:

| State | User expectation |
|---|---|
| Loading | Clear status message; no layout shift where possible |
| Empty | Explain why there is nothing to show; offer a next action |
| Error | Human-readable message; retry when appropriate |
| Success / confirmation | Confirm the action completed (checkout, save, etc.) |
| Pending action | Disable buttons and show in-progress label |
| Validation | Field-level errors adjacent to inputs |

Shared feedback components live in `src/components/feedback/`:

- `LoadingState`, `EmptyState`, `ErrorState`
- `ForbiddenState`, `NotFoundState`, `ConflictState`
- `ApiErrorPanel`, `FeatureQueryStates`, `SuccessBanner`

All feature pages use `FeatureQueryStates` or `ApiErrorPanel` for consistent loading, empty, and error handling.

## Visual system

- **Palette** — Slate neutrals on a light background (`#f8fafc`), dark primary actions (`slate-900`).
- **Shape** — Rounded cards and buttons (`rounded-xl`, `rounded-2xl`).
- **Typography** — Inter / system sans-serif stack.
- **Product cards** — Name, SKU, formatted price, stock badge (`In stock` / `Unavailable`).
- **Order status** — Color-coded badges for pending, confirmed, shipped, delivered, cancelled.

## Responsive behavior

Tailwind breakpoints:

| Token | Min width | Usage |
|---|---|---|
| `xs` | 360px | Small phones |
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Wide desktop |

Rules:

- Navigation collapses to a mobile menu below `md`.
- Product grids use responsive columns (1 → 2 → 3).
- Cart, checkout, and product details use stacked layouts on narrow viewports and two-column layouts from `lg`/`xl`.
- Forms stack on narrow viewports; paired fields use `sm:grid-cols-2` where helpful.
- Horizontal overflow is suppressed on `html`, `body`, and `#root`.
- Inputs use at least 16px font size on small screens to avoid iOS zoom-on-focus.

## Accessibility baseline

- Semantic landmarks: `nav`, `main`, headings in logical order.
- Visible labels on all form inputs; `aria-invalid` on fields with errors.
- `role="status"` for loading; `role="alert"` for errors and access-denied states.
- `:focus-visible` outline on interactive elements; mouse clicks do not show focus ring.
- `prefers-reduced-motion` respected for animations.
- Icon-only controls include accessible names.
- Tests prefer `getByRole`, `getByLabelText`, and `getByText` over implementation details.

## Form UX

- Client validation runs on blur/submit via Zod schemas.
- Server validation errors map to the correct field when the API returns structured errors.
- Submit buttons show loading labels (`Signing in…`, `Updating…`, etc.) and disable while in flight.
- Session-expired banner appears on login when redirected from a protected route.
- Checkout shows a conflict panel when products become unavailable (HTTP 409).
- Admin product save errors display in a form-level alert with optional detail list.
