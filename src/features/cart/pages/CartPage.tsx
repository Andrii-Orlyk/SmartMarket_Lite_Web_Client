import { useNavigate } from 'react-router-dom';
import { FeatureQueryStates } from '../../../components/feedback';
import { useCartQuery } from '../hooks/useCartQuery';
import { useClearCartMutation } from '../hooks/useCartMutations';
import { CartItemRow } from '../components/CartItemRow';
import { CartSummary } from '../components/CartSummary';

export function CartPage() {
  const navigate = useNavigate();
  const cartQuery = useCartQuery();
  const clearCartMutation = useClearCartMutation();

  const cart = cartQuery.data;
  const isEmpty = Boolean(cart && cart.items.length === 0);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Cart</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Shopping cart</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review items, update quantities, and proceed to checkout when ready.
        </p>
      </header>

      <FeatureQueryStates
        query={cartQuery}
        isEmpty={isEmpty}
        loadingMessage="Loading your cart…"
        loadingAriaLabel="Loading cart"
        emptyTitle="Your cart is empty"
        emptyDescription="Browse the catalog and add products to start checkout."
        emptyActionLabel="Browse products"
        onEmptyAction={() => navigate('/products')}
        errorFallbackMessage="Unable to load your cart. Please try again."
      >
        {cart ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <ul className="space-y-4" aria-label="Cart items">
              {cart.items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </ul>
            <CartSummary
              cart={cart}
              isClearing={clearCartMutation.isPending}
              onClearCart={() => clearCartMutation.mutate()}
            />
          </div>
        ) : null}
      </FeatureQueryStates>
    </div>
  );
}
