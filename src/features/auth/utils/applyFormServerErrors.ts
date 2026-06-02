import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { isApiClientError, isValidationError } from '../../../lib/apiErrors';

const FIELD_NAME_PATTERN = /^([A-Za-z][A-Za-z0-9]*)\s*:/;

export interface ApplyFormServerErrorsResult {
  formMessage: string;
  fieldErrors: string[];
}

export function applyFormServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fieldMap: Partial<Record<string, Path<T>>> = {}
): ApplyFormServerErrorsResult | null {
  if (!isApiClientError(error) || !isValidationError(error)) {
    return null;
  }

  const { message, errors } = error.error;
  const fieldErrors: string[] = [];

  if (isValidationError(error) && errors.length > 0) {
    errors.forEach((entry) => {
      const match = entry.match(FIELD_NAME_PATTERN);
      const rawField = match?.[1];
      const mappedField = rawField ? fieldMap[rawField] : undefined;

      if (mappedField) {
        setError(mappedField, { message: entry });
      } else {
        fieldErrors.push(entry);
      }
    });
  }

  return {
    formMessage: message,
    fieldErrors
  };
}
