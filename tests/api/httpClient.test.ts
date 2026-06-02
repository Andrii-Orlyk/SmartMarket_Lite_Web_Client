import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiClientError } from '../../src/lib/apiErrors';
import { apiRequest, buildQueryString } from '../../src/api/httpClient';

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
  localStorage.clear();
});

describe('httpClient apiRequest', () => {
  it('builds URL from configured API base URL', async () => {
    fetchMock.mockImplementation(createFetchMock({ ok: true, status: 200, body: {} }));

    await apiRequest('/api/products');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5000/api/products',
      expect.any(Object)
    );
  });

  it('adds Authorization header when token exists', async () => {
    localStorage.setItem('smartmarket.auth.token', 'test-token');
    fetchMock.mockImplementation(createFetchMock({ ok: true, status: 200, body: {} }));

    await apiRequest('/api/auth/me');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' })
      })
    );
  });

  it('does not add Authorization header when token is explicitly null', async () => {
    localStorage.setItem('smartmarket.auth.token', 'test-token');
    fetchMock.mockImplementation(createFetchMock({ ok: true, status: 200, body: { token: 'x' } }));

    await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email: 'a@b.com', password: 'secret' },
      token: null
    });

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(options.headers).not.toHaveProperty('Authorization');
  });

  it('parses successful JSON responses', async () => {
    fetchMock.mockImplementation(
      createFetchMock({ ok: true, status: 200, body: { token: 'abc' } })
    );

    await expect(apiRequest<{ token: string }>('/api/auth/login')).resolves.toEqual({ token: 'abc' });
  });

  it('handles empty responses safely', async () => {
    fetchMock.mockImplementation(createFetchMock({ ok: true, status: 204, text: '' }));

    await expect(apiRequest<void>('/api/cart/items/1', { method: 'DELETE' })).resolves.toBeNull();
  });

  it('maps 400 validation errors to structured ApiClientError', async () => {
    fetchMock.mockImplementation(
      createFetchMock({
        ok: false,
        status: 400,
        body: {
          statusCode: 400,
          code: 'validation.failed',
          message: 'Please check the entered data.',
          errors: ['Email: Invalid format']
        }
      })
    );

    await expect(apiRequest('/api/auth/register', { method: 'POST' })).rejects.toMatchObject({
      error: { code: 'validation.failed', httpStatus: 400 }
    });
  });

  it('maps 401, 403, 404, and 409 HTTP responses without treating them as network errors', async () => {
    for (const [status, code] of [
      [401, 'auth.unauthorized'],
      [403, 'auth.forbidden'],
      [404, 'resource.not_found'],
      [409, 'business.conflict']
    ] as const) {
      fetchMock.mockImplementation(createFetchMock({ ok: false, status, body: null }));

      await expect(apiRequest('/api/test')).rejects.toMatchObject({
        error: { code, httpStatus: status }
      });
    }
  });

  it('maps fetch failures to network.unavailable only', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(apiRequest('/api/products')).rejects.toMatchObject({
      error: { code: 'network.unavailable' }
    });
  });
});

describe('buildQueryString', () => {
  it('builds query params and skips empty values', () => {
    expect(buildQueryString({ search: 'mouse', page: 2, minPrice: undefined, maxPrice: '' })).toBe(
      '?search=mouse&page=2'
    );
  });
});

describe('ApiClientError distinction', () => {
  it('keeps HTTP and network errors separate', async () => {
    fetchMock.mockImplementation(createFetchMock({ ok: false, status: 401, body: null }));

    try {
      await apiRequest('/api/auth/login', { method: 'POST' });
    } catch (error) {
      expect(error).toBeInstanceOf(ApiClientError);
      expect((error as ApiClientError).error.code).toBe('auth.unauthorized');
      expect((error as ApiClientError).error.code).not.toBe('network.unavailable');
    }
  });
});
