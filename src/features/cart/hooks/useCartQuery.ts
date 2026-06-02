import { useQuery } from '@tanstack/react-query';
import { smartMarketApi } from '../../../api/smartMarketApi';
import { cartQueryKeys } from '../cartQueryKeys';

interface UseCartQueryOptions {
  enabled?: boolean;
}

export function useCartQuery(options: UseCartQueryOptions = {}) {
  return useQuery({
    queryKey: cartQueryKeys.detail(),
    queryFn: () => smartMarketApi.cart.get(),
    enabled: options.enabled ?? true
  });
}
