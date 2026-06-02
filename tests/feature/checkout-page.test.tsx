import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CheckoutPage } from '../../src/features/checkout/pages/CheckoutPage';
import { ApiClientError } from '../../src/lib/apiErrors';
import { cartFixture, emptyCartFixture, orderFixture } from '../fixtures/apiFixtures';

const getCartMock = vi.fn();
const checkoutMock = vi.fn();
const navigateMock = vi.fn();

vi.mock('../../src/api/smartMarketApi', () => ({
  smartMarketApi: {
    cart: {
      get: (...args: unknown[]) => getCartMock(...args)
    },
    checkout: {
      create: (...args: unknown[]) => checkoutMock(...args)
    }
  }
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock
  };
});

function renderCheckoutPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

afterEach(() => {
  getCartMock.mockReset();
  checkoutMock.mockReset();
  navigateMock.mockReset();
});

describe('CheckoutPage', () => {
  it('renders loading state while checkout data is fetched', () => {
    getCartMock.mockReturnValue(new Promise(() => undefined));
    renderCheckoutPage();

    expect(screen.getByRole('status', { name: /loading checkout/i })).toBeInTheDocument();
  });

  it('blocks checkout when the cart is empty', async () => {
    getCartMock.mockResolvedValue(emptyCartFixture);
    renderCheckoutPage();

    expect(await screen.findByRole('heading', { name: /nothing to checkout/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /place order/i })).not.toBeInTheDocument();
  });

  it('renders checkout summary for a populated cart', async () => {
    getCartMock.mockResolvedValue(cartFixture);
    renderCheckoutPage();

    expect(await screen.findByText(cartFixture.items[0]!.productName)).toBeInTheDocument();
    expect(screen.getAllByText('$59.98')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Place order' })).toBeInTheDocument();
  });

  it('places an order and navigates to order details on success', async () => {
    getCartMock.mockResolvedValue(cartFixture);
    checkoutMock.mockResolvedValue(orderFixture);
    renderCheckoutPage();

    await userEvent.click(await screen.findByRole('button', { name: 'Place order' }));

    await waitFor(() => {
      expect(checkoutMock).toHaveBeenCalledOnce();
      expect(navigateMock).toHaveBeenCalledWith(`/orders/${orderFixture.id}`, {
        replace: true,
        state: { checkoutSuccess: true, orderNumber: orderFixture.orderNumber }
      });
    });
  });

  it('shows conflict UI when checkout returns 409', async () => {
    getCartMock.mockResolvedValue(cartFixture);
    checkoutMock.mockRejectedValue(
      new ApiClientError({
        statusCode: 409,
        httpStatus: 409,
        code: 'checkout.product_unavailable',
        message: 'One or more products are no longer available.',
        errors: []
      })
    );
    renderCheckoutPage();

    await userEvent.click(await screen.findByRole('button', { name: 'Place order' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/action unavailable/i);
    expect(screen.getByText('This product is no longer available.')).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
