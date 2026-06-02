import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiClientError } from '../../src/lib/apiErrors';
import { apiRequest, buildQueryString } from '../../src/api/httpClient';

const fetchMock = vi.fn();

vi.stubGlobal('fetch', fetchMock);

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
  localStorage.clear();
});

describe('apiRequest', () => {
  it('parses successful GET JSON responses', async () => {
    fetchMock.mockImplementation(
      createFetchMock({
        ok: true,
        status: 200,
        body: { id: '1', name: 'Mouse' }
      })
    );

    const result = await apiRequest<{ id: string; name: string }>('/api/products/1');

    expect(result).toEqual({ id: '1', name: 'Mouse' });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/products/1'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('sends JSON body on POST requests', async () => {
    fetchMock.mockImplementation(createFetchMock({ ok: true, status: 200, body: { token: 'abc' } }));

    await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email: 'a@b.com', password: 'secret' },
      token: null
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'a@b.com', password: 'secret' })
      })
    );
  });

  it('adds Authorization header when token exists', async () => {
    localStorage.setItem('smartmarket.auth.token', 'test-token');
    fetchMock.mockImplementation(createFetchMock({ ok: true, status: 200, body: {} }));

    await apiRequest('/api/auth/me');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token'
        })
      })
    );
  });

  it('maps 401 responses to session-expired ApiClientError', async () => {
    fetchMock.mockImplementation(createFetchMock({ ok: false, status: 401, body: null }));

    await expect(apiRequest('/api/auth/me')).rejects.toMatchObject({
      error: {
        code: 'auth.unauthorized',
        httpStatus: 401
      }
    });
  });

  it('maps 409 responses to business conflict ApiClientError', async () => {
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

    await expect(apiRequest('/api/checkout', { method: 'POST' })).rejects.toBeInstanceOf(ApiClientError);
  });

  it('maps network failures to network.unavailable errors', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(apiRequest('/api/products')).rejects.toMatchObject({
      error: { code: 'network.unavailable' }
    });
  });
});

describe('buildQueryString', () => {
  it('builds query params and skips empty values', () => {
    expect(
      buildQueryString({
        search: 'mouse',
        page: 2,
        minPrice: undefined,
        maxPrice: ''
      })
    ).toBe('?search=mouse&page=2');
  });
});
