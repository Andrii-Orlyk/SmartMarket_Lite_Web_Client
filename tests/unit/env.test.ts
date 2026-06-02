import { afterEach, describe, expect, it, vi } from 'vitest';
import { getApiBaseUrl } from '../../src/lib/env';

describe('getApiBaseUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('prefers VITE_SMARTMARKET_API_BASE_URL over VITE_API_BASE_URL', () => {
    vi.stubEnv('VITE_SMARTMARKET_API_BASE_URL', 'http://smartmarket.test');
    vi.stubEnv('VITE_API_BASE_URL', 'http://generic.test');

    expect(getApiBaseUrl()).toBe('http://smartmarket.test');
  });

  it('falls back to VITE_API_BASE_URL when project variable is absent', () => {
    vi.stubEnv('VITE_SMARTMARKET_API_BASE_URL', '');
    vi.stubEnv('VITE_API_BASE_URL', 'http://generic.test');

    expect(getApiBaseUrl()).toBe('http://generic.test');
  });

  it('uses same-origin base in dev for local API URLs to enable Vite proxy', () => {
    vi.stubEnv('VITE_SMARTMARKET_API_BASE_URL', 'http://localhost:5000');
    vi.stubEnv('DEV', true);

    expect(getApiBaseUrl()).toBe('');
  });

  it('strips trailing slashes from configured URLs', () => {
    vi.stubEnv('VITE_SMARTMARKET_API_BASE_URL', 'http://api.example.com/');
    vi.stubEnv('DEV', false);

    expect(getApiBaseUrl()).toBe('http://api.example.com');
  });
});
