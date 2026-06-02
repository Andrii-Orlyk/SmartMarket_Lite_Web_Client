import { afterEach, describe, expect, it, vi } from 'vitest';
import { smartMarketApi } from '../../src/api/smartMarketApi';

const fetchMock = vi.fn();

vi.stubGlobal('fetch', fetchMock);

vi.mock('../../src/lib/env', () => ({
  getApiBaseUrl: () => 'http://localhost:5000'
}));

function createFetchMock(response: {
  ok: boolean;
  status: number;
  body?: unknown;
  text?: string;
}) {
  return vi.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status,
    text: async () =>
      response.text ?? (response.body !== undefined ? JSON.stringify(response.body) : '')
  });
}

afterEach(() => {
  fetchMock.mockReset();
});

describe('cart API', () => {
  it('get cart calls correct endpoint', async () => {
    fetchMock.mockImplementation(createFetchMock({ ok: true, status: 200, body: { id: 'c1', items: [], totalAmount: 0 } }));

    await smartMarketApi.cart.get();

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5000/api/cart', expect.any(Object));
  });

  it('add item sends productId and quantity', async () => {
    fetchMock.mockImplementation(createFetchMock({ ok: true, status: 200, body: { id: 'c1', items: [], totalAmount: 0 } }));

    await smartMarketApi.cart.addItem({ productId: 'p1', quantity: 2 });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5000/api/cart/items',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ productId: 'p1', quantity: 2 })
      })
    );
  });

  it('update quantity sends correct payload', async () => {
    fetchMock.mockImplementation(createFetchMock({ ok: true, status: 200, body: { id: 'c1', items: [], totalAmount: 0 } }));

    await smartMarketApi.cart.updateItem('item-1', { quantity: 3 });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5000/api/cart/items/item-1',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ quantity: 3 })
      })
    );
  });

  it('remove item calls delete endpoint', async () => {
    fetchMock.mockImplementation(createFetchMock({ ok: true, status: 200, body: { id: 'c1', items: [], totalAmount: 0 } }));

    await smartMarketApi.cart.removeItem('item-1');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5000/api/cart/items/item-1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});

describe('checkout and orders API', () => {
  it('checkout calls POST /api/checkout', async () => {
    fetchMock.mockImplementation(createFetchMock({ ok: true, status: 200, body: { id: 'o1', orderNumber: 'ORD-1' } }));

    await smartMarketApi.checkout.create();

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5000/api/checkout',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('order history calls GET /api/orders', async () => {
    fetchMock.mockImplementation(createFetchMock({ ok: true, status: 200, body: [] }));

    await smartMarketApi.orders.list();

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5000/api/orders', expect.any(Object));
  });

  it('order details calls GET /api/orders/:id', async () => {
    fetchMock.mockImplementation(createFetchMock({ ok: true, status: 200, body: { id: 'o1' } }));

    await smartMarketApi.orders.getById('o1');

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5000/api/orders/o1', expect.any(Object));
  });

  it('handles checkout conflict response', async () => {
    fetchMock.mockImplementation(
      createFetchMock({
        ok: false,
        status: 409,
        body: {
          statusCode: 409,
          code: 'checkout.product_unavailable',
          message: 'Product unavailable during checkout.',
          errors: []
        }
      })
    );

    await expect(smartMarketApi.checkout.create()).rejects.toMatchObject({
      error: { httpStatus: 409, code: 'checkout.product_unavailable' }
    });
  });
});
