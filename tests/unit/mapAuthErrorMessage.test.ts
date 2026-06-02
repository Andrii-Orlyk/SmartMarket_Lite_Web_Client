import { describe, expect, it } from 'vitest';
import { ApiClientError } from '../../src/lib/apiErrors';
import {
  mapAuthErrorMessage,
  mapRegisterErrorMessage
} from '../../src/features/auth/utils/mapAuthErrorMessage';

describe('mapAuthErrorMessage', () => {
  it('maps 401 to invalid credentials message', () => {
    const error = new ApiClientError({
      statusCode: 401,
      httpStatus: 401,
      code: 'auth.unauthorized',
      message: 'Unauthorized.',
      errors: []
    });

    expect(mapAuthErrorMessage(error, 'Fallback')).toBe('Invalid email or password.');
  });

  it('maps network failures to connection message', () => {
    const error = new ApiClientError({
      statusCode: 0,
      httpStatus: 0,
      code: 'network.unavailable',
      message: 'Unable to reach the server. Check your connection and try again.',
      errors: []
    });

    expect(mapAuthErrorMessage(error, 'Fallback')).toBe(
      'Unable to reach the server. Check your connection and try again.'
    );
  });

  it('maps 500 to server error message', () => {
    const error = new ApiClientError({
      statusCode: 500,
      httpStatus: 500,
      code: 'server.error',
      message: 'Server error. Please try again later.',
      errors: []
    });

    expect(mapAuthErrorMessage(error, 'Fallback')).toBe('Server error. Please try again later.');
  });

  it('maps validation errors to API message when present', () => {
    const error = new ApiClientError({
      statusCode: 400,
      httpStatus: 400,
      code: 'validation.failed',
      message: 'Email is required.',
      errors: ['Email: Email is required.']
    });

    expect(mapAuthErrorMessage(error, 'Fallback')).toBe('Email is required.');
  });
});

describe('mapRegisterErrorMessage', () => {
  it('maps duplicate email conflict to email-specific message', () => {
    const error = new ApiClientError({
      statusCode: 409,
      httpStatus: 409,
      code: 'auth.email_exists',
      message: 'Email is already registered.',
      errors: []
    });

    expect(mapRegisterErrorMessage(error, 'Fallback')).toBe('Email is already registered.');
  });
});
