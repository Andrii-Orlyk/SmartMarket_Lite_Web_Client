import { useQuery } from '@tanstack/react-query';
import { smartMarketApi } from '../../../api/smartMarketApi';
import { productsQueryKeys } from '../productQueryKeys';

interface UseProductQueryOptions {
  enabled?: boolean;
}

export function useProductQuery(productId: string | undefined, options: UseProductQueryOptions = {}) {
  const enabled = options.enabled ?? Boolean(productId);

  return useQuery({
    queryKey: productsQueryKeys.detail(productId ?? 'unknown'),
    queryFn: () => smartMarketApi.products.getById(productId as string),
    enabled: enabled && Boolean(productId),
    retry: false
  });
}
