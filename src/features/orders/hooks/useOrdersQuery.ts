import { useQuery } from '@tanstack/react-query';
import { smartMarketApi } from '../../../api/smartMarketApi';
import { ordersQueryKeys } from '../ordersQueryKeys';

interface UseOrdersQueryOptions {
  enabled?: boolean;
}

export function useOrdersQuery(options: UseOrdersQueryOptions = {}) {
  return useQuery({
    queryKey: ordersQueryKeys.list(),
    queryFn: () => smartMarketApi.orders.list(),
    enabled: options.enabled ?? true
  });
}

interface UseOrderQueryOptions {
  enabled?: boolean;
}

export function useOrderQuery(orderId: string | undefined, options: UseOrderQueryOptions = {}) {
  const enabled = options.enabled ?? Boolean(orderId);

  return useQuery({
    queryKey: ordersQueryKeys.detail(orderId ?? 'unknown'),
    queryFn: () => smartMarketApi.orders.getById(orderId as string),
    enabled: enabled && Boolean(orderId),
    retry: false
  });
}

interface UseAdminOrdersQueryOptions {
  enabled?: boolean;
}

export function useAdminOrdersQuery(options: UseAdminOrdersQueryOptions = {}) {
  return useQuery({
    queryKey: ordersQueryKeys.adminList(),
    queryFn: () => smartMarketApi.adminOrders.list(),
    enabled: options.enabled ?? true
  });
}
