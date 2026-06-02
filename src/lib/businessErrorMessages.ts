import { isApiClientError, isNetworkError, isServerError, isUnauthorizedError } from './apiErrors';

function normalizeText(value: string): string {
  return value.toLowerCase();
}

/**
 * Maps known API business errors to user-friendly copy for cart, checkout, and catalog flows.
 * Returns null when the caller should use generic presentation.
 */
export function getBusinessErrorMessage(error: unknown): string | null {
  if (isNetworkError(error)) {
    return 'Unable to reach the server. Check your connection and try again.';
  }

  if (!isApiClientError(error)) {
    return null;
  }

  const { httpStatus, code, message } = error.error;
  const normalizedCode = normalizeText(code);
  const normalizedMessage = normalizeText(message);

  if (isUnauthorizedError(error) || httpStatus === 401) {
    return 'Please sign in to continue.';
  }

  if (httpStatus === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (httpStatus === 404) {
    return 'The requested item was not found.';
  }

  if (httpStatus === 400 || normalizedCode.includes('validation')) {
    if (normalizedMessage.includes('cart')) {
      return 'Please check your cart and try again.';
    }

    return message || 'Please check the entered data.';
  }

  if (httpStatus === 409) {
    if (
      normalizedCode.includes('empty') ||
      normalizedMessage.includes('empty cart') ||
      normalizedMessage.includes('cart is empty')
    ) {
      return 'Your cart is empty.';
    }

    if (
      normalizedCode.includes('insufficient') ||
      normalizedCode.includes('stock') ||
      normalizedMessage.includes('not enough stock') ||
      normalizedMessage.includes('insufficient stock')
    ) {
      return 'Not enough stock available.';
    }

    if (
      normalizedCode.includes('unavailable') ||
      normalizedCode.includes('checkout.product') ||
      normalizedMessage.includes('no longer available') ||
      normalizedMessage.includes('not available')
    ) {
      return 'This product is no longer available.';
    }

    return message || null;
  }

  if (isServerError(error)) {
    return 'Server error. Please try again later.';
  }

  return null;
}
