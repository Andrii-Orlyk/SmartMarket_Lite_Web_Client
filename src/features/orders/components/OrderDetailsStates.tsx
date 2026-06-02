import type { ReactNode } from 'react';
import { FeatureQueryStates } from '../../../components/feedback';
import type { OrderDto } from '../../../types/api';
import { useOrderQuery } from '../hooks/useOrdersQuery';

interface OrderDetailsStatesProps {
  orderId: string | undefined;
  children: (order: OrderDto) => ReactNode;
}

export function OrderDetailsStates({ orderId, children }: OrderDetailsStatesProps) {
  const orderQuery = useOrderQuery(orderId);

  return (
    <FeatureQueryStates
      query={orderQuery}
      loadingMessage="Loading order details…"
      loadingAriaLabel="Loading order details"
      emptyTitle="Order unavailable"
      emptyDescription="This order could not be loaded."
      errorFallbackMessage="Unable to load order details. Please try again."
    >
      {orderQuery.data ? children(orderQuery.data) : null}
    </FeatureQueryStates>
  );
}
