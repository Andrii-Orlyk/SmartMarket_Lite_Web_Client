import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AdminProductsPage } from '../../src/features/adminProducts/pages/AdminProductsPage';
import { ApiClientError } from '../../src/lib/apiErrors';
import type { PagedResult, ProductDto } from '../../src/types/api';
import { inactiveProductFixture, productFixture } from '../fixtures/apiFixtures';

const listProductsMock = vi.fn();
const createProductMock = vi.fn();
const updateProductMock = vi.fn();
const removeProductMock = vi.fn();

vi.mock('../../src/api/smartMarketApi', () => ({
  smartMarketApi: {
    products: {
      list: (...args: unknown[]) => listProductsMock(...args)
    },
    adminProducts: {
      create: (...args: unknown[]) => createProductMock(...args),
      update: (...args: unknown[]) => updateProductMock(...args),
      remove: (...args: unknown[]) => removeProductMock(...args)
    }
  }
}));

const populatedPage: PagedResult<ProductDto> = {
  items: [productFixture, inactiveProductFixture],
  page: 1,
  pageSize: 50,
  totalCount: 2,
  totalPages: 1
};

function renderAdminProductsPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AdminProductsPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

afterEach(() => {
  listProductsMock.mockReset();
  createProductMock.mockReset();
  updateProductMock.mockReset();
  removeProductMock.mockReset();
});

describe('AdminProductsPage', () => {
  it('renders loading state while products are fetched', () => {
    listProductsMock.mockReturnValue(new Promise(() => undefined));
    renderAdminProductsPage();

    expect(screen.getByRole('status', { name: /loading admin products/i })).toBeInTheDocument();
  });

  it('renders admin product table with catalog items', async () => {
    listProductsMock.mockResolvedValue(populatedPage);
    renderAdminProductsPage();

    expect(await screen.findByText(productFixture.name)).toBeInTheDocument();
    expect(screen.getByText(inactiveProductFixture.name)).toBeInTheDocument();
    expect(screen.getByText('Unavailable')).toBeInTheDocument();
  });

  it('creates a product from the admin form', async () => {
    listProductsMock.mockResolvedValue(populatedPage);
    createProductMock.mockResolvedValue({
      ...productFixture,
      id: 'product-3',
      name: 'USB Hub',
      sku: 'UH-001'
    });

    renderAdminProductsPage();

    await userEvent.type(await screen.findByLabelText('Name'), 'USB Hub');
    await userEvent.type(screen.getByLabelText('SKU'), 'UH-001');
    await userEvent.clear(screen.getByLabelText('Price'));
    await userEvent.type(screen.getByLabelText('Price'), '19.99');
    await userEvent.click(screen.getByRole('button', { name: 'Create product' }));

    await waitFor(() => {
      expect(createProductMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'USB Hub',
          sku: 'UH-001',
          price: 19.99
        })
      );
    });

    expect(await screen.findByText(/product created successfully/i)).toBeInTheDocument();
  });

  it('loads selected product into the edit form', async () => {
    listProductsMock.mockResolvedValue(populatedPage);
    renderAdminProductsPage();

    const editButtons = await screen.findAllByRole('button', { name: 'Edit' });
    await userEvent.click(editButtons[0]!);

    expect(await screen.findByRole('heading', { name: `Edit ${productFixture.name}` })).toBeInTheDocument();
    expect(screen.getByDisplayValue(productFixture.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(productFixture.sku)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Update product' })).toBeInTheDocument();
  });

  it('shows backend validation errors on create failure', async () => {
    listProductsMock.mockResolvedValue(populatedPage);
    createProductMock.mockRejectedValue(
      new ApiClientError({
        statusCode: 400,
        httpStatus: 400,
        code: 'validation.failed',
        message: 'Validation failed.',
        errors: ['Sku: SKU already exists.']
      })
    );

    renderAdminProductsPage();

    await userEvent.type(await screen.findByLabelText('Name'), 'Duplicate SKU Product');
    await userEvent.type(screen.getByLabelText('SKU'), 'WM-001');
    await userEvent.clear(screen.getByLabelText('Price'));
    await userEvent.type(screen.getByLabelText('Price'), '10');
    await userEvent.click(screen.getByRole('button', { name: 'Create product' }));

    expect(await screen.findByText('Validation failed.')).toBeInTheDocument();
    expect(screen.getByText('Sku: SKU already exists.')).toBeInTheDocument();
  });

  it('removes a product from the catalog', async () => {
    listProductsMock.mockResolvedValue(populatedPage);
    removeProductMock.mockResolvedValue(undefined);

    renderAdminProductsPage();

    const removeButtons = await screen.findAllByRole('button', { name: 'Remove' });
    await userEvent.click(removeButtons[0]!);

    await waitFor(() => {
      expect(removeProductMock).toHaveBeenCalledWith(productFixture.id);
    });
  });
});
