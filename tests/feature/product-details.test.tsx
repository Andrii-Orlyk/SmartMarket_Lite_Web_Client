import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProductDetailsPage } from '../../src/features/products/pages/ProductDetailsPage';
import { ApiClientError } from '../../src/lib/apiErrors';
import { inactiveProductFixture, productFixture } from '../fixtures/apiFixtures';

const getByIdMock = vi.fn();
const addItemMock = vi.fn();

vi.mock('../../src/api/smartMarketApi', () => ({
  smartMarketApi: {
    products: {
      getById: (...args: unknown[]) => getByIdMock(...args)
    },
    cart: {
      addItem: (...args: unknown[]) => addItemMock(...args)
    }
  }
}));

const useAuthMock = vi.fn();

vi.mock('../../src/features/auth/useAuth', () => ({
  useAuth: () => useAuthMock()
}));

function renderProductDetails(route = `/products/${productFixture.id}`) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetailsPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

afterEach(() => {
  getByIdMock.mockReset();
  addItemMock.mockReset();
  useAuthMock.mockReset();
});

describe('ProductDetailsPage', () => {
  it('renders loading state while product details are fetched', () => {
    getByIdMock.mockReturnValue(new Promise(() => undefined));
    useAuthMock.mockReturnValue({ isAuthenticated: false });

    renderProductDetails();

    expect(screen.getByRole('status', { name: /loading product details/i })).toBeInTheDocument();
  });

  it('renders product info for a successful fetch', async () => {
    getByIdMock.mockResolvedValue(productFixture);
    useAuthMock.mockReturnValue({ isAuthenticated: false });

    renderProductDetails();

    expect(await screen.findByRole('heading', { name: productFixture.name })).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText(productFixture.sku)).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('renders not-found UI when product is missing', async () => {
    getByIdMock.mockRejectedValue(
      new ApiClientError({
        statusCode: 404,
        httpStatus: 404,
        code: 'product.not_found',
        message: 'Product not found.',
        errors: []
      })
    );
    useAuthMock.mockReturnValue({ isAuthenticated: false });

    renderProductDetails('/products/missing-product');

    expect(await screen.findByRole('alert')).toHaveTextContent(/not found/i);
  });

  it('prompts guests to sign in before adding to cart', async () => {
    getByIdMock.mockResolvedValue(productFixture);
    useAuthMock.mockReturnValue({ isAuthenticated: false });

    renderProductDetails();

    expect(await screen.findByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('button', { name: /add to cart/i })).not.toBeInTheDocument();
  });

  it('disables add-to-cart for inactive products', async () => {
    getByIdMock.mockResolvedValue(inactiveProductFixture);
    useAuthMock.mockReturnValue({ isAuthenticated: true });

    renderProductDetails(`/products/${inactiveProductFixture.id}`);

    expect(await screen.findByRole('button', { name: 'Unavailable' })).toBeDisabled();
  });

  it('calls cart.addItem when an authenticated user adds to cart', async () => {
    getByIdMock.mockResolvedValue(productFixture);
    addItemMock.mockResolvedValue({ id: 'cart-1', items: [], totalAmount: 29.99 });
    useAuthMock.mockReturnValue({ isAuthenticated: true });

    renderProductDetails();

    await userEvent.click(await screen.findByRole('button', { name: /add to cart/i }));

    await waitFor(() => {
      expect(addItemMock).toHaveBeenCalledWith({
        productId: productFixture.id,
        quantity: 1
      });
    });

    expect(await screen.findByText(/added to cart/i)).toBeInTheDocument();
  });

  it('shows validation error when quantity is zero', async () => {
    getByIdMock.mockResolvedValue(productFixture);
    useAuthMock.mockReturnValue({ isAuthenticated: true });

    renderProductDetails();

    const quantityInput = await screen.findByLabelText('Quantity');
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, '0');
    await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(await screen.findByText('Quantity must be greater than 0')).toBeInTheDocument();
    expect(addItemMock).not.toHaveBeenCalled();
  });
});
