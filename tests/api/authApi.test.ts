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
  localStorage.clear();
});

describe('auth API', () => {
  it('login sends correct request body', async () => {
    fetchMock.mockImplementation(createFetchMock({ ok: true, status: 200, body: { token: 'jwt' } }));

    await smartMarketApi.auth.login({ email: 'buyer@example.com', password: 'secret123' });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5000/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'buyer@example.com', password: 'secret123' })
      })
    );
  });

  it('register sends correct request body', async () => {
    fetchMock.mockImplementation(createFetchMock({ ok: true, status: 200, body: { token: 'jwt' } }));

    await smartMarketApi.auth.register({
      email: 'buyer@example.com',
      password: 'secret123',
      firstName: 'Alex',
      lastName: 'Buyer'
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5000/api/auth/register',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'buyer@example.com',
          password: 'secret123',
          firstName: 'Alex',
          lastName: 'Buyer'
        })
      })
    );
  });

  it('me calls GET /api/auth/me with bearer token', async () => {
    localStorage.setItem('smartmarket.auth.token', 'jwt-token');
    fetchMock.mockImplementation(
      createFetchMock({
        ok: true,
        status: 200,
        body: { id: '1', email: 'buyer@example.com', firstName: 'Alex', lastName: 'Buyer', role: 'User' }
      })
    );

    await smartMarketApi.auth.me();

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5000/api/auth/me',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer jwt-token' })
      })
    );
  });
});
