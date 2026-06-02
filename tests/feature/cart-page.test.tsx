import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CartPage } from '../../src/features/cart/pages/CartPage';
import { cartFixture, emptyCartFixture } from '../fixtures/apiFixtures';

const getCartMock = vi.fn();
const updateItemMock = vi.fn();
const removeItemMock = vi.fn();
const clearCartMock = vi.fn();

vi.mock('../../src/api/smartMarketApi', () => ({
  smartMarketApi: {
    cart: {
      get: (...args: unknown[]) => getCartMock(...args),
      updateItem: (...args: unknown[]) => updateItemMock(...args),
      removeItem: (...args: unknown[]) => removeItemMock(...args),
      clear: (...args: unknown[]) => clearCartMock(...args)
    }
  }
}));

function renderCartPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

afterEach(() => {
  getCartMock.mockReset();
  updateItemMock.mockReset();
  removeItemMock.mockReset();
  clearCartMock.mockReset();
});

describe('CartPage', () => {
  it('renders loading state while cart is fetched', () => {
    getCartMock.mockReturnValue(new Promise(() => undefined));
    renderCartPage();

    expect(screen.getByRole('status', { name: /loading cart/i })).toBeInTheDocument();
  });

  it('renders empty cart state when there are no items', async () => {
    getCartMock.mockResolvedValue(emptyCartFixture);
    renderCartPage();

    expect(await screen.findByRole('heading', { name: /your cart is empty/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Browse products' })).toBeInTheDocument();
  });

  it('renders cart items, totals, and checkout action', async () => {
    getCartMock.mockResolvedValue(cartFixture);
    renderCartPage();

    expect(await screen.findByRole('heading', { name: cartFixture.items[0]!.productName })).toBeInTheDocument();
    expect(screen.getByText('$59.98')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Proceed to checkout' })).toHaveAttribute('href', '/checkout');
  });

  it('updates item quantity through the cart mutation', async () => {
    getCartMock.mockResolvedValue(cartFixture);
    updateItemMock.mockResolvedValue({
      ...cartFixture,
      items: [{ ...cartFixture.items[0]!, quantity: 3, lineTotal: 89.97 }],
      totalAmount: 89.97
    });

    renderCartPage();

    const quantityInput = await screen.findByLabelText('Quantity');
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, '3');
    await userEvent.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(updateItemMock).toHaveBeenCalledWith('cart-item-1', { quantity: 3 });
    });
  });

  it('removes an item from the cart', async () => {
    getCartMock.mockResolvedValue(cartFixture);
    removeItemMock.mockResolvedValue(emptyCartFixture);

    renderCartPage();

    await userEvent.click(await screen.findByRole('button', { name: 'Remove' }));

    await waitFor(() => {
      expect(removeItemMock).toHaveBeenCalledWith('cart-item-1');
    });
  });

  it('clears the cart', async () => {
    getCartMock.mockResolvedValue(cartFixture);
    clearCartMock.mockResolvedValue(undefined);

    renderCartPage();

    await userEvent.click(await screen.findByRole('button', { name: 'Clear cart' }));

    await waitFor(() => {
      expect(clearCartMock).toHaveBeenCalledOnce();
    });
  });

  it('renders error state with retry when cart fetch fails', async () => {
    getCartMock.mockRejectedValue(new Error('Network down'));
    renderCartPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i);

    getCartMock.mockResolvedValue(cartFixture);
    await userEvent.click(screen.getByRole('button', { name: /try again/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: cartFixture.items[0]!.productName })).toBeInTheDocument();
    });
  });
});
