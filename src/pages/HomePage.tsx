import { Link } from 'react-router-dom';

const features = [
  { label: 'Authentication', href: '/login' },
  { label: 'Product catalog and product details', href: '/products' },
  { label: 'Cart add/update/remove/clear', href: '/cart' },
  { label: 'Checkout and order creation state', href: '/checkout' },
  { label: 'Order list and order details', href: '/orders' },
  { label: 'Basic admin product management', href: '/admin/products' },
  { label: 'Loading/error/empty states', href: '/products' },
  { label: 'Responsive e-commerce layout', href: '/products' }
];

export function HomePage() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Portfolio frontend</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">SmartMarket Lite Web Client</h1>
      <p className="mt-3 max-w-3xl text-slate-600">
        React + TypeScript frontend client for SmartMarket Lite API. It demonstrates e-commerce UI flows:
        authentication, catalog, cart, checkout, orders and basic admin product management.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ label, href }) => (
          <Link
            key={label}
            to={href}
            className="rounded-xl border border-slate-200 p-4 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}
