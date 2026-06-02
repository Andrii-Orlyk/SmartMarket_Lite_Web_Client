import { describe, expect, it } from 'vitest';
import { ApiClientError } from '../../src/lib/apiErrors';
import { getBusinessErrorMessage } from '../../src/lib/businessErrorMessages';
import { getUiErrorPresentation } from '../../src/components/feedback/getUiErrorPresentation';

describe('getBusinessErrorMessage', () => {
  it('maps empty cart conflict', () => {
    const error = new ApiClientError({
      statusCode: 409,
      httpStatus: 409,
      code: 'checkout.empty_cart',
      message: 'Cart is empty.',
      errors: []
    });

    expect(getBusinessErrorMessage(error)).toBe('Your cart is empty.');
  });

  it('maps insufficient stock conflict', () => {
    const error = new ApiClientError({
      statusCode: 409,
      httpStatus: 409,
      code: 'cart.insufficient_stock',
      message: 'Insufficient stock.',
      errors: []
    });

    expect(getBusinessErrorMessage(error)).toBe('Not enough stock available.');
  });

  it('maps product unavailable conflict', () => {
    const error = new ApiClientError({
      statusCode: 409,
      httpStatus: 409,
      code: 'checkout.product_unavailable',
      message: 'Product unavailable.',
      errors: []
    });

    expect(getBusinessErrorMessage(error)).toBe('This product is no longer available.');
  });

  it('maps server errors separately from business conflicts', () => {
    const error = new ApiClientError({
      statusCode: 500,
      httpStatus: 500,
      code: 'server.error',
      message: 'Internal error.',
      errors: []
    });

    expect(getBusinessErrorMessage(error)).toBe('Server error. Please try again later.');
  });
});

describe('getUiErrorPresentation with business messages', () => {
  it('uses business message for checkout stock conflict', () => {
    const error = new ApiClientError({
      statusCode: 409,
      httpStatus: 409,
      code: 'checkout.product_unavailable',
      message: 'One or more products are no longer available.',
      errors: []
    });

    const presentation = getUiErrorPresentation(error, 'Fallback');

    expect(presentation.message).toBe('This product is no longer available.');
  });
});
