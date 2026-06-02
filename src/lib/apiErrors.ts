import type { ApiErrorResponse } from '../types/api';

export type NormalizedApiError = ApiErrorResponse & {
  httpStatus: number;
};

export class ApiClientError extends Error {
  readonly error: NormalizedApiError;

  constructor(error: NormalizedApiError) {
    super(error.message);
    this.name = 'ApiClientError';
    this.error = error;
  }
}

const STATUS_FALLBACKS: Record<number, Pick<ApiErrorResponse, 'code' | 'message' | 'errors'>> = {
  400: {
    code: 'validation.failed',
    message: 'Please check the entered data.',
    errors: []
  },
  401: {
    code: 'auth.unauthorized',
    message: 'Your session is missing or expired.',
    errors: []
  },
  403: {
    code: 'auth.forbidden',
    message: 'You do not have permission to access this resource.',
    errors: []
  },
  404: {
    code: 'resource.not_found',
    message: 'The requested resource was not found.',
    errors: []
  },
  409: {
    code: 'business.conflict',
    message: 'This action conflicts with the current state.',
    errors: []
  },
  500: {
    code: 'server.error',
    message: 'Server error. Please try again later.',
    errors: []
  }
};

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.statusCode === 'number' &&
    typeof candidate.code === 'string' &&
    typeof candidate.message === 'string' &&
    Array.isArray(candidate.errors) &&
    candidate.errors.every((entry) => typeof entry === 'string')
  );
}

export function normalizeApiError(httpStatus: number, payload: unknown): NormalizedApiError {
  if (isApiErrorResponse(payload)) {
    return {
      ...payload,
      statusCode: payload.statusCode || httpStatus,
      httpStatus
    };
  }

  const parsed = parseAlternateErrorPayload(httpStatus, payload);
  if (parsed) {
    return parsed;
  }

  const fallback = STATUS_FALLBACKS[httpStatus] ?? {
    code: 'request.failed',
    message: 'The request could not be completed.',
    errors: []
  };

  return {
    statusCode: httpStatus,
    httpStatus,
    ...fallback
  };
}

export function createNetworkError(): NormalizedApiError {
  return {
    statusCode: 0,
    httpStatus: 0,
    code: 'network.unavailable',
    message: 'Unable to reach the server. Check your connection and try again.',
    errors: []
  };
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

export function isUnauthorizedError(error: unknown): boolean {
  return isApiClientError(error) && error.error.code === 'auth.unauthorized';
}

export function isForbiddenError(error: unknown): boolean {
  return isApiClientError(error) && error.error.code === 'auth.forbidden';
}

export function isNotFoundError(error: unknown): boolean {
  return (
    isApiClientError(error) &&
    (error.error.code === 'resource.not_found' || error.error.code === 'product.not_found')
  );
}

export function isConflictError(error: unknown): boolean {
  return isApiClientError(error) && (error.error.httpStatus === 409 || error.error.code.includes('conflict'));
}

export function isValidationError(error: unknown): boolean {
  return isApiClientError(error) && error.error.code === 'validation.failed';
}

export function isNetworkError(error: unknown): boolean {
  return isApiClientError(error) && error.error.code === 'network.unavailable';
}

export function isServerError(error: unknown): boolean {
  return isApiClientError(error) && (error.error.httpStatus >= 500 || error.error.code === 'server.error');
}

export function isDuplicateEmailError(error: unknown): boolean {
  if (!isApiClientError(error)) {
    return false;
  }

  const { httpStatus, code, message } = error.error;
  const normalizedMessage = message.toLowerCase();

  return (
    httpStatus === 409 &&
    (code.includes('email') ||
      normalizedMessage.includes('email') ||
      normalizedMessage.includes('already registered') ||
      normalizedMessage.includes('already exists'))
  );
}

function parseAlternateErrorPayload(httpStatus: number, payload: unknown): NormalizedApiError | null {
  if (typeof payload !== 'object' || payload === null) {
    return null;
  }

  const candidate = payload as Record<string, unknown>;

  if (isApiErrorResponse(candidate.error)) {
    const nested = candidate.error;
    return {
      ...nested,
      statusCode: nested.statusCode || httpStatus,
      httpStatus
    };
  }

  const status =
    typeof candidate.status === 'number'
      ? candidate.status
      : typeof candidate.statusCode === 'number'
        ? candidate.statusCode
        : httpStatus;

  if (status === 400 && candidate.errors && typeof candidate.errors === 'object' && !Array.isArray(candidate.errors)) {
    const flatErrors: string[] = [];

    for (const [field, messages] of Object.entries(candidate.errors as Record<string, unknown>)) {
      if (Array.isArray(messages)) {
        messages.forEach((entry) => flatErrors.push(`${field}: ${String(entry)}`));
      }
    }

    const detail =
      typeof candidate.detail === 'string'
        ? candidate.detail
        : typeof candidate.title === 'string'
          ? candidate.title
          : 'Please check the entered data.';

    return {
      statusCode: status,
      httpStatus: status,
      code: 'validation.failed',
      message: detail,
      errors: flatErrors
    };
  }

  const detail =
    typeof candidate.detail === 'string'
      ? candidate.detail
      : typeof candidate.message === 'string'
        ? candidate.message
        : typeof candidate.title === 'string'
          ? candidate.title
          : null;

  if (!detail) {
    return null;
  }

  const code =
    typeof candidate.code === 'string'
      ? candidate.code
      : status === 401
        ? 'auth.unauthorized'
        : status === 403
          ? 'auth.forbidden'
          : status === 404
            ? 'resource.not_found'
            : status === 409
              ? 'business.conflict'
              : status === 400
                ? 'validation.failed'
                : status >= 500
                  ? 'server.error'
                  : 'request.failed';

  return {
    statusCode: status,
    httpStatus: status,
    code,
    message: detail,
    errors: Array.isArray(candidate.errors)
      ? candidate.errors.filter((entry): entry is string => typeof entry === 'string')
      : []
  };
}
