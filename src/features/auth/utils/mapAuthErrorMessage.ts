import {
  isApiClientError,
  isDuplicateEmailError,
  isNetworkError,
  isServerError,
  isUnauthorizedError,
  isValidationError
} from '../../../lib/apiErrors';

export function mapAuthErrorMessage(error: unknown, fallback: string): string {
  if (isUnauthorizedError(error)) {
    return 'Invalid email or password.';
  }

  if (isValidationError(error)) {
    if (isApiClientError(error) && error.error.message) {
      return error.error.message;
    }

    return 'Please check the entered data.';
  }

  if (isNetworkError(error)) {
    return 'Unable to reach the server. Check your connection and try again.';
  }

  if (isServerError(error)) {
    return 'Server error. Please try again later.';
  }

  if (isDuplicateEmailError(error)) {
    return 'Email is already registered.';
  }

  if (isApiClientError(error)) {
    return error.error.message || fallback;
  }

  return fallback;
}

export function mapRegisterErrorMessage(error: unknown, fallback: string): string {
  if (isDuplicateEmailError(error)) {
    return 'Email is already registered.';
  }

  return mapAuthErrorMessage(error, fallback);
}
