import type { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface AuthFormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function AuthFormField({ label, error, className, id, ...props }: AuthFormFieldProps) {
  const fieldId = id ?? props.name;

  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={fieldId}
        className={twMerge(
          'w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:border-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900',
          error ? 'border-red-500' : '',
          className
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${fieldId}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
