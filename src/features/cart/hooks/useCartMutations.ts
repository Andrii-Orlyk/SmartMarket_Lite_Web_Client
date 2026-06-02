import { useMutation, useQueryClient } from '@tanstack/react-query';
import { smartMarketApi } from '../../../api/smartMarketApi';
import type { AddCartItemRequest, UpdateCartItemRequest } from '../../../types/api';
import { invalidateAfterCartMutation } from '../../../hooks/cacheInvalidation';

export function useAddCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddCartItemRequest) => smartMarketApi.cart.addItem(payload),
    onSuccess: async () => {
      await invalidateAfterCartMutation(queryClient);
    }
  });
}

export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, payload }: { itemId: string; payload: UpdateCartItemRequest }) =>
      smartMarketApi.cart.updateItem(itemId, payload),
    onSuccess: async () => {
      await invalidateAfterCartMutation(queryClient);
    }
  });
}

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => smartMarketApi.cart.removeItem(itemId),
    onSuccess: async () => {
      await invalidateAfterCartMutation(queryClient);
    }
  });
}

export function useClearCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => smartMarketApi.cart.clear(),
    onSuccess: async () => {
      await invalidateAfterCartMutation(queryClient);
    }
  });
}
