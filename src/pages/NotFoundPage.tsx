import { Link } from 'react-router-dom';
import { RoutePlaceholder } from './RoutePlaceholder';

export function NotFoundPage() {
  return (
    <div className="space-y-6">
      <RoutePlaceholder
        badge="404"
        title="Page not found"
        description="The page you requested does not exist or may have moved. Return to the catalog or home page to continue shopping."
      />
      <div className="flex flex-wrap gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Go to home
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Browse products
        </Link>
      </div>
    </div>
  );
}
