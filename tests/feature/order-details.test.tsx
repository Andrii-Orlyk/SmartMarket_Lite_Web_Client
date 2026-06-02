import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OrderDetailsPage } from '../../src/features/orders/pages/OrderDetailsPage';
import { ApiClientError } from '../../src/lib/apiErrors';
import { orderFixture } from '../fixtures/apiFixtures';

const getOrderMock = vi.fn();

vi.mock('../../src/api/smartMarketApi', () => ({
  smartMarketApi: {
    orders: {
      getById: (...args: unknown[]) => getOrderMock(...args)
    }
  }
}));

function renderOrderDetails(route = `/orders/${orderFixture.id}`, state?: object) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[{ pathname: route, state }]}>
        <Routes>
          <Route path="/orders/:id" element={<OrderDetailsPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

afterEach(() => {
  getOrderMock.mockReset();
});

describe('OrderDetailsPage', () => {
  it('renders loading state while order details are fetched', () => {
    getOrderMock.mockReturnValue(new Promise(() => undefined));
    renderOrderDetails();

    expect(screen.getByRole('status', { name: /loading order details/i })).toBeInTheDocument();
  });

  it('renders order snapshot fields and totals', async () => {
    getOrderMock.mockResolvedValue(orderFixture);
    renderOrderDetails();

    expect(await screen.findByRole('heading', { name: orderFixture.orderNumber })).toBeInTheDocument();
    expect(screen.getByText(orderFixture.items[0]!.productNameSnapshot)).toBeInTheDocument();
    expect(screen.getByText(/2 × \$29\.99/)).toBeInTheDocument();
    expect(screen.getAllByText('$59.98').length).toBeGreaterThan(0);
    expect(screen.getByText('Payment: Pending')).toBeInTheDocument();
  });

  it('shows checkout success banner when navigated after checkout', async () => {
    getOrderMock.mockResolvedValue(orderFixture);
    renderOrderDetails(`/orders/${orderFixture.id}`, {
      checkoutSuccess: true,
      orderNumber: orderFixture.orderNumber
    });

    expect(await screen.findByText(/order placed/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(orderFixture.orderNumber))).toBeInTheDocument();
  });

  it('renders not-found UI when order is missing', async () => {
    getOrderMock.mockRejectedValue(
      new ApiClientError({
        statusCode: 404,
        httpStatus: 404,
        code: 'order.not_found',
        message: 'Order not found.',
        errors: []
      })
    );

    renderOrderDetails('/orders/missing-order');

    expect(await screen.findByRole('alert')).toHaveTextContent(/not found/i);
  });
});
