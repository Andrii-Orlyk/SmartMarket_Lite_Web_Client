import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProductCatalogPage } from '../../src/features/products/pages/ProductCatalogPage';
import type { PagedResult, ProductDto } from '../../src/types/api';

const productFixture: ProductDto = {
  id: 'product-1',
  name: 'Wireless Mouse',
  description: 'Ergonomic wireless mouse',
  sku: 'WM-001',
  price: 29.99,
  stockQuantity: 12,
  isActive: true,
  createdAt: '2026-01-01T10:00:00Z',
  updatedAt: '2026-01-01T10:00:00Z'
};

const emptyPage: PagedResult<ProductDto> = {
  items: [],
  page: 1,
  pageSize: 12,
  totalCount: 0,
  totalPages: 0
};

const populatedPage: PagedResult<ProductDto> = {
  items: [productFixture],
  page: 1,
  pageSize: 12,
  totalCount: 1,
  totalPages: 1
};

const listMock = vi.fn();

vi.mock('../../src/api/smartMarketApi', () => ({
  smartMarketApi: {
    products: {
      list: (...args: unknown[]) => listMock(...args)
    }
  }
}));

function renderCatalog(initialRoute = '/products') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <ProductCatalogPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

afterEach(() => {
  listMock.mockReset();
});

describe('ProductCatalogPage', () => {
  it('renders loading state while products are fetched', () => {
    listMock.mockReturnValue(new Promise(() => undefined));
    renderCatalog();

    expect(screen.getByRole('status', { name: /loading products/i })).toBeInTheDocument();
  });

  it('renders product cards on success', async () => {
    listMock.mockResolvedValue(populatedPage);
    renderCatalog();

    expect(await screen.findByRole('heading', { name: productFixture.name })).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('renders empty state when no products match', async () => {
    listMock.mockResolvedValue(emptyPage);
    renderCatalog();

    expect(await screen.findByRole('heading', { name: /no products found/i })).toBeInTheDocument();
  });

  it('renders error state with retry action', async () => {
    listMock.mockRejectedValue(new Error('Network down'));
    renderCatalog();

    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i);
    expect(screen.getByRole('alert')).toHaveTextContent(/unable to load products/i);

    listMock.mockResolvedValue(populatedPage);
    await userEvent.click(screen.getByRole('button', { name: /try again/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: productFixture.name })).toBeInTheDocument();
    });
  });
});
