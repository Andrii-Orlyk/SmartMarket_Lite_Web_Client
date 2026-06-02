import {
  ApiClientError,
  createNetworkError,
  normalizeApiError
} from '../lib/apiErrors';
import { getAuthToken } from '../lib/authToken';
import { getApiBaseUrl } from '../lib/env';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  token?: string | null;
  headers?: Record<string, string>;
}

function resolveAuthToken(explicitToken?: string | null): string | null {
  if (explicitToken === null) {
    return null;
  }

  if (explicitToken !== undefined) {
    return explicitToken;
  }

  return getAuthToken();
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function joinApiUrl(baseUrl: string, path: string): string {
  if (!baseUrl) {
    return path;
  }

  const normalizedBase = baseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export async function apiRequest<TResponse, TBody = unknown>(
  path: string,
  options: ApiRequestOptions<TBody> = {}
): Promise<TResponse> {
  const token = resolveAuthToken(options.token);
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  let response: Response;

  try {
    response = await fetch(joinApiUrl(getApiBaseUrl(), path), {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined
    });
  } catch {
    throw new ApiClientError(createNetworkError());
  }

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiClientError(normalizeApiError(response.status, payload));
  }

  return payload as TResponse;
}

export function buildQueryString(params: object): string {
  const searchParams = new URLSearchParams();
  const record = params as Record<string, string | number | boolean | undefined | null>;

  for (const [key, value] of Object.entries(record)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}
