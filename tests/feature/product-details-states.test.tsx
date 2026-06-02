import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProductDetailsStates } from '../../src/features/products/components/ProductDetailsStates';
import { useProductQuery } from '../../src/features/products/hooks/useProductQuery';
import { ApiClientError } from '../../src/lib/apiErrors';
import { productFixture } from '../fixtures/apiFixtures';

vi.mock('../../src/features/products/hooks/useProductQuery', () => ({
  useProductQuery: vi.fn()
}));

const useProductQueryMock = vi.mocked(useProductQuery);

describe('ProductDetailsStates', () => {
  it('renders loading state while product details are fetched', () => {
    useProductQueryMock.mockReturnValue({
      isLoading: true,
      isError: false,
      isSuccess: false,
      error: null,
      refetch: vi.fn(),
      data: undefined
    } as unknown as ReturnType<typeof useProductQuery>);

    render(
      <ProductDetailsStates productId="product-1">
        {() => <div>Product content</div>}
      </ProductDetailsStates>
    );

    expect(screen.getByRole('status', { name: /loading product details/i })).toBeInTheDocument();
    expect(screen.queryByText('Product content')).not.toBeInTheDocument();
  });

  it('renders not-found UI for product.not_found errors', () => {
    useProductQueryMock.mockReturnValue({
      isLoading: false,
      isError: true,
      isSuccess: false,
      error: new ApiClientError({
        statusCode: 404,
        httpStatus: 404,
        code: 'product.not_found',
        message: 'Product not found.',
        errors: []
      }),
      refetch: vi.fn(),
      data: undefined
    } as unknown as ReturnType<typeof useProductQuery>);

    render(
      <ProductDetailsStates productId="missing-product">
        {() => <div>Product content</div>}
      </ProductDetailsStates>
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/not found/i);
    expect(screen.queryByText('Product content')).not.toBeInTheDocument();
  });

  it('renders product content on success', () => {
    useProductQueryMock.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      refetch: vi.fn(),
      data: productFixture
    } as unknown as ReturnType<typeof useProductQuery>);

    render(
      <ProductDetailsStates productId={productFixture.id}>
        {(product) => <h1>{product.name}</h1>}
      </ProductDetailsStates>
    );

    expect(screen.getByRole('heading', { name: productFixture.name })).toBeInTheDocument();
  });
});
