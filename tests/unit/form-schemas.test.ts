import { describe, expect, it } from 'vitest';
import { cartItemQuantitySchema } from '../../src/features/cart/schemas/cartSchemas';
import { catalogFilterSchema, productFormSchema } from '../../src/features/products/schemas/productSchemas';

describe('productFormSchema', () => {
  it('rejects non-positive price', () => {
    const result = productFormSchema.safeParse({
      name: 'Mouse',
      sku: 'MOUSE-1',
      price: 0,
      stockQuantity: 5,
      isActive: true
    });

    expect(result.success).toBe(false);
  });

  it('rejects negative stock quantity', () => {
    const result = productFormSchema.safeParse({
      name: 'Mouse',
      sku: 'MOUSE-1',
      price: 19.99,
      stockQuantity: -1,
      isActive: true
    });

    expect(result.success).toBe(false);
  });

  it('accepts valid product payload', () => {
    const result = productFormSchema.safeParse({
      name: 'Mouse',
      description: 'Wireless mouse',
      sku: 'MOUSE-1',
      price: 19.99,
      stockQuantity: 10,
      isActive: true
    });

    expect(result.success).toBe(true);
  });
});

describe('catalogFilterSchema', () => {
  it('rejects min price greater than max price', () => {
    const result = catalogFilterSchema.safeParse({
      minPrice: '100',
      maxPrice: '20'
    });

    expect(result.success).toBe(false);
  });
});

describe('cartItemQuantitySchema', () => {
  it('rejects zero or negative quantity', () => {
    expect(cartItemQuantitySchema.safeParse({ quantity: 0 }).success).toBe(false);
    expect(cartItemQuantitySchema.safeParse({ quantity: -2 }).success).toBe(false);
  });

  it('accepts positive quantity', () => {
    expect(cartItemQuantitySchema.safeParse({ quantity: 3 }).success).toBe(true);
  });
});
