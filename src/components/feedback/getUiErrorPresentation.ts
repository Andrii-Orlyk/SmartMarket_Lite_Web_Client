import {
  isApiClientError,
  isConflictError,
  isForbiddenError,
  isNetworkError,
  isNotFoundError,
  isUnauthorizedError,
  isValidationError
} from '../../lib/apiErrors';
import { getBusinessErrorMessage } from '../../lib/businessErrorMessages';

export type UiErrorVariant = 'error' | 'forbidden' | 'notFound' | 'conflict' | 'validation' | 'network';

export interface UiErrorPresentation {
  variant: UiErrorVariant;
  title: string;
  message: string;
  retryable: boolean;
}

export function getUiErrorPresentation(error: unknown, fallbackMessage: string): UiErrorPresentation {
  const businessMessage = getBusinessErrorMessage(error);

  if (isUnauthorizedError(error)) {
    return {
      variant: 'error',
      title: 'Session expired',
      message: businessMessage ?? 'Please sign in to continue.',
      retryable: false
    };
  }

  if (isForbiddenError(error)) {
    return {
      variant: 'forbidden',
      title: 'Access denied',
      message: businessMessage ?? 'You do not have permission to perform this action.',
      retryable: false
    };
  }

  if (isNotFoundError(error)) {
    return {
      variant: 'notFound',
      title: 'Not found',
      message: businessMessage ?? 'The requested item was not found.',
      retryable: false
    };
  }

  if (isConflictError(error)) {
    return {
      variant: 'conflict',
      title: 'Action unavailable',
      message: businessMessage ?? (isApiClientError(error) ? error.error.message : fallbackMessage),
      retryable: false
    };
  }

  if (isValidationError(error)) {
    return {
      variant: 'validation',
      title: 'Validation failed',
      message: businessMessage ?? (isApiClientError(error) ? error.error.message : fallbackMessage),
      retryable: false
    };
  }

  if (isNetworkError(error)) {
    return {
      variant: 'network',
      title: 'Connection problem',
      message: businessMessage ?? 'Unable to reach the server. Check your connection and try again.',
      retryable: true
    };
  }

  if (businessMessage) {
    return {
      variant: isApiClientError(error) && error.error.httpStatus >= 500 ? 'error' : 'conflict',
      title: isApiClientError(error) && error.error.httpStatus >= 500 ? 'Server error' : 'Action unavailable',
      message: businessMessage,
      retryable: isApiClientError(error) ? error.error.httpStatus >= 500 : false
    };
  }

  if (isApiClientError(error)) {
    return {
      variant: 'error',
      title: 'Something went wrong',
      message: error.error.message || fallbackMessage,
      retryable: error.error.httpStatus >= 500
    };
  }

  return {
    variant: 'error',
    title: 'Something went wrong',
    message: fallbackMessage,
    retryable: true
  };
}
