import { describe, expect, it } from 'vitest';
import { inactiveProductFixture, productFixture } from '../fixtures/apiFixtures';
import {
  canAddProductToCart,
  getAddToCartDisabledReason
} from '../../src/features/products/utils/canAddProductToCart';

describe('canAddProductToCart', () => {
  it('allows active in-stock products', () => {
    expect(canAddProductToCart(productFixture)).toBe(true);
    expect(getAddToCartDisabledReason(productFixture)).toBeNull();
  });

  it('blocks inactive products', () => {
    expect(canAddProductToCart(inactiveProductFixture)).toBe(false);
    expect(getAddToCartDisabledReason(inactiveProductFixture)).toMatch(/no longer available/i);
  });

  it('blocks out-of-stock products', () => {
    const outOfStock = { ...productFixture, stockQuantity: 0 };

    expect(canAddProductToCart(outOfStock)).toBe(false);
    expect(getAddToCartDisabledReason(outOfStock)).toMatch(/out of stock/i);
  });
});
