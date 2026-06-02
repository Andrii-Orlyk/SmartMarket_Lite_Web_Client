import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ApiErrorPanel } from '../../src/components/feedback/ApiErrorPanel';
import { ApiClientError } from '../../src/lib/apiErrors';

describe('ApiErrorPanel', () => {
  it('renders not-found UI for product.not_found errors', () => {
    render(
      <ApiErrorPanel
        error={
          new ApiClientError({
            statusCode: 404,
            httpStatus: 404,
            code: 'product.not_found',
            message: 'Product not found.',
            errors: []
          })
        }
        fallbackMessage="Fallback"
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/not found/i);
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
  });

  it('renders conflict UI for checkout 409 errors', () => {
    render(
      <ApiErrorPanel
        error={
          new ApiClientError({
            statusCode: 409,
            httpStatus: 409,
            code: 'checkout.product_unavailable',
            message: 'One or more products are no longer available.',
            errors: []
          })
        }
        fallbackMessage="Fallback"
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/action unavailable/i);
    expect(screen.getByText(/no longer available/i)).toBeInTheDocument();
  });
});
