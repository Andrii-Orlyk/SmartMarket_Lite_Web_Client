import { describe, expect, it } from 'vitest';
import { normalizeApiError } from '../../src/lib/apiErrors';
import { cartFixture, orderFixture } from '../fixtures/apiFixtures';
import { formatMoney } from '../../src/features/products/utils/formatMoney';

describe('API contract fixtures', () => {
  it('includes required ProductDto fields in catalog fixtures', () => {
    expect(cartFixture.items[0]?.productName).toBeTruthy();
    expect(cartFixture.items[0]?.unitPriceSnapshot).toBeGreaterThan(0);
    expect(cartFixture.items[0]?.lineTotal).toBeGreaterThan(0);
  });

  it('displays cart line totals using formatted money', () => {
    expect(formatMoney(cartFixture.totalAmount)).toBe('$59.98');
    expect(formatMoney(cartFixture.items[0]!.lineTotal)).toBe('$59.98');
  });

  it('uses order item snapshot fields for order history display', () => {
    const item = orderFixture.items[0]!;

    expect(item.productNameSnapshot).toBe('Wireless Mouse');
    expect(formatMoney(item.unitPriceSnapshot)).toBe('$29.99');
    expect(item.lineTotal).toBe(59.98);
  });

  it('normalizes ApiErrorResponse payloads', () => {
    const normalized = normalizeApiError(400, {
      statusCode: 400,
      code: 'validation.failed',
      message: 'Validation failed.',
      errors: ['Quantity must be greater than 0.']
    });

    expect(normalized.code).toBe('validation.failed');
    expect(normalized.errors).toContain('Quantity must be greater than 0.');
  });
});
