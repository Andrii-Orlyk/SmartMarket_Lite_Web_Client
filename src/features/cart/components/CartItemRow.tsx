import { Link } from 'react-router-dom';
import { ApiErrorPanel } from '../../../components/feedback/ApiErrorPanel';
import type { CartItemDto } from '../../../types/api';
import { formatMoney } from '../../products/utils/formatMoney';
import { CartQuantityForm } from './CartQuantityForm';
import { useRemoveCartItemMutation, useUpdateCartItemMutation } from '../hooks/useCartMutations';

interface CartItemRowProps {
  item: CartItemDto;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const updateCartItemMutation = useUpdateCartItemMutation();
  const removeCartItemMutation = useRemoveCartItemMutation();

  const isUpdating =
    updateCartItemMutation.isPending && updateCartItemMutation.variables?.itemId === item.id;
  const isRemoving =
    removeCartItemMutation.isPending && removeCartItemMutation.variables === item.id;

  const updateError =
    updateCartItemMutation.isError && updateCartItemMutation.variables?.itemId === item.id
      ? updateCartItemMutation.error
      : null;

  const removeError =
    removeCartItemMutation.isError && removeCartItemMutation.variables === item.id
      ? removeCartItemMutation.error
      : null;

  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">
            <Link
              to={`/products/${item.productId}`}
              className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              {item.productName}
            </Link>
          </h2>
          <p className="text-sm text-slate-600">{formatMoney(item.unitPriceSnapshot)} each</p>
          <p className="text-sm font-medium text-slate-900">Line total: {formatMoney(item.lineTotal)}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <CartQuantityForm
            key={`${item.id}-${item.quantity}`}
            defaultQuantity={item.quantity}
            isSubmitting={isUpdating}
            onSubmit={async (values) => {
              await updateCartItemMutation.mutateAsync({
                itemId: item.id,
                payload: { quantity: values.quantity }
              });
            }}
          />

          <button
            type="button"
            disabled={isRemoving || isUpdating}
            onClick={() => removeCartItemMutation.mutate(item.id)}
            className="inline-flex min-h-touch items-center justify-center rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
          >
            {isRemoving ? 'Removing…' : 'Remove'}
          </button>
        </div>
      </div>

      {updateError ? (
        <div className="mt-4">
          <ApiErrorPanel
            error={updateError}
            fallbackMessage="Unable to update cart quantity."
            onRetry={() => updateCartItemMutation.reset()}
          />
        </div>
      ) : null}

      {removeError ? (
        <div className="mt-4">
          <ApiErrorPanel
            error={removeError}
            fallbackMessage="Unable to remove this item."
            onRetry={() => removeCartItemMutation.reset()}
          />
        </div>
      ) : null}
    </li>
  );
};
