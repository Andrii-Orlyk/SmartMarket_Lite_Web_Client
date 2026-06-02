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

describe('products API', () => {
  it('get products calls list endpoint with query params', async () => {
    fetchMock.mockImplementation(createFetchMock({ ok: true, status: 200, body: { items: [], page: 1, pageSize: 12, totalCount: 0, totalPages: 0 } }));

    await smartMarketApi.products.list({ search: 'mouse', page: 1 });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5000/api/products?search=mouse&page=1',
      expect.any(Object)
    );
  });

  it('get product details calls product endpoint', async () => {
    fetchMock.mockImplementation(createFetchMock({ ok: true, status: 200, body: { id: 'p1' } }));

    await smartMarketApi.products.getById('p1');

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5000/api/products/p1', expect.any(Object));
  });

  it('handles 404 product not found', async () => {
    fetchMock.mockImplementation(
      createFetchMock({
        ok: false,
        status: 404,
        body: {
          statusCode: 404,
          code: 'product.not_found',
          message: 'Product not found.',
          errors: []
        }
      })
    );

    await expect(smartMarketApi.products.getById('missing')).rejects.toMatchObject({
      error: { code: 'product.not_found', httpStatus: 404 }
    });
  });
});
