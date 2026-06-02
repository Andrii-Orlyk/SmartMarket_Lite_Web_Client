import { describe, expect, it } from 'vitest';
import { normalizeApiError } from '../../src/lib/apiErrors';

describe('normalizeApiError', () => {
  it('parses standard ApiErrorResponse payloads', () => {
    const result = normalizeApiError(401, {
      statusCode: 401,
      code: 'auth.unauthorized',
      message: 'Invalid credentials.',
      errors: []
    });

    expect(result.code).toBe('auth.unauthorized');
    expect(result.httpStatus).toBe(401);
    expect(result.message).toBe('Invalid credentials.');
  });

  it('parses ASP.NET validation problem details', () => {
    const result = normalizeApiError(400, {
      status: 400,
      title: 'Validation failed',
      detail: 'One or more validation errors occurred.',
      errors: {
        Email: ['Email is already registered.']
      }
    });

    expect(result.code).toBe('validation.failed');
    expect(result.errors).toContain('Email: Email is already registered.');
  });

  it('parses RFC 7807 problem details for auth failures', () => {
    const result = normalizeApiError(401, {
      status: 401,
      title: 'Unauthorized',
      detail: 'Invalid email or password.'
    });

    expect(result.code).toBe('auth.unauthorized');
    expect(result.message).toBe('Invalid email or password.');
  });

  it('does not map HTTP failures to network errors', () => {
    const result = normalizeApiError(404, null);

    expect(result.code).toBe('resource.not_found');
    expect(result.code).not.toBe('network.unavailable');
  });
});
