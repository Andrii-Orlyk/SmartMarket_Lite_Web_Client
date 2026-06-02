import { Link } from 'react-router-dom';
import type { ProductDto } from '../../../types/api';
import { formatMoney } from '../utils/formatMoney';
import {
  getProductAvailabilityBadgeClass,
  getProductAvailabilityLabel,
  getProductStockHint,
  isProductAvailable
} from '../utils/productAvailability';

interface ProductCardProps {
  product: ProductDto;
}

export function ProductCard({ product }: ProductCardProps) {
  const label = getProductAvailabilityLabel(product);
  const stockHint = getProductStockHint(product);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          <Link
            to={`/products/${product.id}`}
            className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            {product.name}
          </Link>
        </h2>
        <span
          className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${getProductAvailabilityBadgeClass(product)}`}
        >
          {label}
        </span>
      </div>

      <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600">
        {product.description ?? 'No description provided.'}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-slate-500">Price</dt>
          <dd className="font-semibold text-slate-900">{formatMoney(product.price)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Availability</dt>
          <dd className="font-medium text-slate-900">{stockHint ?? label}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-slate-500">SKU</dt>
          <dd className="font-mono text-xs text-slate-700">{product.sku}</dd>
        </div>
      </dl>

      <Link
        to={`/products/${product.id}`}
        className={`mt-4 inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
          isProductAvailable(product)
            ? 'border-slate-300 text-slate-900 hover:bg-slate-50'
            : 'border-slate-200 text-slate-500'
        }`}
      >
        {isProductAvailable(product) ? 'View details' : label}
      </Link>
    </article>
  );
};
