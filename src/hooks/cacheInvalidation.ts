import type { QueryClient } from '@tanstack/react-query';
import { AUTH_ME_QUERY_KEY } from '../features/auth/authQueryKeys';
import { cartQueryKeys } from '../features/cart/cartQueryKeys';
import { ordersQueryKeys } from '../features/orders/ordersQueryKeys';
import { productsQueryKeys } from '../features/products/productQueryKeys';

export async function invalidateAuthUser(queryClient: QueryClient): Promise<void> {
  await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
}

export async function invalidateProductQueries(queryClient: QueryClient): Promise<void> {
  await queryClient.invalidateQueries({ queryKey: productsQueryKeys.all });
}

export async function invalidateCartQueries(queryClient: QueryClient): Promise<void> {
  await queryClient.invalidateQueries({ queryKey: cartQueryKeys.all });
}

export async function invalidateOrderQueries(queryClient: QueryClient): Promise<void> {
  await queryClient.invalidateQueries({ queryKey: ordersQueryKeys.all });
}

export async function invalidateAfterCartMutation(queryClient: QueryClient): Promise<void> {
  await invalidateCartQueries(queryClient);
}

export async function invalidateAfterCheckout(queryClient: QueryClient): Promise<void> {
  await Promise.all([
    invalidateCartQueries(queryClient),
    invalidateOrderQueries(queryClient),
    invalidateProductQueries(queryClient)
  ]);
}

export async function invalidateAfterAdminProductMutation(queryClient: QueryClient): Promise<void> {
  await invalidateProductQueries(queryClient);
}

export function clearAuthUserCache(queryClient: QueryClient): void {
  queryClient.setQueryData(AUTH_ME_QUERY_KEY, null);
  queryClient.removeQueries({ queryKey: AUTH_ME_QUERY_KEY });
}

export function clearCartCache(queryClient: QueryClient): void {
  queryClient.setQueryData(cartQueryKeys.detail(), null);
  queryClient.removeQueries({ queryKey: cartQueryKeys.all });
}
