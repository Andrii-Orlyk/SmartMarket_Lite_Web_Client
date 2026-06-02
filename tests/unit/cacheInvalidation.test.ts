import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import {
  invalidateAfterCheckout,
  invalidateAfterCartMutation,
  invalidateProductQueries
} from '../../src/hooks/cacheInvalidation';

describe('cacheInvalidation', () => {
  it('invalidates cart, orders, and products after checkout', async () => {
    const queryClient = new QueryClient();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue(undefined);

    await invalidateAfterCheckout(queryClient);

    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['cart'] });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['orders'] });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['products'] });
  });

  it('invalidates cart after cart mutation', async () => {
    const queryClient = new QueryClient();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue(undefined);

    await invalidateAfterCartMutation(queryClient);

    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['cart'] });
  });

  it('invalidates all product queries after admin product changes', async () => {
    const queryClient = new QueryClient();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue(undefined);

    await invalidateProductQueries(queryClient);

    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['products'] });
  });
});
