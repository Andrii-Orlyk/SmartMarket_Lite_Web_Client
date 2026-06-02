import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useCheckoutMutation } from '../../src/features/checkout/hooks/useCheckoutMutation';
import { orderFixture } from '../fixtures/apiFixtures';

const checkoutMock = vi.fn();

vi.mock('../../src/api/smartMarketApi', () => ({
  smartMarketApi: {
    checkout: {
      create: (...args: unknown[]) => checkoutMock(...args)
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
  checkoutMock.mockReset();
});

describe('useCheckoutMutation', () => {
  it('calls checkout.create for a valid checkout request', async () => {
    checkoutMock.mockResolvedValue(orderFixture);

    const { result } = renderHook(() => useCheckoutMutation(), { wrapper: createWrapper() });

    await result.current.mutateAsync();

    await waitFor(() => {
      expect(checkoutMock).toHaveBeenCalledOnce();
    });
  });
});
