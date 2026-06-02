import { Link } from 'react-router-dom';
import type { OrderDto } from '../../../types/api';
import { formatMoney } from '../../products/utils/formatMoney';
import { OrderStatusBadge, PaymentStatusBadge } from './OrderStatusBadge';
import { formatOrderDate } from '../utils/formatOrderDate';

interface OrderListProps {
  orders: OrderDto[];
}

export function OrderList({ orders }: OrderListProps) {
  return (
    <ul className="space-y-4" aria-label="Order history">
      {orders.map((order) => (
        <li key={order.id}>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900">
                  <Link
                    to={`/orders/${order.id}`}
                    className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                  >
                    {order.orderNumber}
                  </Link>
                </h2>
                <p className="text-sm text-slate-600">Placed {formatOrderDate(order.createdAt)}</p>
                <div className="flex flex-wrap gap-2">
                  <OrderStatusBadge status={order.status} />
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-sm text-slate-500">Total</p>
                <p className="text-2xl font-semibold text-slate-900">{formatMoney(order.totalAmount)}</p>
                <Link
                  to={`/orders/${order.id}`}
                  className="mt-3 inline-flex text-sm font-medium text-slate-700 underline-offset-2 hover:text-slate-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                >
                  View details
                </Link>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
