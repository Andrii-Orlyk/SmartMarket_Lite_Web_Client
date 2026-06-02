import { describe, expect, it } from 'vitest';
import { inactiveProductFixture, productFixture } from '../fixtures/apiFixtures';
import {
  canAddProductToCart,
  getAddToCartButtonLabel,
  getProductAvailabilityLabel,
  getProductStockHint,
  isProductAvailable
} from '../../src/features/products/utils/productAvailability';

describe('productAvailability', () => {
  it('treats active in-stock products as available', () => {
    expect(isProductAvailable(productFixture)).toBe(true);
    expect(getProductAvailabilityLabel(productFixture)).toBe('Available');
    expect(getProductStockHint(productFixture)).toBe('12 in stock');
    expect(canAddProductToCart(productFixture)).toBe(true);
    expect(getAddToCartButtonLabel(productFixture)).toBe('Add to cart');
  });

  it('treats zero stock as out of stock', () => {
    const outOfStock = { ...productFixture, stockQuantity: 0 };

    expect(isProductAvailable(outOfStock)).toBe(false);
    expect(getProductAvailabilityLabel(outOfStock)).toBe('Out of stock');
    expect(getAddToCartButtonLabel(outOfStock)).toBe('Out of stock');
  });

  it('treats inactive products as unavailable', () => {
    expect(isProductAvailable(inactiveProductFixture)).toBe(false);
    expect(getProductAvailabilityLabel(inactiveProductFixture)).toBe('Unavailable');
    expect(getAddToCartButtonLabel(inactiveProductFixture)).toBe('Unavailable');
  });

  it('shows only 1 left for single unit stock', () => {
    const oneLeft = { ...productFixture, stockQuantity: 1 };

    expect(getProductStockHint(oneLeft)).toBe('Only 1 left');
  });
});
