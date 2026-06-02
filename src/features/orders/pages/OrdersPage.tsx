import { useNavigate } from 'react-router-dom';
import { FeatureQueryStates } from '../../../components/feedback';
import { OrderList } from '../components/OrderList';
import { useOrdersQuery } from '../hooks/useOrdersQuery';

export function OrdersPage() {
  const navigate = useNavigate();
  const ordersQuery = useOrdersQuery();

  const orders = ordersQuery.data ?? [];
  const isEmpty = ordersQuery.isSuccess && orders.length === 0;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Orders</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Your orders</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review your order history, totals, and status updates.
        </p>
      </header>

      <FeatureQueryStates
        query={ordersQuery}
        isEmpty={isEmpty}
        loadingMessage="Loading your orders…"
        loadingAriaLabel="Loading orders"
        emptyTitle="No orders yet"
        emptyDescription="Place your first order from the catalog to see it here."
        emptyActionLabel="Browse products"
        onEmptyAction={() => navigate('/products')}
        errorFallbackMessage="Unable to load your orders. Please try again."
      >
        <OrderList orders={orders} />
      </FeatureQueryStates>
    </div>
  );
}
