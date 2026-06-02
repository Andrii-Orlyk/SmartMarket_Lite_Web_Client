import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OrdersPage } from '../../src/features/orders/pages/OrdersPage';
import { orderFixture } from '../fixtures/apiFixtures';

const listOrdersMock = vi.fn();

vi.mock('../../src/api/smartMarketApi', () => ({
  smartMarketApi: {
    orders: {
      list: (...args: unknown[]) => listOrdersMock(...args)
    }
  }
}));

function renderOrdersPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <OrdersPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

afterEach(() => {
  listOrdersMock.mockReset();
});

describe('OrdersPage', () => {
  it('renders loading state while orders are fetched', () => {
    listOrdersMock.mockReturnValue(new Promise(() => undefined));
    renderOrdersPage();

    expect(screen.getByRole('status', { name: /loading orders/i })).toBeInTheDocument();
  });

  it('renders empty state when the user has no orders', async () => {
    listOrdersMock.mockResolvedValue([]);
    renderOrdersPage();

    expect(await screen.findByRole('heading', { name: /no orders yet/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Browse products' })).toBeInTheDocument();
  });

  it('renders order history with totals and status badges', async () => {
    listOrdersMock.mockResolvedValue([orderFixture]);
    renderOrdersPage();

    expect(await screen.findByRole('heading', { name: orderFixture.orderNumber })).toBeInTheDocument();
    expect(screen.getByText('$59.98')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Payment: Pending')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View details' })).toHaveAttribute(
      'href',
      `/orders/${orderFixture.id}`
    );
  });

  it('renders error state with retry action', async () => {
    listOrdersMock.mockRejectedValue(new Error('Network down'));
    renderOrdersPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i);

    listOrdersMock.mockResolvedValue([orderFixture]);
    await userEvent.click(screen.getByRole('button', { name: /try again/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: orderFixture.orderNumber })).toBeInTheDocument();
    });
  });
});
