import type { ProductDto } from '../../types/api';

const BASE_TIME = '2026-01-15T10:00:00Z';

export function createSeedProducts(): ProductDto[] {
  return [
    {
      id: 'product-mouse',
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse for everyday use.',
      sku: 'WM-001',
      price: 29.99,
      stockQuantity: 12,
      isActive: true,
      createdAt: BASE_TIME,
      updatedAt: BASE_TIME
    },
    {
      id: 'product-keyboard',
      name: 'Mechanical Keyboard',
      description: 'Compact mechanical keyboard with tactile switches.',
      sku: 'KB-002',
      price: 89.5,
      stockQuantity: 8,
      isActive: true,
      createdAt: BASE_TIME,
      updatedAt: BASE_TIME
    },
    {
      id: 'product-hub',
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with HDMI and card reader.',
      sku: 'HUB-003',
      price: 45,
      stockQuantity: 1,
      isActive: true,
      createdAt: BASE_TIME,
      updatedAt: BASE_TIME
    },
    {
      id: 'product-headphones',
      name: 'Noise-Canceling Headphones',
      description: 'Over-ear headphones with active noise cancellation.',
      sku: 'HP-004',
      price: 129.99,
      stockQuantity: 0,
      isActive: true,
      createdAt: BASE_TIME,
      updatedAt: BASE_TIME
    },
    {
      id: 'product-legacy',
      name: 'Legacy Webcam',
      description: 'Discontinued webcam model.',
      sku: 'WC-OLD',
      price: 19.99,
      stockQuantity: 5,
      isActive: false,
      createdAt: BASE_TIME,
      updatedAt: BASE_TIME
    },
    {
      id: 'product-stand',
      name: 'Laptop Stand',
      description: 'Adjustable aluminum laptop stand.',
      sku: 'LS-005',
      price: 39,
      stockQuantity: 15,
      isActive: true,
      createdAt: BASE_TIME,
      updatedAt: BASE_TIME
    }
  ];
}
