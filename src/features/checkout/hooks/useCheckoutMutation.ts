import { useMutation, useQueryClient } from '@tanstack/react-query';
import { smartMarketApi } from '../../../api/smartMarketApi';
import { invalidateAfterCheckout } from '../../../hooks/cacheInvalidation';
import { checkoutQueryKeys } from '../checkoutQueryKeys';

export function useCheckoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: checkoutQueryKeys.mutation(),
    mutationFn: () => smartMarketApi.checkout.create(),
    onSuccess: async () => {
      await invalidateAfterCheckout(queryClient);
    }
  });
}
