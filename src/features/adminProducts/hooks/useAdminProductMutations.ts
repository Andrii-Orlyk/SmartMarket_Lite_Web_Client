import { useMutation, useQueryClient } from '@tanstack/react-query';
import { smartMarketApi } from '../../../api/smartMarketApi';
import type { OrderStatus, ProductFormValues } from '../../../types/api';
import {
  invalidateAfterAdminProductMutation,
  invalidateOrderQueries
} from '../../../hooks/cacheInvalidation';
import { productsQueryKeys } from '../../products/productQueryKeys';
import { ordersQueryKeys } from '../../orders/ordersQueryKeys';

export function useCreateAdminProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProductFormValues) => smartMarketApi.adminProducts.create(payload),
    onSuccess: async () => {
      await invalidateAfterAdminProductMutation(queryClient);
    }
  });
}

export function useUpdateAdminProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, payload }: { productId: string; payload: ProductFormValues }) =>
      smartMarketApi.adminProducts.update(productId, payload),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        invalidateAfterAdminProductMutation(queryClient),
        queryClient.invalidateQueries({
          queryKey: productsQueryKeys.detail(variables.productId)
        })
      ]);
    }
  });
}

export function useDeleteAdminProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => smartMarketApi.adminProducts.remove(productId),
    onSuccess: async () => {
      await invalidateAfterAdminProductMutation(queryClient);
    }
  });
}

export function useUpdateAdminOrderStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      smartMarketApi.adminOrders.updateStatus(orderId, status),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        invalidateOrderQueries(queryClient),
        queryClient.invalidateQueries({
          queryKey: ordersQueryKeys.detail(variables.orderId)
        })
      ]);
    }
  });
}
