import type { OrderItemDto } from '../../../types/api';
import { formatMoney } from '../../products/utils/formatMoney';

interface OrderItemSnapshotListProps {
  items: OrderItemDto[];
}

export function OrderItemSnapshotList({ items }: OrderItemSnapshotListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Items</h2>
      <ul className="mt-4 divide-y divide-slate-200" aria-label="Order items">
        {items.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <div>
              <p className="font-medium text-slate-900">{item.productNameSnapshot}</p>
              <p className="text-sm text-slate-600">
                {item.quantity} × {formatMoney(item.unitPriceSnapshot)}
              </p>
            </div>
            <p className="text-sm font-medium text-slate-900">{formatMoney(item.lineTotal)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
