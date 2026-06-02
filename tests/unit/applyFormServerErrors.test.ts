import { describe, expect, it, vi } from 'vitest';
import { ApiClientError } from '../../src/lib/apiErrors';
import { applyFormServerErrors } from '../../src/features/auth/utils/applyFormServerErrors';

describe('applyFormServerErrors', () => {
  it('maps known server field errors to react-hook-form fields', () => {
    const setError = vi.fn();
    const error = new ApiClientError({
      statusCode: 400,
      httpStatus: 400,
      code: 'validation.failed',
      message: 'Validation failed.',
      errors: ['Email: Email is already registered.']
    });

    const result = applyFormServerErrors(error, setError, { Email: 'email' });

    expect(result?.formMessage).toBe('Validation failed.');
    expect(setError).toHaveBeenCalledWith('email', {
      message: 'Email: Email is already registered.'
    });
  });

  it('returns null for non-validation API errors', () => {
    const setError = vi.fn();
    const error = new ApiClientError({
      statusCode: 401,
      httpStatus: 401,
      code: 'auth.unauthorized',
      message: 'Unauthorized.',
      errors: []
    });

    expect(applyFormServerErrors(error, setError)).toBeNull();
    expect(setError).not.toHaveBeenCalled();
  });
});
