import type { CartDto, OrderDto, ProductDto } from '../../src/types/api';

export const productFixture: ProductDto = {
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

export const inactiveProductFixture: ProductDto = {
  ...productFixture,
  id: 'product-2',
  name: 'Legacy Keyboard',
  isActive: false,
  stockQuantity: 0
};

export const cartFixture: CartDto = {
  id: 'cart-1',
  userId: 'user-1',
  items: [
    {
      id: 'cart-item-1',
      productId: productFixture.id,
      productName: productFixture.name,
      quantity: 2,
      unitPriceSnapshot: productFixture.price,
      lineTotal: 59.98
    }
  ],
  totalAmount: 59.98
};

export const emptyCartFixture: CartDto = {
  id: 'cart-1',
  userId: 'user-1',
  items: [],
  totalAmount: 0
};

export const orderFixture: OrderDto = {
  id: 'order-1',
  orderNumber: 'ORD-1001',
  status: 'Pending',
  paymentStatus: 'Pending',
  totalAmount: 59.98,
  createdAt: '2026-01-02T12:00:00Z',
  items: [
    {
      id: 'order-item-1',
      productId: productFixture.id,
      productNameSnapshot: productFixture.name,
      unitPriceSnapshot: productFixture.price,
      quantity: 2,
      lineTotal: 59.98
    }
  ]
};
