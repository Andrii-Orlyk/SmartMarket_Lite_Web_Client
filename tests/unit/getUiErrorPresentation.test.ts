import { describe, expect, it } from 'vitest';
import { ApiClientError } from '../../src/lib/apiErrors';
import { getUiErrorPresentation } from '../../src/components/feedback/getUiErrorPresentation';

describe('getUiErrorPresentation', () => {
  it('maps 404 errors to not-found presentation', () => {
    const error = new ApiClientError({
      statusCode: 404,
      httpStatus: 404,
      code: 'product.not_found',
      message: 'Product not found.',
      errors: []
    });

    const presentation = getUiErrorPresentation(error, 'Fallback');

    expect(presentation.variant).toBe('notFound');
    expect(presentation.title).toBe('Not found');
    expect(presentation.retryable).toBe(false);
  });

  it('maps 409 errors to conflict presentation', () => {
    const error = new ApiClientError({
      statusCode: 409,
      httpStatus: 409,
      code: 'checkout.product_unavailable',
      message: 'Product unavailable during checkout.',
      errors: []
    });

    const presentation = getUiErrorPresentation(error, 'Fallback');

    expect(presentation.variant).toBe('conflict');
    expect(presentation.title).toBe('Action unavailable');
  });

  it('maps 401 errors to session-expired presentation', () => {
    const error = new ApiClientError({
      statusCode: 401,
      httpStatus: 401,
      code: 'auth.unauthorized',
      message: 'Unauthorized.',
      errors: []
    });

    const presentation = getUiErrorPresentation(error, 'Fallback');

    expect(presentation.variant).toBe('error');
    expect(presentation.title).toBe('Session expired');
    expect(presentation.message).toBe('Please sign in to continue.');
    expect(presentation.retryable).toBe(false);
  });

  it('marks network errors as retryable', () => {
    const error = new ApiClientError({
      statusCode: 0,
      httpStatus: 0,
      code: 'network.unavailable',
      message: 'Unable to reach the server.',
      errors: []
    });

    const presentation = getUiErrorPresentation(error, 'Fallback');

    expect(presentation.variant).toBe('network');
    expect(presentation.retryable).toBe(true);
  });
});
