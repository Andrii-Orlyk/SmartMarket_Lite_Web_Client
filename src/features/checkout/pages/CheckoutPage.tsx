import { Link, useNavigate } from 'react-router-dom';
import { ApiErrorPanel } from '../../../components/feedback/ApiErrorPanel';
import { FeatureQueryStates } from '../../../components/feedback';
import { Button } from '../../../components/ui/Button';
import { useCartQuery } from '../../cart/hooks/useCartQuery';
import { CheckoutSummary } from '../components/CheckoutSummary';
import { useCheckoutMutation } from '../hooks/useCheckoutMutation';

export function CheckoutPage() {
  const navigate = useNavigate();
  const cartQuery = useCartQuery();
  const checkoutMutation = useCheckoutMutation();

  const cart = cartQuery.data;
  const isEmpty = Boolean(cart && cart.items.length === 0);

  const handleCheckout = () => {
    checkoutMutation.mutate(undefined, {
      onSuccess: (order) => {
        navigate(`/orders/${order.id}`, {
          replace: true,
          state: { checkoutSuccess: true, orderNumber: order.orderNumber }
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <Link
          to="/cart"
          className="inline-flex text-sm font-medium text-slate-700 underline-offset-2 hover:text-slate-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          ← Back to cart
        </Link>
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Checkout</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Confirm your order</h1>
          <p className="mt-2 text-sm text-slate-600">
            Review your cart total and place the order when you are ready.
          </p>
        </div>
      </header>

      <FeatureQueryStates
        query={cartQuery}
        isEmpty={isEmpty}
        loadingMessage="Loading checkout details…"
        loadingAriaLabel="Loading checkout"
        emptyTitle="Nothing to checkout"
        emptyDescription="Your cart is empty. Add products before placing an order."
        emptyActionLabel="Browse products"
        onEmptyAction={() => navigate('/products')}
        errorFallbackMessage="Unable to load checkout details. Please try again."
      >
        {cart ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <CheckoutSummary cart={cart} />

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Place order</h2>
              <p className="mt-2 text-sm text-slate-600">
                Your order will be created from the current cart snapshot.
              </p>

              {checkoutMutation.isError ? (
                <div className="mt-4">
                  <ApiErrorPanel
                    error={checkoutMutation.error}
                    fallbackMessage="Unable to complete checkout. Please try again."
                    onRetry={() => checkoutMutation.reset()}
                  />
                </div>
              ) : null}

              <Button
                type="button"
                className="mt-6 w-full sm:w-auto"
                disabled={checkoutMutation.isPending}
                onClick={handleCheckout}
              >
                {checkoutMutation.isPending ? 'Placing order…' : 'Place order'}
              </Button>
            </section>
          </div>
        ) : null}
      </FeatureQueryStates>
    </div>
  );
}
