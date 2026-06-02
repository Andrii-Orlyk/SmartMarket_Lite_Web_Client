import { Link } from 'react-router-dom';
import type { CartDto } from '../../../types/api';
import { Button } from '../../../components/ui/Button';
import { formatMoney } from '../../products/utils/formatMoney';

interface CartSummaryProps {
  cart: CartDto;
  isClearing?: boolean;
  onClearCart: () => void;
}

export function CartSummary({ cart, isClearing = false, onClearCart }: CartSummaryProps) {
  const isEmpty = cart.items.length === 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>

      <dl className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <dt className="text-slate-600">Items</dt>
          <dd className="font-medium text-slate-900">{cart.items.length}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
          <dt className="text-base font-medium text-slate-900">Total</dt>
          <dd className="text-2xl font-semibold text-slate-900">{formatMoney(cart.totalAmount)}</dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {isEmpty ? (
          <span
            aria-disabled="true"
            className="inline-flex min-h-touch cursor-not-allowed items-center justify-center rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-500"
          >
            Proceed to checkout
          </span>
        ) : (
          <Link
            to="/checkout"
            className="inline-flex min-h-touch items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Proceed to checkout
          </Link>
        )}

        <Button type="button" disabled={isEmpty || isClearing} onClick={onClearCart}>
          {isClearing ? 'Clearing…' : 'Clear cart'}
        </Button>
      </div>
    </section>
  );
}
