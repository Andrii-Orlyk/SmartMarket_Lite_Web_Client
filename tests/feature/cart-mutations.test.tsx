import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAddCartItemMutation, useUpdateCartItemMutation } from '../../src/features/cart/hooks/useCartMutations';
import { cartFixture } from '../fixtures/apiFixtures';

const addItemMock = vi.fn();
const updateItemMock = vi.fn();

vi.mock('../../src/api/smartMarketApi', () => ({
  smartMarketApi: {
    cart: {
      addItem: (...args: unknown[]) => addItemMock(...args),
      updateItem: (...args: unknown[]) => updateItemMock(...args)
    }
  }
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

afterEach(() => {
  addItemMock.mockReset();
  updateItemMock.mockReset();
});

describe('cart mutations', () => {
  it('calls cart.addItem when adding an active product to cart', async () => {
    addItemMock.mockResolvedValue(cartFixture);

    const { result } = renderHook(() => useAddCartItemMutation(), { wrapper: createWrapper() });

    await result.current.mutateAsync({ productId: 'product-1', quantity: 1 });

    expect(addItemMock).toHaveBeenCalledWith({ productId: 'product-1', quantity: 1 });
  });

  it('calls cart.updateItem when updating cart quantity', async () => {
    updateItemMock.mockResolvedValue(cartFixture);

    const { result } = renderHook(() => useUpdateCartItemMutation(), { wrapper: createWrapper() });

    await result.current.mutateAsync({
      itemId: 'cart-item-1',
      payload: { quantity: 3 }
    });

    await waitFor(() => {
      expect(updateItemMock).toHaveBeenCalledWith('cart-item-1', { quantity: 3 });
    });
  });
});
