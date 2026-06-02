import type { CartDto } from '../../../types/api';
import { formatMoney } from '../../products/utils/formatMoney';

interface CheckoutSummaryProps {
  cart: CartDto;
}

export function CheckoutSummary({ cart }: CheckoutSummaryProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>

      <ul className="mt-4 divide-y divide-slate-200" aria-label="Checkout items">
        {cart.items.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <div>
              <p className="font-medium text-slate-900">{item.productName}</p>
              <p className="text-sm text-slate-600">
                {item.quantity} × {formatMoney(item.unitPriceSnapshot)}
              </p>
            </div>
            <p className="text-sm font-medium text-slate-900">{formatMoney(item.lineTotal)}</p>
          </li>
        ))}
      </ul>

      <dl className="mt-4 border-t border-slate-200 pt-4">
        <div className="flex items-center justify-between">
          <dt className="text-base font-medium text-slate-900">Total</dt>
          <dd className="text-2xl font-semibold text-slate-900">{formatMoney(cart.totalAmount)}</dd>
        </div>
      </dl>
    </section>
  );
}
