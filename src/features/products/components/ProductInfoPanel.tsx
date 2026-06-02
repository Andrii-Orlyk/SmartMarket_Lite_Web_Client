import type { ProductDto } from '../../../types/api';
import { formatMoney } from '../utils/formatMoney';
import {
  getProductAvailabilityBadgeClass,
  getProductAvailabilityLabel,
  getProductStockHint
} from '../utils/productAvailability';

interface ProductInfoPanelProps {
  product: ProductDto;
}

export function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const label = getProductAvailabilityLabel(product);
  const stockHint = getProductStockHint(product);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Product</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">{product.name}</h1>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${getProductAvailabilityBadgeClass(product)}`}>
          {label}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        {product.description ?? 'No description provided.'}
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-slate-500">Price</dt>
          <dd className="mt-1 text-2xl font-semibold text-slate-900">{formatMoney(product.price)}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-500">Availability</dt>
          <dd className="mt-1 text-lg font-medium text-slate-900">{stockHint ?? label}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-sm text-slate-500">SKU</dt>
          <dd className="mt-1 font-mono text-sm text-slate-700">{product.sku}</dd>
        </div>
      </dl>
    </section>
  );
};
