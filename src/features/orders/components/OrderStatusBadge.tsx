import type { OrderStatus, PaymentStatus } from '../../../types/api';

const orderStatusStyles: Record<OrderStatus, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Paid: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-slate-100 text-slate-600',
  Completed: 'bg-blue-100 text-blue-800'
};

const paymentStatusStyles: Record<PaymentStatus, string> = {
  NotRequired: 'bg-slate-100 text-slate-600',
  Pending: 'bg-amber-100 text-amber-800',
  Paid: 'bg-emerald-100 text-emerald-800',
  Failed: 'bg-red-100 text-red-800'
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${orderStatusStyles[status]}`}>
      {status}
    </span>
  );
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${paymentStatusStyles[status]}`}>
      Payment: {status}
    </span>
  );
}
