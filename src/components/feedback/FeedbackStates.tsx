import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface LoadingStateProps {
  message?: string;
  ariaLabel?: string;
  className?: string;
}

export function LoadingState({
  message = 'Loading…',
  ariaLabel = 'Loading',
  className
}: LoadingStateProps) {
  return (
    <div
      className={twMerge(
        'rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm',
        className
      )}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className
}: EmptyStateProps) {
  return (
    <div
      className={twMerge(
        'rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm',
        className
      )}
    >
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

type FeedbackTone = 'error' | 'warning' | 'info' | 'success';

const toneStyles: Record<
  FeedbackTone,
  { container: string; title: string; message: string; button: string }
> = {
  error: {
    container: 'border-red-200 bg-red-50',
    title: 'text-red-900',
    message: 'text-red-700',
    button:
      'bg-red-900 hover:bg-red-800 focus-visible:outline-red-900'
  },
  warning: {
    container: 'border-amber-200 bg-amber-50',
    title: 'text-amber-900',
    message: 'text-amber-800',
    button:
      'bg-amber-900 hover:bg-amber-800 focus-visible:outline-amber-900'
  },
  info: {
    container: 'border-slate-200 bg-slate-50',
    title: 'text-slate-900',
    message: 'text-slate-700',
    button:
      'bg-slate-900 hover:bg-slate-700 focus-visible:outline-slate-900'
  },
  success: {
    container: 'border-emerald-200 bg-emerald-50',
    title: 'text-emerald-900',
    message: 'text-emerald-800',
    button:
      'bg-emerald-900 hover:bg-emerald-800 focus-visible:outline-emerald-900'
  }
};

interface FeedbackPanelProps {
  title: string;
  message: string;
  tone?: FeedbackTone;
  actionLabel?: string;
  onAction?: () => void;
  role?: 'alert' | 'status';
  className?: string;
}

export function FeedbackPanel({
  title,
  message,
  tone = 'error',
  actionLabel,
  onAction,
  role = 'alert',
  className
}: FeedbackPanelProps) {
  const styles = toneStyles[tone];

  return (
    <div
      className={twMerge('rounded-2xl border p-8 text-center shadow-sm', styles.container, className)}
      role={role}
    >
      <h2 className={twMerge('text-lg font-semibold', styles.title)}>{title}</h2>
      <p className={twMerge('mt-2 text-sm', styles.message)}>{message}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          className={twMerge(
            'mt-4 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
            styles.button
          )}
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  className
}: ErrorStateProps) {
  return (
    <FeedbackPanel
      title={title}
      message={message}
      tone="error"
      actionLabel={onRetry ? retryLabel : undefined}
      onAction={onRetry}
      className={className}
    />
  );
}

export function ForbiddenState({
  title = 'Access denied',
  message = 'You do not have permission to view this page.',
  actionLabel,
  onAction,
  className
}: Omit<FeedbackPanelProps, 'tone'>) {
  return (
    <FeedbackPanel
      title={title}
      message={message}
      tone="warning"
      actionLabel={actionLabel}
      onAction={onAction}
      className={className}
    />
  );
}

export function NotFoundState({
  title = 'Not found',
  message = 'The requested item could not be found.',
  actionLabel,
  onAction,
  className
}: Omit<FeedbackPanelProps, 'tone'>) {
  return (
    <FeedbackPanel
      title={title}
      message={message}
      tone="info"
      actionLabel={actionLabel}
      onAction={onAction}
      className={className}
    />
  );
}

export function ConflictState({
  title = 'Action unavailable',
  message,
  actionLabel,
  onAction,
  className
}: Omit<FeedbackPanelProps, 'tone'>) {
  return (
    <FeedbackPanel
      title={title}
      message={message}
      tone="warning"
      actionLabel={actionLabel}
      onAction={onAction}
      className={className}
    />
  );
}

export function SuccessBanner({
  title,
  message,
  className
}: {
  title: string;
  message: string;
  className?: string;
}) {
  return (
    <FeedbackPanel
      title={title}
      message={message}
      tone="success"
      role="status"
      className={twMerge('p-4 text-left', className)}
    />
  );
}

interface QueryStatusPanelProps {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isEmpty?: boolean;
  loadingMessage?: string;
  loadingAriaLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorTitle?: string;
  errorMessage?: string;
  onRetry?: () => void;
  children: ReactNode;
}

export function QueryStatusPanel({
  isLoading,
  isError,
  isSuccess,
  isEmpty = false,
  loadingMessage = 'Loading…',
  loadingAriaLabel = 'Loading',
  emptyTitle = 'Nothing here yet',
  emptyDescription = 'There is no data to display.',
  emptyActionLabel,
  onEmptyAction,
  errorTitle = 'Something went wrong',
  errorMessage = 'Unable to load data. Please try again.',
  onRetry,
  children
}: QueryStatusPanelProps) {
  if (isLoading) {
    return <LoadingState message={loadingMessage} ariaLabel={loadingAriaLabel} />;
  }

  if (isError) {
    return <ErrorState title={errorTitle} message={errorMessage} onRetry={onRetry} />;
  }

  if (isSuccess && isEmpty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  if (isSuccess) {
    return <>{children}</>;
  }

  return null;
}
