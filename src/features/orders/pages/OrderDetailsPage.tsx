import { Link, useLocation, useParams } from 'react-router-dom';
import { SuccessBanner } from '../../../components/feedback/FeedbackStates';
import { formatMoney } from '../../products/utils/formatMoney';
import { OrderDetailsStates } from '../components/OrderDetailsStates';
import { OrderItemSnapshotList } from '../components/OrderItemSnapshotList';
import { OrderStatusBadge, PaymentStatusBadge } from '../components/OrderStatusBadge';
import { formatOrderDate } from '../utils/formatOrderDate';

interface OrderDetailsLocationState {
  checkoutSuccess?: boolean;
  orderNumber?: string;
}

export function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const locationState = (location.state as OrderDetailsLocationState | null) ?? {};

  return (
    <div className="space-y-6">
      <Link
        to="/orders"
        className="inline-flex text-sm font-medium text-slate-700 underline-offset-2 hover:text-slate-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        ← Back to orders
      </Link>

      {locationState.checkoutSuccess ? (
        <SuccessBanner
          title="Order placed"
          message={`Order ${locationState.orderNumber ?? 'created'} was placed successfully. Status is Pending until processed by the store.`}
        />
      ) : null}

      <OrderDetailsStates orderId={id}>
        {(order) => (
          <div className="space-y-6">
            <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Order</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">{order.orderNumber}</h1>
              <p className="mt-2 text-sm text-slate-600">Placed {formatOrderDate(order.createdAt)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <OrderStatusBadge status={order.status} />
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
              <p className="mt-4 text-2xl font-semibold text-slate-900">{formatMoney(order.totalAmount)}</p>
              {order.status === 'Pending' ? (
                <p className="mt-3 text-sm text-slate-600">
                  This order is pending. Order changes are handled by store administration.
                </p>
              ) : null}
            </header>

            <OrderItemSnapshotList items={order.items} />
          </div>
        )}
      </OrderDetailsStates>
    </div>
  );
}
