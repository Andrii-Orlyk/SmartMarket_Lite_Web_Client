import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { invalidateAfterCheckout } from '../../src/hooks/cacheInvalidation';

describe('checkout cache consistency', () => {
  it('invalidates cart, orders, and products after checkout', async () => {
    const queryClient = new QueryClient();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue(undefined);

    await invalidateAfterCheckout(queryClient);

    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['cart'] });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['orders'] });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['products'] });
  });
});
