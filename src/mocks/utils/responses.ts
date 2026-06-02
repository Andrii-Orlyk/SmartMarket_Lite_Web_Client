import type { ApiErrorResponse } from '../../types/api';

export function jsonResponse<T>(body: T, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function errorResponse(
  status: number,
  code: string,
  message: string,
  errors: string[] = []
): Response {
  const body: ApiErrorResponse = {
    statusCode: status,
    code,
    message,
    errors
  };

  return jsonResponse(body, status);
}

export function emptyResponse(status = 204): Response {
  return new Response(null, { status });
}
